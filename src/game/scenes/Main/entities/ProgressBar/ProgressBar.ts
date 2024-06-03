import { absolutePos } from "../../../../utils/helper-functions";
import MainScene from "../../MainScene";
import { CELL_SIZE } from "../../constants";
import { Task } from "../Labour/entities/Task/Task";
import { Activity } from "../Recreation/entities/Activity/Activity";

export class ProgressBar extends Phaser.GameObjects.Rectangle {
  task: Task | Activity;
  progress: Phaser.GameObjects.Rectangle;
  constructor(task: Task | Activity, col: number, row: number) {
    super(
      task.scene,
      absolutePos(col),
      absolutePos(row),
      CELL_SIZE * 1.75,
      CELL_SIZE / 4,
      0x000000,
      0.5
    );
    this.task = task;
    this.progress = this.task.scene.add
      .rectangle(this.x - this.width / 2, this.y, 0, this.height)
      .setFillStyle(0x00ff00)
      .setOrigin(0, 0.5)
      .setAlpha(0.8);
    this.task.scene.add.existing(this);
    this.setDepth(this.task.scene.topDepth);
    this.progress.setDepth(this.task.scene.topDepth + 1);
    this.setAlpha(0);
  }
  update(progress: number) {
    this.setAlpha(1);
    this.progress.width = this.width * progress;
  }
  remove() {
    this.progress.destroy();
    this.destroy();
  }
}
