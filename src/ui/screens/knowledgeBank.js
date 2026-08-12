import { el } from "../dom.js";
import { getState } from "../../core/state.js";
import { showScreen } from "../../core/router.js";
import { showToast } from "../components/toast.js";
import { play } from "../../audio/sound.js";
import { save } from "../../storage/save.js";
import { allCards, unlockedCards, isUnlocked, cardById } from "../../learning/knowledgeBank.js";
import { dueCards, recordReview, masteredCount } from "../../learning/spacedRepetition.js";

const SUBJECT_LABELS = {
  pharmacology: "Pharmacology",
  pharmaceutics: "Pharmaceutics",
  pharmaceuticalChemistry: "Chemistry",
  pharmacognosy: "Pharmacognosy",
  pharmacyPractice: "Practice",
};

const review = { queue: [], index: 0 };

export function render(container) {
  const state = getState();
  container.append(el("div", { class: "screen" }, [
    el("div", { class: "pharmacy-top" }, [
      el("button", { class: "btn-icon", text: "‹", "aria-label": "Back", onclick: () => { play("click"); showScreen("menu"); } }),
      el("h1", { class: "screen-title", text: "Knowledge Bank" }),
    ]),
    el("div", { class: "bank-summary", text: `${unlockedCards(state).length}/${allCards().length} cards · ${masteredCount(state)} mastered` }),
    el("button", { class: "btn-ghost bank-review-btn", text: reviewLabel(state), onclick: () => startReview(state) }),
    subjectsSection(state),
  ]));
}

function reviewLabel(state) {
  const due = dueCards(state, unlockedCards(state).map((c) => c.id));
  return `Review due (${due.length})`;
}

function subjectsSection(state) {
  const subjects = SUBJECT_LABELS;
  const seen = [];
  for (const c of allCards()) if (!seen.includes(c.subject)) seen.push(c.subject);
  return el("div", { class: "subject-list" }, seen.map((subject) => {
    const cards = allCards().filter((c) => c.subject === subject);
    const owned = cards.filter((c) => isUnlocked(state, c.id)).length;
    return el("div", { class: "subject-block" }, [
      el("h3", { class: "subject-title", text: `${subjects[subject] ?? subject} (${owned}/${cards.length})` }),
      el("div", { class: "card-grid" }, cards.map((c) => cardTile(state, c))),
    ]);
  }));
}

function cardTile(state, card) {
  const unlocked = isUnlocked(state, card.id);
  return el("button", {
    class: unlocked ? "kb-card" : "kb-card kb-locked",
    text: `${unlocked ? "" : "🔒 "}${card.title}`,
    onclick: () => { play("click"); showCardModal(state, card); },
  });
}

function showCardModal(state, card) {
  const modal = el("div", { class: "modal" }, [
    el("div", { class: "modal-box" }, [
      el("h3", { class: "modal-title", text: card.title }),
      el("p", { class: "modal-fact", text: card.fact }),
      el("p", { class: "modal-detail", text: card.detail }),
      el("p", { class: "modal-sub", text: `${SUBJECT_LABELS[card.subject] ?? card.subject} · ${card.topic} · ${card.level}` }),
      el("button", { class: "btn-primary", text: "Close", onclick: () => modal.remove() }),
    ]),
  ]);
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
  document.body.append(modal);
}

function startReview(state) {
  const due = dueCards(state, unlockedCards(state).map((c) => c.id));
  if (!due.length) {
    showToast("Nothing due right now. Play cases to unlock more!", "info");
    return;
  }
  review.queue = due;
  review.index = 0;
  play("click");
  showReviewCard(state);
}

function showReviewCard(state) {
  const card = cardById(review.queue[review.index]);
  const modal = el("div", { class: "modal" }, [
    el("div", { class: "modal-box" }, [
      el("h3", { class: "modal-title", text: "Recall · " + card.title }),
      el("p", { class: "modal-fact", text: card.fact }),
      el("div", { class: "modal-actions" }, [
        el("button", { class: "btn-ghost", text: "Not yet", onclick: () => answerReview(state, card, false, modal) }),
        el("button", { class: "btn-primary", text: "Got it", onclick: () => answerReview(state, card, true, modal) }),
      ]),
    ]),
  ]);
  document.body.append(modal);
}

function answerReview(state, card, correct, modal) {
  modal.remove();
  recordReview(state, card.id, correct);
  review.index += 1;
  save(state);
  play(correct ? "correct" : "incorrect");
  if (review.index >= review.queue.length) {
    showToast("Review complete!", "success");
    showScreen("knowledgeBank");
    return;
  }
  showReviewCard(state);
}
