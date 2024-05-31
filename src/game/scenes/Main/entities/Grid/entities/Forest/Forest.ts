import { getRandomInt, oneIn } from "../../../../../../utils/helper-functions";
import { Grid } from "../../Grid";
import { Tree } from "../Tree/Tree";

export class Forest {
  grid: Grid;
  trees = new Set<Tree>();
  constructor(grid: Grid) {
    this.grid = grid;
    const iterations = getRandomInt(1000);
    this.create(iterations);
  }
  create(
    iterations: number,
    initialCol = getRandomInt(this.grid.cols),
    initialRow = getRandomInt(this.grid.rows)
  ) {
    const expandForest = (col: number, row: number) => {
      if (oneIn(2)) {
        this.trees.add(new Tree(this, col, row, true));
      }
      iterations--;
      if (iterations <= 0) return;
      const surroundings = [
        { col: col + 1, row },
        { col: col - 1, row },
        { col, row: row + 1 },
        { col, row: row - 1 },
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
