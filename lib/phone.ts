/**
 * Bangladesh-friendly phone normalization.
 * Returns a normalized E.164-like string (+8801XXXXXXXXX) for BD numbers.
 */
export function normalizePhone(input: string): string {
  // Remove spaces, hyphens, parentheses, dots
  let digits = input.trim().replace(/[\s\-().]/g, "");

  // Handle leading + separately
  let hasPlus = digits.startsWith("+");
  if (hasPlus) digits = digits.slice(1);

  // Remove all non-digit chars now
  digits = digits.replace(/\D/g, "");

  if (hasPlus) {
    // e.g. +8801XXXXXXXXX  → keep as is
    return "+" + digits;
  }

  // "8801XXXXXXXXX" (13 digits) → "+8801XXXXXXXXX"
  if (digits.startsWith("8801") && digits.length === 13) {
    return "+" + digits;
  }

  // "01XXXXXXXXX" (11 digits) → "+8801XXXXXXXXX"
  if (digits.startsWith("01") && digits.length === 11) {
    return "+88" + digits;
  }

  // fallback: return with + prefix
  return "+" + digits;
}

/**
 * Returns true if the normalized phone looks valid (min 11 digits total after normalization).
 */
export function isValidPhone(input: string): boolean {
  const normalized = normalizePhone(input);
  const digitCount = normalized.replace(/\D/g, "").length;
  return digitCount >= 11;
}
