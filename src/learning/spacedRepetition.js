const DAY_MS = 86400000;
export const INTERVALS_DAYS = [0, 1, 3, 7, 14, 30];
export const MASTER_BOX = 5;

export function boxInterval(box) {
  return INTERVALS_DAYS[Math.min(box, MASTER_BOX)] ?? 30;
}

export function touch(state, cardId) {
  const now = Date.now();
  state.knowledge.reviewBoxes[cardId] = {
    box: 0,
    firstSeen: now,
    lastReviewed: null,
    correct: 0,
    wrong: 0,
    nextReview: now,
  };
}

export function recordReview(state, cardId, correct) {
  const rec = state.knowledge.reviewBoxes[cardId];
  if (!rec) return null;
  const now = Date.now();
  if (correct) {
    rec.box = Math.min(MASTER_BOX, rec.box + 1);
    rec.correct += 1;
  } else {
    rec.box = 1;
    rec.wrong += 1;
  }
  rec.lastReviewed = now;
  rec.nextReview = now + boxInterval(rec.box) * DAY_MS;
  return rec;
}

export function dueCards(state, cardIds, now = Date.now()) {
  return cardIds.filter((id) => {
    const rec = state.knowledge.reviewBoxes[id];
    return rec && rec.nextReview <= now;
  });
}

export function isMastered(state, cardId) {
  return (state.knowledge.reviewBoxes[cardId]?.box ?? 0) >= MASTER_BOX;
}

export function masteredCount(state) {
  return Object.keys(state.knowledge.reviewBoxes).filter((id) => isMastered(state, id)).length;
}
