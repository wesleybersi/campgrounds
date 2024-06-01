import { getRandomInt, oneIn } from "../../../../../../utils/helper-functions";
import { Grid } from "../../Grid";
import { Tree, treeSets } from "../Tree/Tree";

export class Forest {
  grid: Grid;
  trees = new Set<Tree>();
  constructor(grid: Grid, iterations: number) {
    this.grid = grid;

    this.create(iterations);
  }
  create(
    iterations: number,
    initialCol = getRandomInt(this.grid.cols),
    initialRow = getRandomInt(this.grid.rows)
  ) {
    const expandForest = (col: number, row: number) => {
      if (oneIn(2)) {
        if (!this.grid.collisionMap[row][col]) {
          this.trees.add(new Tree(this.grid, this, col, row, 0));
        }
      }
      iterations--;
      if (iterations <= 0) return;
      const surroundings = [
        { col: col + 2, row },
        { col: col - 2, row },
        { col, row: row + 2 },
        { col, row: row - 2 },
      ];
      for (const side of surroundings.sort(() => Math.random() - 0.5)) {
        if (!this.grid.isWithinBounds(side.col, side.row)) continue;
        if (this.grid.objectMatrix[side.row][side.col]) continue;

        expandForest(side.col, side.row);
      }
    };
    expandForest(initialCol, initialRow);
  }
}
