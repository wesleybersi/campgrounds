import { getRandomInt } from "../../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../../constants";

import { Grid } from "../../Grid";

export class Rock extends Phaser.GameObjects.Image {
  grid: Grid;
  col: number;
  row: number;
  resources = 25;
  markedForHarvest = false;
  harvestMultiplier = 0.1; // TODO Depends on size
  constructor(grid: Grid, col: number, row: number) {
    super(
      grid.scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      "rock-" + getRandomInt(1, 8).toString()
    );
    this.grid = grid;
    this.col = col;
    this.row = row;
    this.grid.collisionMap[row][col] = 1;
    this.grid.objectMatrix[row][col] = this;
    this.setDepth(this.y);
    this.grid.scene.add.existing(this);
  }

  harvest() {
    // new Resources("Wood")
    return this.resources;
  }
  remove() {
    this.grid.collisionMap[this.row][this.col] = 0;
    this.grid.objectMatrix[this.row][this.col] = null;
    this.destroy();
  }
}
