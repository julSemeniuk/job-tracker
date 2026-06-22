import { tokenDurationToSeconds } from './token-duration';

describe('tokenDurationToSeconds', () => {
  it.each([
    ['30s', 30],
    ['15m', 900],
    ['2h', 7200],
    ['7d', 604800],
  ])('converts %s to seconds', (duration, expected) => {
    expect(tokenDurationToSeconds(duration)).toBe(expected);
  });

  it.each(['', '15', '0m', '-1h', '1w'])('rejects %s', (duration) => {
    expect(() => tokenDurationToSeconds(duration)).toThrow(
      `Invalid token duration: ${duration}`,
    );
  });
});
