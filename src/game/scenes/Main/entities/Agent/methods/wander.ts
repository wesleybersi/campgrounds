import { getRandomInt, oneIn } from "../../../../../utils/helper-functions";
import { Agent } from "../Agent";

export function wander(
  this: Agent
  // vicinity?: {
  //   cols: { min: number; max: number };
  //   rows: { min: number; max: number };
  // }
) {
  if (!this.isActive) return;
  const movementProbability = 500;
  if (oneIn(movementProbability)) {
    const maxDistance = 3;
    const colDistance = getRandomInt(maxDistance);
    const rowDistance = getRandomInt(maxDistance);
    const col = getRandomInt(this.col - colDistance, this.col + colDistance);
    const row = getRandomInt(this.row - rowDistance, this.row + rowDistance);
    this.goto(col, row);
  }
}
