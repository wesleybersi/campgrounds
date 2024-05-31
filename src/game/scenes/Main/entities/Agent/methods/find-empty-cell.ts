import { CELL_SIZE } from "../../../constants";
import { Agent } from "../Agent";

export function findEmptyCell(this: Agent) {
  const col = Math.floor(this.x / CELL_SIZE);
  const row = Math.floor(this.y / CELL_SIZE);

  const surroundings = [
    { col: col + 1, row: row },
    { col: col - 1, row: row },
    { col: col, row: row + 1 },
    { col: col, row: row - 1 },
  ].sort(() => Math.random() - 0.5);

  for (const surrounding of surroundings) {
    if (this.scene.grid.collisionMap[surrounding.row][surrounding.col])
      continue;
    this.goto(
      surrounding.col * CELL_SIZE + CELL_SIZE / 2,
      surrounding.row * CELL_SIZE + CELL_SIZE / 2
    );
  }
}
