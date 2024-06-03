import {
  absolutePos,
  getRandomInt,
} from "../../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../../constants";
import { Task } from "../../../Labour/entities/Task/Task";
import { Notification } from "../../../Notification/Notification";
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
    this.setDepth(this.y);
    this.grid.scene.add.existing(this);
  }
  markForHarvest() {
    if (this.markedForHarvest) return;
    this.markedForHarvest = true;
    this.setTint(0xff8888);
    new Task(
      this.grid.scene,
      "forester",
      this.col,
      this.row + 1,
      0.1,
      undefined,
      () => {
        const resources = this.harvest();

        new Notification(
          this.grid.scene,
          `+${resources} stone`,
          absolutePos(this.col),
          absolutePos(this.row)
        );
        this.grid.scene.client.inventory.materials.wood += resources;
        this.remove();
      }
    );
  }

  harvest() {
    return this.resources;
  }
  remove() {
    this.grid.collisionMap[this.row][this.col] = 0;
    this.grid.objectMatrix[this.row][this.col] = null;
    this.destroy();
  }
}
