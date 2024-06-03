import { absolutePos } from "../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../constants";
import { Agent } from "../Agent";

export function findEmptyCell(this: Agent, instant?: boolean) {
  const surroundings = [
    { col: this.col + 1, row: this.row },
    { col: this.col - 1, row: this.row },
    { col: this.col, row: this.row + 1 },
    { col: this.col, row: this.row - 1 },
  ].sort(() => Math.random() - 0.5);

  for (const { row, col } of surroundings) {
    if (!this.scene.grid.isWithinBounds(col, row)) continue;
    if (this.scene.grid.collisionMap[row][col]) continue;

    if (instant) {
      const x = absolutePos(col);
      const y = absolutePos(row);
      this.setPosition(x, y);
      this.col = col;
      this.row = row;
    } else {
      this.goto(col, row);
    }
  }
}
