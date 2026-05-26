export const normalizeTaskText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(normalizeTaskText).join("");

  if (value && typeof value === "object") {
    const maybeElement = value as { props?: { children?: unknown } };
    if ("props" in maybeElement) {
      return normalizeTaskText(maybeElement.props?.children);
    }
  }

  return "";
};
