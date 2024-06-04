import MainScene from "../../../../MainScene";
import { Worker } from "../../types";
import { ProgressBar } from "../../../ProgressBar/ProgressBar";
import { absolutePos } from "../../../../../../utils/helper-functions";
import { CELL_SIZE } from "../../../../constants";

export type Vicinity = { row: number; col: number }[];
export class Task {
  scene: MainScene;
  initialCol: number;
  initialRow: number;
  col: number;
  row: number;
  laborer: "forester" | "builder";
  progress = 0;
  multiplier = 0;
  isCompleted = false;
  worker: Worker | null = null;
  bar: ProgressBar;
  placeholder: Phaser.GameObjects.Rectangle;
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;

  constructor(
    scene: MainScene,
    laborer: "forester" | "builder",
    col: number,
    row: number,
    multiplier: number,
    onProgress?: (progress: number) => void,
    onComplete?: () => void,
    color?: number
  ) {
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.initialCol = col;
    this.initialRow = row;
    this.laborer = laborer;
    this.multiplier = multiplier;
    this.bar = new ProgressBar(this, col, row);
    this.placeholder = this.scene.add
      .rectangle(absolutePos(col), absolutePos(row), CELL_SIZE, CELL_SIZE)
      .setStrokeStyle(1, color ?? 0xffffff);
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
  getVicinityInstead(): { row: number; col: number } | null {
    const surroundings = {
      bottomLeft: { row: this.row + 1, col: this.col - 1 },
      bottom: { row: this.row + 1, col: this.col },
      bottomRight: { row: this.row + 1, col: this.col + 1 },
      left: { row: this.row, col: this.col - 1 },
      right: { row: this.row, col: this.col + 1 },
      topLeft: { row: this.row - 1, col: this.col - 1 },
      top: { row: this.row - 1, col: this.col },
      topRight: { row: this.row - 1, col: this.col + 1 },
    };
    for (const [_, { col, row }] of Object.entries(surroundings).sort(
      () => Math.random() - 0.5
    )) {
      if (this.scene.grid.collisionMap[row][col] === 1) continue;
      this.col = col;
      this.row = row;
      return { row, col };
    }
    return null;
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
