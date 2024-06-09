import { MAX_STACK } from "../../../../../constants";
import { Resource } from "../../Resource/Resource";
import { Storage } from "../Storage";

export function store(
  this: Storage,
  col: number,
  row: number,
  resource: Resource
) {
  const slot = this.slots.find((slot) => slot.col === col && slot.row === row);
  if (!slot) return;
  if (slot.resource) {
    while (
      slot.resource.amount < MAX_STACK[slot.resource.type] &&
      resource.amount > 0
    ) {
      slot.resource.amount++;
      resource.amount--;
    }

    slot.resource.update();
    resource.update();

    if (resource && resource.carriedBy) {
      this.reserve(resource.carriedBy, resource);
    }
  } else if (!slot.resource) {
    slot.resource = resource;
    slot.resource.storage = this;
    slot.resource.clearCarry();
    slot.resource.col = col;
    slot.resource.row = row;
    slot.resource.update();
  }
}
