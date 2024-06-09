import MainScene from "../../MainScene";

// import { Builder } from "./force/Builder/Builder";
// import { Forester } from "./force/Forester/Forester";
import { Task } from "./entities/Task/Task";
import { Resource } from "./entities/Resource/Resource";
import { Worker } from "./entities/Worker/Worker";

export class Staff {
  scene: MainScene;
  workers = new Set<Worker>();
  queuedTasks: Task[] = [];
  taskMatrix: (Task | null)[][] = [];
  resourceMatrix: (Resource | null)[][] = []; // Todo, map?
  resourcesNotInStorage: Set<Resource> = new Set();
  constructor(scene: MainScene) {
    this.scene = scene;
    this.taskMatrix = Array.from({ length: scene.rowCount }, () =>
      Array.from({ length: scene.colCount }, () => null)
    );
    this.resourceMatrix = Array.from({ length: scene.rowCount }, () =>
      Array.from({ length: scene.colCount }, () => null)
    );
  }
  getWorkerType(type: "forester" | "builder") {
    return Array.from(this.workers).filter((worker) => worker.type === type);
  }
  update(delta: number) {
    //ANCHOR Haul resource
    // new Task(
    //   this.scene,
    //   new Set(["builder"]),
    //   resource.col,
    //   resource.row,
    //   Infinity,
    //   undefined,
    //   () => {
    //     const nearestStorageSlot = { col: 0, row: 0 };
    //     new Task(
    //       this.scene,
    //       "builder",
    //       nearestStorageSlot.col,
    //       nearestStorageSlot.row,
    //       Infinity
    //     );
    //   }
    // );
  }
  redirectAll() {
    //TODO this sucks donkey ass
    //When client places or removes a wall for instance, we recreate a path with the same target as before
    for (const worker of this.workers) {
      worker.redirect();
    }
  }
  removeTask(markedTask: Task) {
    this.taskMatrix[markedTask.initialRow][markedTask.initialCol] = null;

    const updatedTasks = this.queuedTasks.filter((task) => task !== markedTask);
    this.queuedTasks = updatedTasks;
  }
  hire(type: "forester" | "builder" | "guide") {
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
          worker = new Worker(
            this.scene,
            "forester",
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
          worker = new Worker(
            this.scene,
            "builder",
            this.scene.recreation.spawner.col,
            this.scene.recreation.spawner.row
          );
        }
        break;
    }
    worker?.follow();
  }
  // getAvailableWorkers(task: Task, exclude?: Worker) {
  //   if (task.laborer === "builder") {
  //     return Array.from(this.workers).filter(
  //       (worker) =>
  //         worker instanceof Builder && !worker.task && worker !== exclude
  //     );
  //   }
  //   if (task.laborer === "forester") {
  //     return Array.from(this.workers).filter(
  //       (worker) =>
  //         worker instanceof Forester && !worker.task && worker !== exclude
  //     );
  //   }
  //   if (task.laborer === "guide") {
  //     return Array.from(this.workers).filter(
  //       (worker) =>
  //         worker instanceof Guide && !worker.task && worker !== exclude
  //     );
  //   }
  //   return [];
  // }
}
