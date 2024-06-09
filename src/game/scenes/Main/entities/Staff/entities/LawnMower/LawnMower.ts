import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Worker } from "../Worker/Worker";

export class LawnMower extends Phaser.GameObjects.Rectangle {
  scene: MainScene;
  worker: Worker | null = null;
  col: number;
  row: number;
  constructor(scene: MainScene, col: number, row: number) {
    super(
      scene,
      absolutePos(col),
      absolutePos(row),
      CELL_SIZE,
      CELL_SIZE,
      0x746293
    );
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.setStrokeStyle(4, 0xffffff);
    this.scene.grid.objectMatrix[row][col] = this;
    this.scene.add.existing(this);
  }
  update() {
    if (this.worker) {
      switch (this.worker.facing) {
        case "right":
          this.setOrigin(-0.25, 0.5);
          break;
        case "left":
          this.setOrigin(1.25, 0.5);
          break;
        case "up":
          this.setOrigin(0.5, 1.25);
          break;
        case "down":
          this.setOrigin(0.5, 0.25);
          break;
      }
    }
    this.setPosition(this.worker?.x, this.worker?.y);
  }
}
