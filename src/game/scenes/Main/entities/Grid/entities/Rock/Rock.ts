import { CELL_SIZE } from "../../../../constants";
import { Grid } from "../../Grid";

export class Rock extends Phaser.GameObjects.Arc {
  grid: Grid;
  col: number;
  row: number;
  constructor(grid: Grid, col: number, row: number) {
    super(
      grid.scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.grid.collisionMap[row][col] = 1;
    this.grid.objectMatrix[row][col] = this;

    this.setFillStyle(0x777777);

    this.grid.scene.add.existing(this);
  }
  remove() {
    this.grid.collisionMap[this.row][this.col] = 0;
    this.grid.objectMatrix[this.row][this.col] = null;
    this.destroy();
  }
}
