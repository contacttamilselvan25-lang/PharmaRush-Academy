export function counsellingResult(caseRecord, selectedIds) {
  const points = caseRecord.counselling ?? [];
  const selected = new Set(selectedIds);
  const correctPoints = points.filter((p) => p.correct);
  const wrongSelected = points.filter((p) => !p.correct && selected.has(p.id));
  const allCorrectSelected = correctPoints.every((p) => selected.has(p.id));
  return {
    ok: allCorrectSelected && wrongSelected.length === 0,
    correctSelected: correctPoints.filter((p) => selected.has(p.id)).length,
    totalCorrect: correctPoints.length,
    wrongSelected,
  };
}
