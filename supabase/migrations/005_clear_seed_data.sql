-- Clears demo seed businesses and related rows. business_templates retained for onboarding.

delete from public.redemptions;
delete from public.live_signals;
delete from public.collection_items;
delete from public.user_collections;
delete from public.user_behavior_events;
delete from public.feed_card_summaries;
delete from public.featured_businesses;
delete from public.current_business_status;
delete from public.perks;
delete from public.analytics_events;
delete from public.business_staff;
delete from public.businesses;
