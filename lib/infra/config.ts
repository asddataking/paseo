const DEFAULT_WAIT = ["No wait", "Low wait", "Moderate", "Busy", "Packed"];
const DEFAULT_AVAILABILITY = ["Open", "Limited", "At capacity", "Closed"];
const DEFAULT_SIGNALS = [
  "Live music tonight",
  "Happy hour",
  "Family night",
  "Special event",
];

export function parseBusinessConfig(config: unknown) {
  const c = (config ?? {}) as Record<string, unknown>;
  return {
    waitLabels: Array.isArray(c.wait_labels)
      ? (c.wait_labels as string[])
      : DEFAULT_WAIT,
    availabilityLabels: Array.isArray(c.availability_labels)
      ? (c.availability_labels as string[])
      : DEFAULT_AVAILABILITY,
    signalOptions: Array.isArray(c.signal_options)
      ? (c.signal_options as string[])
      : DEFAULT_SIGNALS,
  };
}
