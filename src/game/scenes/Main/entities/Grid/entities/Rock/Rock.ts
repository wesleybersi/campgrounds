import { getRandomInt } from "../../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../../constants";
import { CutStone } from "../../../Labour/force/Forester/tasks/CutStone";
import { Grid } from "../../Grid";

export class Rock extends Phaser.GameObjects.Image {
  grid: Grid;
  col: number;
  row: number;
  resources = 25;
  markedForHarvest = false;
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

    this.grid.scene.add.existing(this);
  }
  markForHarvest() {
    if (!this.markedForHarvest) {
      new CutStone(this.grid.scene, this);
      this.markedForHarvest = true;
      this.setTint(0xff0000);
    }
  }

  harvest() {
    this.remove();
    return this.resources;
  }
  remove() {
    this.grid.collisionMap[this.row][this.col] = 0;
    this.grid.objectMatrix[this.row][this.col] = null;
    this.destroy();
  }
}
