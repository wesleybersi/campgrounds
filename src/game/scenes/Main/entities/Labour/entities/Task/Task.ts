import MainScene from "../../../../MainScene";
import { Worker } from "../../types";
import { ProgressBar } from "../../../ProgressBar/ProgressBar";
import { absolutePos } from "../../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../../constants";

export class Task {
  scene: MainScene;
  col: number;
  row: number;
  laborer: "forester" | "builder";
  progress = 0;
  multiplier = 0;
  isCompleted = false;
  worker: Worker | null = null;
  bar: ProgressBar;
  placeholder: Phaser.GameObjects.Rectangle;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  constructor(
    scene: MainScene,
    laborer: "forester" | "builder",
    col: number,
    row: number,
    multiplier: number,
    onProgress?: (progress: number) => void,
    onComplete?: () => void
  ) {
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.laborer = laborer;
    this.multiplier = multiplier;
    this.bar = new ProgressBar(this, col, row);
    this.placeholder = this.scene.add
      .rectangle(absolutePos(col), absolutePos(row), CELL_SIZE, CELL_SIZE)
      .setStrokeStyle(1, 0xffffff);
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.scene.labour.taskGrid[this.row][this.col] = this;
    this.scene.labour.queuedTasks.push(this);
  }
  advance(delta: number) {
    this.progress += delta * this.multiplier;
    this.bar.update(this.progress);
    if (this.onProgress) this.onProgress(this.progress);
    if (this.progress >= 1) {
      if (this.onComplete) this.onComplete();
      this.remove();
    }
  }
  remove() {
    this.bar.remove();
    this.placeholder.destroy();
    this.isCompleted = true;
    this.scene.labour.removeTask(this);

    if (this.worker) {
      this.worker.task = null;
      this.worker.goto(this.worker.col, this.worker.row);
    }
  }
}
