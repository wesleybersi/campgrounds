import {
  Resource,
  ResourceType,
} from "../../../../Resources/entities/Resource/Resource";
import { Task } from "../../Task/Task";
import { Worker } from "../Worker";

export function haul(this: Worker, type: ResourceType, allowStorage = true) {
  //TODO
  //1 - Look in close vicinity
  //2 - Look in storages
  //3 - Look everywhere

  let relevantResources = this.scene.resources.resourceMatrix
    .flat()
    .filter(
      (resource) =>
        resource instanceof Resource &&
        resource.type === type &&
        !resource.carriedBy &&
        !resource.reservedBy
    );

  if (!allowStorage) {
    relevantResources = relevantResources.filter(
      (resource) => resource && !resource.storage
    );
  }

  if (relevantResources.length > 0) {
    const resource = relevantResources.reduce((prev, curr) =>
      curr instanceof Resource &&
      prev instanceof Resource &&
      curr.row !== null &&
      curr.col !== null &&
      prev.row !== null &&
      prev.col !== null &&
      Math.abs(curr.row - this.row) + Math.abs(curr.col - this.col) <
        Math.abs(prev.row - this.row) + Math.abs(prev.col - this.col)
        ? curr
        : prev
    );
    if (resource && resource.col !== null && resource.row !== null) {
      const haulTask = new Task(this.scene, resource.col, resource.row, {
        labor: [this.type],
        multiplier: Infinity,
        hidePlaceholder: true,
        onStart: () => {
          this.isHauling = true;
          resource.reservedBy = this; // TODO Remove target when canceled or carried
        },
        onCancel: () => {
          this.isHauling = false;
          resource.reservedBy = null;
        },
        onComplete: () => {
          resource.reservedBy = null;

          resource.take(this, this.haulTarget ?? Infinity);

          if (this.carriedResource?.amount === this.haulTarget) {
            delete this.haulTarget;
          }

          this.isHauling = false;
        },
      });
      haulTask.assign(this);
      return true;
    }
  }
  return false;
}
