import { Worker } from "./types";

import MainScene from "../../MainScene";

import { Builder } from "./force/Builder/Builder";
import { Blueprint } from "./force/Builder/tasks/Blueprint";
import { Forester } from "./force/Forester/Forester";
import { Woodcutting } from "./force/Forester/tasks/Woodcutting";
import { Task } from "./entities/Task/Task";

export class Labour {
  scene: MainScene;
  workers = new Set<Worker>();
  queuedTasks: Task[] = [];
  constructor(scene: MainScene) {
    this.scene = scene;
  }
  update(delta: number) {
    if (this.queuedTasks.length === 0) return;

    const tasks = this.queuedTasks.filter(
      (task) => !task.worker && !task.isCompleted
    );

    console.log(tasks);
    const blueprints = tasks.filter((task) => task instanceof Blueprint);
    const harvest = tasks.filter((task) => task instanceof Woodcutting);

    const assignTask = (task: Task) => {
      if (task) {
        const availableWorkers = this.getAvailableWorkers(task);
        if (availableWorkers.length > 0) {
          const nearestWorker = availableWorkers.reduce((prev, curr) =>
            Math.abs(curr.y - task.y) + Math.abs(curr.x - task.x) <
            Math.abs(prev.y - task.y) + Math.abs(prev.x - task.x)
              ? curr
              : prev
          );

          if (
            (nearestWorker instanceof Builder && task instanceof Blueprint) ||
            (nearestWorker instanceof Forester && task instanceof Woodcutting)
          ) {
            nearestWorker.task = task ?? null;
            console.log("A");
          }
          console.log("B");

          task.worker = nearestWorker;
          const routePossible = task.worker.goto(task.x, task.y);
          if (!routePossible) {
            task.remove();
            nearestWorker.task = null;
          }
        }
      }
    };
    if (blueprints.length > 0) assignTask(blueprints[0]);
    if (harvest.length > 0) assignTask(harvest[0]);
  }
  redirectAll() {
    //TODO this sucks donkey ass
    //When client places or removes a wall for instance, we recreate a path with the same target as before
    for (const worker of this.workers) {
      worker.redirect();
    }
  }
  getAvailableWorkers(task: Task) {
    if (task instanceof Blueprint) {
      return Array.from(this.workers).filter(
        (worker) => worker instanceof Builder && !worker.task
      );
    }
    if (task instanceof Woodcutting) {
      return Array.from(this.workers).filter(
        (worker) => worker instanceof Forester && !worker.task
      );
    }
    return [];
  }
}
