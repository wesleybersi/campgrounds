import { Storage } from "../Storage";

export function emptySlot(this: Storage, col: number, row: number) {
  const slot = this.slots.find((slot) => slot.col === col && slot.row === row);
  if (slot) {
    slot.reserved = null;
    slot.resource = null;
  }
}
