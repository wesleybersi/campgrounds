import { absolutePos } from "../../../../utils/helper-functions";
import { CELL_SIZE } from "../../constants";
import { Task } from "../Staff/entities/Task/Task";
import { Activity } from "../Recreation/entities/Activity/Activity";

export class ProgressBar extends Phaser.GameObjects.Rectangle {
  task: Task | Activity;
  // progress: Phaser.GameObjects.Rectangle;
  constructor(task: Task | Activity, col: number, row: number) {
    super(
      task.scene,
      absolutePos(col),
      absolutePos(row) + CELL_SIZE / 2,
      CELL_SIZE,
      0,
      0x00ff00,
      0.75
    );
    this.task = task;
    this.setOrigin(0.5);

    // this.progress = this.task.scene.add
    //   .rectangle(this.x - this.width / 2, this.y, 0, this.height)
    //   .setFillStyle(0x00ff00)
    //   .setOrigin(0, 0.5)
    //   .setAlpha(0.8);
    this.task.scene.add.existing(this);
    // this.setDepth(this.task.scene.topDepth);
  }
  update(progress: number) {
    this.setAlpha(1);
    this.height = -(CELL_SIZE * progress);
  }
  remove() {
    this.destroy();
  }
}
