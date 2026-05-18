/** Stylized app preview for marketing hero — mirrors live feed UX */
export function PhonePreview() {
  return (
    <div className="relative mx-auto w-[280px] rounded-[2.5rem] border-[10px] border-stone-800 bg-stone-900 p-2 shadow-2xl">
      <div className="overflow-hidden rounded-[1.75rem] bg-[#fdfbf7]">
        <div className="border-b border-[var(--sand)] px-4 pb-3 pt-8">
          <p className="text-xs text-stone-500">Good evening, Alex 👋</p>
          <p className="mt-1 text-sm font-semibold leading-snug">
            Perfect night for going out.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Tonight", "Low Wait", "Nearby", "Family", "Date Night"].map((c, i) => (
              <span
                key={c}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  i === 0
                    ? "bg-[#c9a227] text-white"
                    : "bg-[var(--sand)] text-stone-600"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 p-3">
          <FeedMini
            name="Strike City Bowling"
            status="No wait right now"
            detail="Cosmic bowling at 9PM"
            perk="Free shoe rental"
          />
          <FeedMini
            name="Tony's Pizzeria"
            status="10 min wait"
            detail="Kids eat free tonight"
            note="Patio open"
          />
          <FeedMini
            name="AMC Forum"
            status="Seats available"
            detail="Discount Tuesday"
            perk="$3 off tickets"
          />
        </div>

        <div className="flex justify-around border-t border-[var(--sand)] py-2 text-[9px] text-stone-500">
          <span className="font-medium text-[#c9a227]">Home</span>
          <span>Map</span>
          <span>Perks</span>
          <span>Account</span>
        </div>
      </div>
    </div>
  );
}

function FeedMini({
  name,
  status,
  detail,
  perk,
  note,
}: {
  name: string;
  status: string;
  detail: string;
  perk?: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--sand)] bg-white p-2.5">
      <p className="text-xs font-semibold">{name}</p>
      <p className="mt-0.5 text-[10px] font-medium text-emerald-700">{status}</p>
      <p className="text-[10px] text-stone-500">{detail}</p>
      {perk && (
        <p className="mt-1 text-[10px] font-medium text-amber-800">✨ {perk}</p>
      )}
      {note && <p className="mt-0.5 text-[10px] text-stone-500">{note}</p>}
    </div>
  );
}
