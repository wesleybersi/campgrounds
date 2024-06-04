import {
  absolutePos,
  getRandomInt,
} from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Task } from "../../../Labour/entities/Task/Task";

import { Notification } from "../../../Notification/Notification";
import { Grid } from "../../Grid";

import { Forest } from "../Forest/Forest";

export const treeSets: string[][] = [
  ["tree-a1", "tree-a2"],
  ["tree-b1", "tree-b2", "tree-b3"],
  ["tree-c1", "tree-c2", "tree-c3"],
  ["tree-d1", "tree-d2"],
  ["tree-e1"],
  ["tree-f1"],
];

export class Tree extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  forest: Forest | null = null;
  row: number;
  col: number;
  growth = 0.1;
  maxResources = 25;
  harvestMultiplier = 0.1; // TODO Depends on size
  constructor(
    grid: Grid,
    forest: Forest | null,
    col: number,
    row: number,
    set: number
  ) {
    super(
      grid.scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      treeSets[set][getRandomInt(treeSets[set].length)]
    );
    this.scene = grid.scene;
    this.forest = forest;

    // this.tile = this.scene.add.rectangle(
    //   col * CELL_SIZE + CELL_SIZE / 2,
    //   row * CELL_SIZE + CELL_SIZE / 2,
    //   CELL_SIZE,
    //   CELL_SIZE
    // );
    // this.tile.setStrokeStyle(2, 0x000000);
    // this.tile.setDepth(1000);

    this.row = row;
    this.col = col;
    const xOffset = getRandomInt(-CELL_SIZE / 4, CELL_SIZE / 4);
    const yOffset = getRandomInt(-CELL_SIZE / 4, CELL_SIZE / 4);
    // if (randomSize) {
    // this.growth = getRandomInt(10, 125) / 100;
    // this.setScale(this.growth);
    // }
    this.setOrigin(0.5, 0.75);
    // const alphaOffset = getRandomInt(50, 100) / 100;
    // this.setAlpha(alphaOffset);
    this.setDepth(this.y);
    // const scale = getRandomInt(-24, 8) / 100;
    // this.setScale(1 + scale);
    // this.setSize(this.maxSize * this.growth, this.maxSize * this.growth);
    // this.setScale(this.maxSize * this.growth, this.maxSize * this.growth)

    this.x += xOffset;
    this.y += yOffset;
    // this.setAngle(getRandomInt(-180, 180));

    grid.objectMatrix[row][col] = this;
    this.scene.add.existing(this);

    this.on("pointerover", () => {
      console.log("oi?");
    });
  }

  grow() {
    this.growth = Math.min(this.growth + 0.025, 1);
    // this.setSize(this.maxSize * this.growth, this.maxSize * this.growth);
  }

  harvest() {
    return Math.floor(this.maxResources * this.growth);
  }
  remove() {
    this.forest?.trees.delete(this);
    this.scene.grid.objectMatrix[this.row][this.col] = null;

    this.destroy();
  }
}
