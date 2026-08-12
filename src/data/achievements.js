export const achievements = [
  { id: "ach_first_patient", name: "First Patient", desc: "Complete your first case", condition: { stat: "casesCompleted", op: ">=", value: 1 }, rewards: { xp: 20, coins: 10 } },
  { id: "ach_first_perfect", name: "Perfect Service", desc: "Complete a case perfectly", condition: { stat: "perfectCases", op: ">=", value: 1 }, rewards: { xp: 30, coins: 15 } },
  { id: "ach_patients_100", name: "People's Pharmacist", desc: "Serve 100 patients", condition: { stat: "patientsServed", op: ">=", value: 100 }, rewards: { xp: 200, coins: 100 } },
  { id: "ach_patients_500", name: "Community Pillar", desc: "Serve 500 patients", condition: { stat: "patientsServed", op: ">=", value: 500 }, rewards: { xp: 500, coins: 250 } },
  { id: "ach_interactions_5", name: "Interaction Hunter", desc: "Handle 5 interaction warnings", condition: { stat: "interactionsCaught", op: ">=", value: 5 }, rewards: { xp: 100, coins: 50 } },
  { id: "ach_adr_5", name: "ADR Detective", desc: "Identify 5 adverse drug reactions", condition: { stat: "adrCaught", op: ">=", value: 5 }, rewards: { xp: 100, coins: 50 } },
  { id: "ach_streak_5", name: "Zero-Error Streak", desc: "Get 5 perfect cases in a row", condition: { stat: "zeroErrorStreak", op: ">=", value: 5 }, rewards: { xp: 120, coins: 60 } },
  { id: "ach_boss_1", name: "Clinical Boss Defeated", desc: "Complete a boss case", condition: { stat: "bossCompleted", op: ">=", value: 1 }, rewards: { xp: 150, coins: 80 } },
  { id: "ach_level_10", name: "Junior Pharmacist", desc: "Reach level 10", condition: { stat: "level", op: ">=", value: 10 }, rewards: { xp: 100, coins: 100 } },
  { id: "ach_knowledge_10", name: "Knowledge Collector", desc: "Unlock 10 knowledge cards", condition: { stat: "cardsUnlocked", op: ">=", value: 10 }, rewards: { xp: 100, coins: 50 } },
];

export default achievements;
