import { Guest } from "../Guest";

export function updateNeeds(this: Guest, delta: number) {
  this.needs.hunger += 0.05 * delta;
  this.needs.bladder += 0.03 * delta;
  this.needs.energy -= 0.03 * delta;

  this.needs.fishing = 50;

  //ANCHOR Clamp values between 0 and 100
  for (const [need, value] of Object.entries(this.needs)) {
    this.needs[need] = Math.max(0, Math.min(100, value));
  }
}
