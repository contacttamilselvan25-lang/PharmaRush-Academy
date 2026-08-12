export const patientProfiles = [
  { id: "adult", name: "Adult", minAge: 18, flags: [], traits: [] },
  { id: "elderly", name: "Elderly", minAge: 65, flags: ["polypharmacy", "reduced clearance"], traits: ["higher fall risk", "more drug sensitivity"] },
  { id: "pediatric", name: "Child", minAge: 2, flags: ["age-based dosing"], traits: ["doses depend on age/weight"] },
  { id: "chronic", name: "Chronic patient", minAge: 18, flags: ["long-term meds"], traits: ["regular follow-up needed"] },
  { id: "allergy", name: "Allergy-prone", minAge: 18, flags: ["known allergies"], traits: ["ask before dispensing"] },
  { id: "polypharmacy", name: "Multiple medicines", minAge: 18, flags: ["5+ medicines"], traits: ["interaction risk high"] },
  { id: "otc", name: "OTC enquiry", minAge: 18, flags: ["self-care"], traits: ["may not need a doctor"] },
  { id: "counselling", name: "Counselling request", minAge: 18, flags: ["new prescription"], traits: ["needs clear instructions"] },
];

export function profileById(id) {
  return patientProfiles.find((p) => p.id === id) ?? patientProfiles[0];
}

export default patientProfiles;
