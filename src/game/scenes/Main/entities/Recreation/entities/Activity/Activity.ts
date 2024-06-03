import MainScene from "../../../../MainScene";
import { ProgressBar } from "../../../ProgressBar/ProgressBar";
import { Guest } from "../Guest/Guest";

export class Activity {
  scene: MainScene;
  progress = 0;
  col: number;
  row: number;
  multiplier = 0;
  isCompleted = false;
  guests = new Set<Guest>();
  bar: ProgressBar | null = null;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  constructor(
    scene: MainScene,
    guests: Set<Guest>,
    col: number,
    row: number,
    multiplier: number,
    onProgress?: (progress: number) => void,
    onComplete?: () => void,
    showProgressBar?: boolean
  ) {
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.multiplier = multiplier;
    this.guests = guests;

    console.log("Activity", col, row);

    if (showProgressBar) {
      this.bar = new ProgressBar(this, col, row);
    }

    for (const guest of guests) {
      guest.activity = this;
    }
    this.onProgress = onProgress;
    this.onComplete = onComplete;
  }
  advance(delta: number) {
    this.progress += delta * this.multiplier;
    if (this.bar) this.bar.update(this.progress);
    if (this.onProgress) this.onProgress(this.progress);
    if (this.progress >= 1) {
      if (this.onComplete) this.onComplete();
      this.remove();
    }
  }
  remove() {
    this.bar?.remove();
    this.isCompleted = true;
    for (const guest of this.guests) {
      guest.activity = null;
    }
    this.isCompleted = true;
  }
}
