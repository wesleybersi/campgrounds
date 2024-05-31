import { getRandomInt } from "../../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../../constants";
import { Woodcutting } from "../../../Labour/force/Forester/tasks/Woodcutting";

import { Forest } from "../Forest/Forest";

export class Tree extends Phaser.GameObjects.Triangle {
  forest: Forest;
  row: number;
  col: number;
  growth = 0.1;
  maxResources = 25;
  maxSize = CELL_SIZE * 1.5;
  markedForHarvest = false;
  harvestTarget: Woodcutting | null = null;
  stem: Phaser.GameObjects.Rectangle;
  constructor(forest: Forest, col: number, row: number, randomSize: boolean) {
    super(
      forest.grid.scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2
      // CELL_SIZE / 8,
      // CELL_SIZE / 8,
      // 0x345c0b
    );
    this.setFillStyle(0x345c0b);
    // forest.grid.collisionMap[row][col] = 1;
    this.row = row;
    this.col = col;
    this.forest = forest;
    const xOffset = getRandomInt(-CELL_SIZE / 4, CELL_SIZE / 4);
    const yOffset = getRandomInt(-CELL_SIZE / 4, CELL_SIZE / 4);
    if (randomSize) {
      this.growth = getRandomInt(10, 100) / 100;
    }
    const alphaOffset = getRandomInt(50, 100) / 100;
    this.setAlpha(alphaOffset);
    const scale = getRandomInt(2, 65) / 100;
    this.setScale(scale);
    // this.setSize(this.maxSize * this.growth, this.maxSize * this.growth);
    // this.setScale(this.maxSize * this.growth, this.maxSize * this.growth)

    this.x += xOffset;
    this.y += yOffset;
    // this.setAngle(getRandomInt(-180, 180));

    this.setDepth(10);
    forest.grid.scene.add.existing(this);
    forest.grid.objectMatrix[row][col] = this;

    this.stem = forest.grid.scene.add
      .rectangle(this.x, this.y, this.width / 8, this.height / 3)
      .setFillStyle(0x5c3e28)
      .setScale(scale)
      .setOrigin(0.5, -0.75)
      .setAlpha(alphaOffset);
  }
  grow() {
    this.growth = Math.min(this.growth + 0.025, 1);
    // this.setSize(this.maxSize * this.growth, this.maxSize * this.growth);
  }
  markForHarvest() {
    if (this.markedForHarvest) return;
    this.markedForHarvest = true;
    this.isStroked = true;
    this.setStrokeStyle(CELL_SIZE / 8, 0xff0000);
    this.harvestTarget = new Woodcutting(this.forest.grid.scene, this);
  }
  unmarkForHarvest() {
    this.markedForHarvest = false;
    this.isStroked = false;
    this.harvestTarget?.remove();
    this.harvestTarget = null;
  }
  harvest() {
    this.remove();
    return Math.floor(this.maxResources * this.growth);
  }
  remove() {
    this.forest.trees.delete(this);
    this.forest.grid.objectMatrix[this.row][this.col] = null;
    this.stem.destroy();
    this.destroy();
  }
}
