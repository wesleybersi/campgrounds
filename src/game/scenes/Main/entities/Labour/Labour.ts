import { Worker } from "./types";

import MainScene from "../../MainScene";

import { Builder } from "./force/Builder/Builder";
import { Blueprint } from "./force/Builder/tasks/Blueprint";
import { Forester } from "./force/Forester/Forester";
import { CutWood } from "./force/Forester/tasks/CutWood";
import { Task } from "./entities/Task/Task";
import { PlantTree } from "./force/Forester/tasks/PlantTree";
import { CutStone } from "./force/Forester/tasks/CutStone";

export class Labour {
  scene: MainScene;
  workers = new Set<Worker>();
  queuedTasks: Task[] = [];
  foresters: Forester[] = [];
  builders: Builder[] = [];
  constructor(scene: MainScene) {
    this.scene = scene;
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

    const builderTasks = tasks.filter((task) => task instanceof Blueprint);
    const foresterTasks = tasks.filter(
      (task) =>
        task instanceof CutWood ||
        task instanceof CutStone ||
        task instanceof PlantTree
    );

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
            (nearestWorker instanceof Forester && task instanceof CutWood) ||
            (nearestWorker instanceof Forester && task instanceof CutStone) ||
            (nearestWorker instanceof Forester && task instanceof PlantTree)
          ) {
            nearestWorker.task = task ?? null;
          }

          task.worker = nearestWorker;
          const routePossible = task.worker.goto(task.x, task.y);
          if (!routePossible) {
            task.remove();
            nearestWorker.task = null;
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
  hire(type: "forester" | "builder") {
    let worker: Worker | null = null;
    switch (type) {
      case "forester":
        worker = new Forester(
          this.scene,
          this.scene.recreation.spawner.col,
          this.scene.recreation.spawner.row
        );
        break;
    }
    worker?.follow();
  }
  getAvailableWorkers(task: Task) {
    if (task instanceof Blueprint) {
      return Array.from(this.workers).filter(
        (worker) => worker instanceof Builder && !worker.task
      );
    }
    if (
      task instanceof CutWood ||
      task instanceof CutStone ||
      task instanceof PlantTree
    ) {
      return Array.from(this.workers).filter(
        (worker) => worker instanceof Forester && !worker.task
      );
    }
    return [];
  }
}
