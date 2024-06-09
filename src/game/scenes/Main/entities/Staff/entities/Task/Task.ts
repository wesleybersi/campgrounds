import { ResourceType } from "../../../Resources/entities/Resource/Resource";

import MainScene from "../../../../MainScene";

import { ProgressBar } from "../../../ProgressBar/ProgressBar";
import { absolutePos } from "../../../../../../utils/helper-functions";
import { CELL_SIZE, MAX_CARRY } from "../../../../constants";
import { Worker, WorkerType } from "../Worker/Worker";
import { resourcesMatchRequirement } from "./methods/resources-match";
import { dropResources } from "./methods/drop-resources";
import { getResources } from "./methods/get-resources";
import { LawnMower } from "../LawnMower/LawnMower";
import { getTool } from "./methods/get-tool";

interface TaskConfig {
  labor: WorkerType[];
  multiplier: number;
  requiredResources?: { [key in ResourceType]?: number };
  color?: number;
  hidePlaceholder?: boolean;
  worker?: Worker;
  requiredTool?: "lawnmower";
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
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
  onCancel?: () => void;
  requiredTool?: "lawnmower";
  requiredResources?: {
    [key in ResourceType]?: number;
  };
  currentResources?: {
    [key in ResourceType]?: number;
  };

  //Resource methods
  resourcesMatchRequirement = resourcesMatchRequirement;
  getResources = getResources;
  dropResources = dropResources;
  getTool = getTool;
  constructor(scene: MainScene, col: number, row: number, config: TaskConfig) {
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.initialCol = col;
    this.initialRow = row;
    this.laborType = config.labor;
    this.multiplier = config.multiplier;
    this.worker = config.worker ?? null;
    this.requiredTool = config.requiredTool;
    this.requiredResources = config.requiredResources;
    if (this.requiredResources)
      this.currentResources = { ...this.requiredResources };
    for (const resource in this.currentResources) {
      this.currentResources[resource as ResourceType] = 0;
    }
    this.bar = new ProgressBar(this, col, row);
    this.placeholder = this.scene.add
      .rectangle(absolutePos(col), absolutePos(row), CELL_SIZE, CELL_SIZE)
      .setStrokeStyle(1, config.color ?? 0xffffff)
      .setAlpha(config.hidePlaceholder ? 0 : 1);

    this.color = config.color ?? 0xffffff;
    this.onStart = config.onStart;
    this.onProgress = config.onProgress;
    this.onComplete = config.onComplete;
    this.onCancel = config.onCancel;
    this.scene.staff.taskMatrix[this.row][this.col] = this;
    if (!this.worker) {
      this.scene.staff.queuedTasks.push(this);
    }

    if (this.onStart) this.onStart();
  }
  assign(worker: Worker) {
    this.worker = worker;
    this.worker.taskQueue.unshift(this);
  }
  advance(delta: number) {
    if (!this.worker) return;
    const worker = this.worker;
    const requiredResources = this.requiredResources;
    const requiredTool = this.requiredTool;

    if (requiredResources) {
      if (worker.carriedResource) {
        this.dropResources(worker.carriedResource);
      } else if (!this.worker?.carriedResource) {
        this.getResources();
      }
      return;
    }

    if (requiredTool) {
      if (!worker.tool) {
        this.getTool();
        return;
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
  cancel() {
    if (this.onCancel) this.onCancel();
  }
  remove() {
    this.bar.remove();
    this.placeholder.destroy();
    this.isCompleted = true;
    this.scene.staff.removeTask(this);

    if (this.worker) {
      this.worker.goto(this.worker.col, this.worker.row);
      this.worker.taskQueue.splice(this.worker.taskQueue.indexOf(this), 1);
      // this.worker.taskQueue.shift();
    }
  }
}
