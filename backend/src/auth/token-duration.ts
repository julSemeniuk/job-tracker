const TOKEN_DURATION_PATTERN = /^(\d+)(s|m|h|d)$/;

const UNIT_SECONDS = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
} as const;

export function tokenDurationToSeconds(value: string): number {
  const match = TOKEN_DURATION_PATTERN.exec(value);

  if (!match) {
    throw new Error(`Invalid token duration: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2] as keyof typeof UNIT_SECONDS;

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error(`Invalid token duration: ${value}`);
  }

  return amount * UNIT_SECONDS[unit];
}
