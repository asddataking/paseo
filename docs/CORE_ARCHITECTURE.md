# Paseo Core Architecture (Backend Alignment)

**Product:** Real-time low-friction life operating layer — not coupons, social, or a directory.

**Mental model:** Businesses broadcast **live operational streams**. Users receive **friction-reducing recommendations**.

---

## Four system layers

| Layer | Responsibility | MVP implementation |
|-------|----------------|----------------------|
| **1. Infra** | Business signal ingestion | `/infra` → `live_signals` inserts |
| **2. Event stream** | Realtime distribution | Supabase Realtime on `live_signals`, `current_business_status`, `user_behavior_events` |
| **3. Intelligence** | Ranking + personalization + cheap AI | `lib/feed/scoreExperience.ts`, `feed_card_summaries` cache |
| **4. Experience** | Calm intelligent home feed | `/app` consumes ranked `FeedCard` objects |

---

## Event-centric data model

Everything important is a **timestamped event**:

- `live_signals` — operational broadcasts (core)
- `user_behavior_events` — taste/affinity learning (Pinterest-style, not social)
- `analytics_events` — admin/ops metrics (kept separate from personalization)

**Denormalized read model:** `current_business_status` powers fast feed renders without scanning signal history.

---

## Table alignment (spec vs database)

### `businesses` — aligned

Claimed Google-place entities. Extra MVP columns: `phone`, `website`, `business_config` (Infra chip config).

### `live_signals` — aligned (migration 004)

| Spec | Database |
|------|----------|
| `signal_value` | `signal_value` jsonb (+ legacy `value` during transition) |
| `metadata` | `metadata` jsonb |
| `signal_type` | Expanded: `wait_status`, `availability`, `event_active`, `perk_active`, `note`, `family_friendly`, `patio_open` (+ legacy `event`, `perk`) |

Emit shape:

```json
{
  "signal_type": "wait_status",
  "signal_value": { "label": "no_wait" }
}
```

### `current_business_status` — aligned

| Spec | Database |
|------|----------|
| `active_signals` jsonb | `active_signals` — array of `{ type, label, at }` |
| `wait_status`, `availability_status`, `active_perk_id` | Kept for fast filters + backward compat |
| `active_note` | Legacy; synced from signals; prefer `active_signals` in UI |

### `user_behavior_events` — **added**

Personalization inputs: `viewed_card`, `saved_business`, `redeemed_perk`, `ignored_card`, `opened_map`, `tapped_directions`, `added_to_collection`, `expanded_card`.

### `user_collections` + `collection_items` — **added**

Preference learning (Date Night, Family Night, etc.) — **not** social graph.

### `feed_card_summaries` — **added**

Cached Gemini Flash summaries (`ai_summary`, `context_hash`, `expires_at` ~2h) — cheap AI, no giant prompts per request.

### Unchanged (admin / membership)

- `profiles`, `perks`, `redemptions`, `featured_businesses`
- `copilot_messages`, `pending_copilot_actions`
- `business_templates`, `business_staff`
- `analytics_events` — admin Copilot + dashboard ops (not user feed ranking)

---

## Home feed card contract

```ts
type FeedCard = {
  businessName: string;
  photo: string | null;
  waitStatus: string | null;
  activeSignals: { type: string; label: string }[];
  activePerk: Perk | null;
  aiSummary: string | null;           // from feed_card_summaries or rule-based fallback
  personalizedReason: string | null; // from scoreExperienceForUser()
  distance: string | null;            // placeholder until location
  lastUpdated: string;
  score: number;
};
```

Built by: `lib/feed/buildFeed.ts` → `scoreExperienceForUser()` → sort desc.

---

## Ranking engine

`scoreExperienceForUser(userId, business, status, context)` weights:

- signalFreshness
- distanceScore (placeholder)
- waitScore (lower wait = higher)
- perkScore
- userAffinity (collections + behavior events)
- timeRelevance (hour/day)
- weatherRelevance (stub)
- membershipBoost
- businessQualityBoost (featured, infra tier)

**Not chatbot-first AI** — lightweight summaries cached in `feed_card_summaries`.

---

## Realtime flow

```
Infra button tap
  → INSERT live_signals (signal_value)
  → TRIGGER sync_current_business_status
  → Realtime broadcast
  → Client feed re-ranks / refreshes
```

---

## Next steps (when resuming build)

1. Drop legacy `live_signals.value` column (migration 005)
2. Revoke EXECUTE on security definer helpers from `anon` (advisor warnings)
3. Wire `emitSignal()` to `signal_value` only
4. Implement `trackBehavior()` on card interactions
5. Edge Function for batch AI summary refresh (optional)
6. Redis queue later for ranking at scale
