export function tierOfChoice(caseRecord, choiceId) {
  const choice = caseRecord.choices.find((c) => c.id === choiceId);
  return choice?.tier ?? "suboptimal";
}

export function isCorrectChoice(caseRecord, choiceId) {
  return choiceId === caseRecord.correct;
}

export function downgradeTier(tier) {
  switch (tier) {
    case "best":
      return "safe";
    case "safe":
      return "suboptimal";
    case "suboptimal":
      return "dangerous";
    default:
      return "dangerous";
  }
}

export function safetyCheckTypes(caseRecord) {
  return (caseRecord.safetyChecks ?? []).map((c) => c.type);
}

export function caughtStats(caseRecord) {
  const types = safetyCheckTypes(caseRecord);
  return {
    interactionsCaught: types.includes("interaction") ? 1 : 0,
    adrCaught: types.includes("adr") ? 1 : 0,
  };
}

export function tierLabel(tier) {
  switch (tier) {
    case "best":
      return "Perfect";
    case "safe":
      return "Safe";
    case "suboptimal":
      return "Suboptimal";
    default:
      return "Dangerous";
  }
}
