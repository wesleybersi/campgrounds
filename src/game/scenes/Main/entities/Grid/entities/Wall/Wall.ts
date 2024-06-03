import { CELL_SIZE } from "../../../../constants";
import { Grid } from "../../Grid";

export class Wall extends Phaser.GameObjects.Rectangle {
  grid: Grid;
  col: number;
  row: number;
  constructor(grid: Grid, type: "wood" | "hedge", col: number, row: number) {
    super(
      grid.scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE
    );
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.grid.collisionMap[row][col] = 1;
    this.grid.objectMatrix[row][col] = this;
    this.setDepth(this.y);

    switch (type) {
      case "wood":
        this.setFillStyle(0x5c3e28);
        break;
      case "hedge":
        this.setFillStyle(0x3c661c);
        break;
    }
    this.grid.scene.add.existing(this);
  }
  remove() {
    this.grid.collisionMap[this.row][this.col] = 0;
    this.grid.objectMatrix[this.row][this.col] = null;
    this.destroy();
  }
}
