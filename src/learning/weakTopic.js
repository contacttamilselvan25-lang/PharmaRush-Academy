import { BALANCE } from "../config.js";

export function weakestSubject(state) {
  const per = state.stats.perSubject;
  let worst = null;
  for (const [subject, data] of Object.entries(per)) {
    if (data.attempts < BALANCE.WEAK_SUBJECT_MIN_ATTEMPTS) continue;
    const acc = data.attempts ? data.correct / data.attempts : 0;
    if (acc < BALANCE.WEAK_SUBJECT_THRESHOLD) {
      if (!worst || acc < worst.acc) worst = { subject, acc, attempts: data.attempts };
    }
  }
  return worst;
}
