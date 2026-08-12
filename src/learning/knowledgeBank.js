import { cards } from "../data/knowledge.js";
import { touch } from "./spacedRepetition.js";

export function allCards() {
  return cards;
}

export function cardById(id) {
  return cards.find((c) => c.id === id) ?? null;
}

export function isUnlocked(state, cardId) {
  return state.knowledge.mastery[cardId] === true;
}

export function unlockCard(state, cardId) {
  if (isUnlocked(state, cardId)) return false;
  state.knowledge.mastery[cardId] = true;
  touch(state, cardId);
  return true;
}

export function unlockForCase(state, caseRecord) {
  const unlocked = [];
  for (const card of cards) {
    const byMedicine = card.relatedMedicine && caseRecord.relatedMedicines?.includes(card.relatedMedicine);
    const byObjective = (caseRecord.objectives ?? []).some((obj) => {
      const [subject, topic] = obj.split(":");
      return card.subject === subject && card.topic === topic;
    });
    if ((byMedicine || byObjective) && unlockCard(state, card.id)) {
      unlocked.push(card);
    }
  }
  return unlocked;
}

export function unlockedCards(state) {
  return cards.filter((c) => isUnlocked(state, c.id));
}

export function cardsBySubject(state, subject) {
  return cards.filter((c) => c.subject === subject);
}

export function subjects() {
  const seen = [];
  for (const c of cards) if (!seen.includes(c.subject)) seen.push(c.subject);
  return seen;
}

export function subjectUnlockCount(state, subject) {
  return cardsBySubject(state, subject).filter((c) => isUnlocked(state, c.id)).length;
}
