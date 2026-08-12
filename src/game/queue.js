const FIRST_NAMES = [
  "Meera", "Ravi", "Anita", "Joseph", "Lakshmi", "Ahmed",
  "Priya", "David", "Sara", "Ramesh", "Nisha", "Kavita",
];

const COMPLAINTS = [
  "Prescription refill",
  "Persistent cough",
  "Frequent headaches",
  "Skin rash",
  "Diabetic check-up",
  "Blood pressure review",
  "Stomach pain",
  "Seasonal allergy",
  "Medicine query",
  "Existing meds review",
];

let counter = 0;

export function createCustomer() {
  counter += 1;
  return {
    id: `cust_${counter}`,
    name: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)],
    complaint: COMPLAINTS[Math.floor(Math.random() * COMPLAINTS.length)],
    waitingSince: Date.now(),
  };
}

export function createQueue(size = 3) {
  return Array.from({ length: size }, createCustomer);
}

export function nextCustomer(queue) {
  return queue.length ? queue.shift() : null;
}

export function fillQueue(queue, targetSize = 3) {
  while (queue.length < targetSize) queue.push(createCustomer());
}