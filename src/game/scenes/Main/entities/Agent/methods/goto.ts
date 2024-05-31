import { CELL_SIZE } from "../../../constants";
import { Agent } from "../Agent";

export function goto(this: Agent, x: number, y: number): boolean {
  //Returns true if a path was succesfully provided

  if (
    !this.scene.grid.isWithinBounds(
      Math.floor(x / CELL_SIZE),
      Math.floor(y / CELL_SIZE)
    )
  ) {
    return false;
  }

  this.path = [];

  const startPos = {
    x: Math.floor(this.x / CELL_SIZE),
    y: Math.floor(this.y / CELL_SIZE),
  };
  const goalPos = {
    x: Math.floor(x / CELL_SIZE),
    y: Math.floor(y / CELL_SIZE),
  };

  const generatedPath = this.scene.grid.pathFinder.findPath(startPos, goalPos);

  for (const cell of generatedPath) {
    this.path.push({ x: cell[0], y: cell[1] });
  }

  this.target = { x, y };

  if (this.path.length > 0) {
    return true;
  } else return false;
}
