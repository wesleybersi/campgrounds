import MainScene from "../../MainScene";
import { MAX_CARRY } from "../../constants";
import { Area } from "../Area/Area";
import { Task } from "../Staff/entities/Task/Task";
import { Resource } from "./entities/Resource/Resource";
import { Storage } from "./entities/Storage/Storage";

export class Resources {
  scene: MainScene;
  resourceMatrix: (Resource | null)[][] = [];
  resourcesNotInStorage: Set<Resource> = new Set();
  storageAvailable = false;
  constructor(scene: MainScene) {
    this.scene = scene;
    this.resourceMatrix = Array.from({ length: scene.rowCount }, () =>
      Array.from({ length: scene.colCount }, () => null)
    );
  }
  update(delta: number) {
    if (this.scene.frameCounter % 60 === 0) {
      //Make sure there is storage space available before sending orders
      //If no storage available, workers will drop their hauls
      const emptyStorages = this.getAvailableStorages();
      if (emptyStorages.length > 0) this.storageAvailable = true;
      else this.storageAvailable = false;
    }

    if (!this.storageAvailable) return;
    if (this.resourcesNotInStorage.size === 0) return;
    for (const resource of this.resourcesNotInStorage) {
      if (
        resource.reservedBy ||
        resource.carriedBy ||
        resource.col === null ||
        resource.row === null
      ) {
        continue;
      }

      const worker = this.scene.staff.getNearestIdleWorkerTo({
        col: resource.col,
        row: resource.row,
      });
      if (worker?.getNewTask()) continue;
      if (worker) {
        const haulTask = new Task(this.scene, resource.col, resource.row, {
          labor: [worker.type],
          multiplier: Infinity,
          hidePlaceholder: true,
          worker,
          onStart: () => {
            worker.isHauling = true;
            resource.reservedBy = worker;
          },
          onCancel: () => {
            worker.isHauling = false;
            resource.reservedBy = null;
          },
          onComplete: () => {
            resource.reservedBy = null;
            worker.isHauling = false;

            resource.take(worker, Infinity);
          },
        });
        haulTask.assign(worker);
      }
    }
  }

  getAvailableStorages(): Storage[] {
    const set = new Set<Area>(this.scene.grid.areaMap.values());
    return [...set]
      .map((area) => area.module)
      .filter(
        (module): module is Storage =>
          module instanceof Storage && !module.isFilled()
      );
  }
  // sortNearestStorages(col: number, row: number, storages: Storage[]) {
  //   const cells = storages.map(
  //     (storage) => storage.slots[getRandomInt(storage.slots.length)]
  //   );

  //   const nearest = this.scene.grid.getClosestCellTo({ col, row }, cells);
  // }
}
