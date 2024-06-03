import { Agent } from "../Agent";

export function goto(this: Agent, col: number, row: number): boolean {
  if (!this.isActive) return false;
  //Returns true if a path was succesfully provided
  if (!this.scene.grid.isWithinBounds(col, row)) {
    return false;
  }

  this.path = [];

  const startPos = {
    x: this.col,
    y: this.row,
  };
  const goalPos = {
    x: col,
    y: row,
  };

  const generatedPath = this.scene.grid.pathFinder.findPath(startPos, goalPos);

  for (const cell of generatedPath) {
    this.path.push({ col: cell[0], row: cell[1] });
  }

  this.target = { col, row };

  if (this.path.length > 0) {
    return true;
  } else {
    return false;
  }
}
