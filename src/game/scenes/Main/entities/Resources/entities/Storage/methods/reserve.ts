import { MAX_STACK } from "../../../../../constants";
import { Resource } from "../../Resource/Resource";
import { Task } from "../../../../Staff/entities/Task/Task";
import { Worker } from "../../../../Staff/entities/Worker/Worker";
import { Storage } from "../Storage";

export function reserve(this: Storage, worker: Worker, resource: Resource) {
  const validCell = this.scene.grid.getClosestCellTo(
    { col: worker.col, row: worker.row },
    this.slots.filter((slot) => {
      if (!slot.reserved && this.allows.has(resource.type)) {
        if (slot.resource) {
          if (
            slot.resource.type === resource.type &&
            slot.resource.amount < MAX_STACK[slot.resource.type]
          ) {
            return slot;
          }
        } else return slot;
      }
    })
  );

  if (!validCell) return false;
  const slot = this.slots.find(
    (slot) => slot.col === validCell.col && slot.row === validCell.row
  );

  if (slot) {
    const { row, col } = slot;
    slot.reserved = new Task(this.scene, col, row, {
      labor: [worker.type],
      multiplier: Infinity,
      hidePlaceholder: true,
      onStart: () => {
        this.scene.resources.resourcesNotInStorage.delete(resource);
        worker.isHauling = true;
      },
      onComplete: () => {
        resource.reservedBy = null;
        slot.reserved = null;
        this.store(col, row, resource);
        worker.isHauling = false;
      },
      onCancel: () => {
        resource.reservedBy = null;
        slot.reserved = null;
        worker.isHauling = false;
      },
    });
    slot.reserved.assign(worker);
    return true;
  }
  return false;
}
