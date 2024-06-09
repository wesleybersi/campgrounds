import { Worker } from "../../../../Staff/entities/Worker/Worker";
import { Resource } from "../../Resource/Resource";
import { Storage } from "../Storage";

export function take(
  this: Storage,
  worker: Worker,
  resource: Resource,
  takeAmount: number
) {
  const slot = this.slots.find((slot) => slot.resource === resource);
  if (!slot || !slot.resource) return;

  if (!worker.carriedResource) {
    worker.carriedResource = new Resource(
      this.scene,
      slot.resource.type,
      0,
      slot.col,
      slot.row
    );
  }

  if (worker.carriedResource) {
    while (slot.resource.amount > 0 && takeAmount > 0) {
      worker.carriedResource.amount++;
      slot.resource.amount--;
      takeAmount--;
    }

    slot.resource.update();
    worker.carriedResource.update();
  }
}
