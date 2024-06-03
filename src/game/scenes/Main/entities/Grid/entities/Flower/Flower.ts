import { getRandomInt, oneIn } from "../../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../../constants";
import { Task } from "../../../Labour/entities/Task/Task";

import { Grid } from "../../Grid";

const flowerTypes = [
  "flower-a",
  "flower-b",
  "flower-c",
  "flower-d",
  "flower-e",
  "flower-f",
];

export class Flower extends Phaser.GameObjects.Image {
  grid: Grid;
  col: number;
  row: number;
  resources = 25;
  markedForHarvest = false;
  growth = 0;
  lifeCycle = getRandomInt(8, 20);
  constructor(grid: Grid, col: number, row: number, randomGrowth?: boolean) {
    super(
      grid.scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      flowerTypes[getRandomInt(flowerTypes.length)],
      0
    );
    this.grid = grid;
    this.col = col;
    this.row = row;
    this.setDepth(this.y);
    if (randomGrowth) {
      this.growth = getRandomInt(0, 6);
      this.setFrame(this.growth);
    }

    const xOffset = getRandomInt(-CELL_SIZE / 2, CELL_SIZE / 2);
    const yOffset = getRandomInt(-CELL_SIZE / 2, CELL_SIZE / 2);
    this.x += xOffset;
    this.y += yOffset;

    if (oneIn(2)) {
      this.setFlipX(true);
    }

    this.grid.objectMatrix[row][col] = this;

    this.grid.scene.add.existing(this);
  }
  grow() {
    this.growth++;
    if (this.growth >= 5) this.growth = 5;
    this.setFrame(this.growth);
  }
  markForHarvest() {
    if (!this.markedForHarvest) {
      this.markedForHarvest = true;
      this.setTint(0xff0000);
      new Task(
        this.grid.scene,
        "forester",
        this.col,
        this.row,
        0.5,
        undefined,
        () => {
          this.harvest();
        }
      );
    }
  }

  harvest() {
    this.remove();
    return this.resources;
  }
  remove() {
    this.grid.objectMatrix[this.row][this.col] = null;
    this.destroy();
  }
}
