import { Worker } from "./types";

import MainScene from "../../MainScene";

import { Builder } from "./force/Builder/Builder";
import { Forester } from "./force/Forester/Forester";
import { Task } from "./entities/Task/Task";

export class Labour {
  scene: MainScene;
  workers = new Set<Worker>();
  queuedTasks: Task[] = [];
  foresters: Forester[] = [];
  builders: Builder[] = [];
  taskGrid: (Task | null)[][] = [];
  constructor(scene: MainScene) {
    this.scene = scene;
    this.taskGrid = Array.from({ length: scene.rowCount }, () =>
      Array.from({ length: scene.colCount }, () => null)
    );
  }
  update(delta: number) {
    if (this.scene.frameCounter % 60) {
      this.foresters = [];
      this.builders = [];
      for (const worker of this.workers) {
        if (worker instanceof Forester) {
          this.foresters.push(worker);
        } else if (worker instanceof Builder) {
          this.builders.push(worker);
        }
      }
    }
    if (this.queuedTasks.length === 0) return;

    const tasks = this.queuedTasks.filter(
      (task) => !task.worker && !task.isCompleted
    );

    const builderTasks = tasks.filter((task) => task.laborer === "builder");
    const foresterTasks = tasks.filter((task) => task.laborer === "forester");

    const assignTask = (task: Task, exclude?: Worker) => {
      if (task) {
        const availableWorkers = this.getAvailableWorkers(task, exclude);
        if (availableWorkers.length > 0) {
          const nearestWorker = availableWorkers.reduce((prev, curr) =>
            Math.abs(curr.row - task.row) + Math.abs(curr.col - task.col) <
            Math.abs(prev.row - task.row) + Math.abs(prev.col - task.col)
              ? curr
              : prev
          );

          if (
            (nearestWorker instanceof Builder && task.laborer === "builder") ||
            (nearestWorker instanceof Forester && task.laborer === "forester")
          ) {
            nearestWorker.task = task ?? null;
          }

          task.worker = nearestWorker;
          const routePossible = task.worker.goto(task.col, task.row);
          if (!routePossible) {
            nearestWorker.task = null;
            assignTask(task, nearestWorker);
          }
        }
      }
    };
    if (builderTasks.length > 0) assignTask(builderTasks[0]);
    if (foresterTasks.length > 0) assignTask(foresterTasks[0]);
  }
  redirectAll() {
    //TODO this sucks donkey ass
    //When client places or removes a wall for instance, we recreate a path with the same target as before
    for (const worker of this.workers) {
      worker.redirect();
    }
  }
  removeTask(markedTask: Task) {
    this.taskGrid[markedTask.row][markedTask.col] = null;
    const updatedTasks = this.queuedTasks.filter((task) => task !== markedTask);
    this.queuedTasks = updatedTasks;
  }
  hire(type: "forester" | "builder") {
    let worker: Worker | null = null;
    switch (type) {
      case "forester":
        {
          //TODO weekly payment
          const price = 250;
          if (this.scene.client.inventory.money >= price) {
            this.scene.client.inventory.money -= price;
          } else {
            return;
          }
          worker = new Forester(
            this.scene,
            this.scene.recreation.spawner.col,
            this.scene.recreation.spawner.row
          );
        }
        break;
      case "builder":
        {
          const price = 200;
          if (this.scene.client.inventory.money >= price) {
            this.scene.client.inventory.money -= price;
          } else {
            return;
          }
          worker = new Builder(
            this.scene,
            this.scene.recreation.spawner.col,
            this.scene.recreation.spawner.row
          );
        }
        break;
    }
    worker?.follow();
  }
  getAvailableWorkers(task: Task, exclude?: Worker) {
    if (task.laborer === "builder") {
      return Array.from(this.workers).filter(
        (worker) =>
          worker instanceof Builder && !worker.task && worker !== exclude
      );
    }
    if (task.laborer === "forester") {
      return Array.from(this.workers).filter(
        (worker) =>
          worker instanceof Forester && !worker.task && worker !== exclude
      );
    }
    return [];
  }
}
