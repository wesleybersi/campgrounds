import { Resources } from "./../../../../../HUD/entities/Resources/Resources";
import MainScene from "../../../../MainScene";

import { ProgressBar } from "../../../ProgressBar/ProgressBar";
import { absolutePos } from "../../../../../../utils/helper-functions";
import { CELL_SIZE, MAX_CARRY } from "../../../../constants";
import { Worker, WorkerType } from "../Worker/Worker";
import { Resource } from "../Resource/Resource";

interface TaskConfig {
  labor: WorkerType[];
  multiplier: number;
  resourceRequired?: { type: "wood" | "stone"; amount: number };
  color?: number;
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export type Vicinity = { row: number; col: number }[];
export class Task {
  scene: MainScene;
  initialCol: number;
  initialRow: number;
  col: number;
  row: number;
  laborType: WorkerType[];
  progress = 0;
  multiplier = 0;
  isCompleted = false;
  worker: Worker | null = null;
  bar: ProgressBar;
  placeholder: Phaser.GameObjects.Rectangle;
  color: number;
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  resourceRequired: {
    type: "wood" | "stone";
    amount: number;
  } | null = null;
  resourceCount = 0;
  constructor(scene: MainScene, col: number, row: number, config: TaskConfig) {
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.initialCol = col;
    this.initialRow = row;
    this.laborType = config.labor;
    this.multiplier = config.multiplier;
    this.resourceRequired = config.resourceRequired ?? null;
    this.bar = new ProgressBar(this, col, row);
    this.placeholder = this.scene.add
      .rectangle(absolutePos(col), absolutePos(row), CELL_SIZE, CELL_SIZE)
      .setStrokeStyle(1, config.color ?? 0xffffff);
    this.color = config.color ?? 0xffffff;
    this.onStart = config.onStart;
    this.onProgress = config.onProgress;
    this.onComplete = config.onComplete;
    this.scene.staff.taskMatrix[this.row][this.col] = this;
    this.scene.staff.queuedTasks.push(this);

    if (this.onStart) this.onStart();
  }
  assign(worker: Worker) {
    this.worker = worker;
    this.worker.taskQueue.unshift(this);
  }

  haul() {
    if (!this.worker) return;
    const relevantResources = this.scene.staff.resourceMatrix
      .flat()
      .filter(
        (resource) =>
          resource instanceof Resource &&
          resource.type === this.resourceRequired?.type &&
          !resource.carriedBy &&
          !this.scene.staff.taskMatrix[resource.row][resource.col]
      ) as Resource[];

    if (relevantResources.length > 0) {
      const nearestResource = relevantResources.reduce((prev, curr) =>
        Math.abs(curr.row - this.row) + Math.abs(curr.col - this.col) <
        Math.abs(prev.row - this.row) + Math.abs(prev.col - this.col)
          ? curr
          : prev
      );
      const resource = nearestResource;

      const haulTask = new Task(this.scene, resource.col, resource.row, {
        labor: [this.worker.type],
        multiplier: Infinity,
        color: 0x0044ff,

        onComplete: () => {
          if (!this.worker) {
            console.log("no worker - abort");
            return;
          }

          if (!this.resourceRequired) {
            console.log("No resource required, abort");
            return;
          }
          if (!this.worker.carriedResource) {
            this.worker.carriedResource = resource;
            resource.carriedBy = this.worker;
          } else {
            while (
              this.worker.carriedResource.amount < MAX_CARRY &&
              resource.amount > 0
            ) {
              this.worker.carriedResource.amount++;
              resource.amount--;
            }
            if (resource.amount <= 0) resource.remove();
          }
        },
      });
      haulTask.assign(this.worker);
    }
  }

  advance(delta: number) {
    if (this.resourceRequired) {
      if (this.resourceCount < this.resourceRequired.amount) {
        if (this.worker && this.worker.carriedResource) {
          if (this.worker.carriedResource.type === this.resourceRequired.type) {
            while (
              this.resourceCount < this.resourceRequired.amount &&
              this.worker.carriedResource.amount > 0
            ) {
              this.resourceCount++;
              this.worker.carriedResource.amount--;
            }

            if (this.worker.carriedResource.amount <= 0) {
              this.worker.carriedResource.remove();
            }
          }
        } else if (this.worker && !this.worker.carriedResource) {
          this.haul();
        }
        return;
      } else if (this.resourceCount === this.resourceRequired.amount) {
        this.placeholder.setFillStyle(this.color);
      }
    }

    this.progress += delta * this.multiplier;
    this.bar.update(this.progress);
    if (this.onProgress) this.onProgress(this.progress);
    if (this.progress >= 1) {
      if (this.onComplete) this.onComplete();
      this.remove();
    }
  }
  setVicinityTarget(): { row: number; col: number } | null {
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
      if (!this.scene.grid.isWithinBounds(col, row)) continue;
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
    this.scene.staff.removeTask(this);

    if (this.worker) {
      this.worker.goto(this.worker.col, this.worker.row);
      this.worker.taskQueue.shift();
    }
  }
}
