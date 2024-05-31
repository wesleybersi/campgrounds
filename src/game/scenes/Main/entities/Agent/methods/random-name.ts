import { Agent } from "../Agent";

export function generateRandomName(this: Agent) {
  const firstNames: string[] = [
    "John",
    "Jane",
    "Alex",
    "Emily",
    "Chris",
    "Katie",
    "Michael",
    "Sarah",
    "David",
    "Laura",
    "Daniel",
    "Jessica",
    "James",
    "Amanda",
    "Matthew",
    "Ashley",
    "Andrew",
    "Megan",
    "Joshua",
    "Samantha",
  ];

  const lastNames: string[] = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
  ];

  const randomFirstName: string =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName: string =
    lastNames[Math.floor(Math.random() * lastNames.length)];

  this.name = `${randomFirstName} ${randomLastName}`;
}
