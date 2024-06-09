import { ResourceType } from "../Resource/Resource";
import MainScene from "../../../../MainScene";
import { Area } from "../../../Area/Area";
import { Resource } from "../Resource/Resource";
import { Task } from "../../../Staff/entities/Task/Task";
import { store } from "./methods/store";
import { reserve } from "./methods/reserve";
import { take } from "./methods/take";
import { emptySlot } from "./methods/empty-slot";
import { MAX_STACK } from "../../../../constants";

export class Storage {
  scene: MainScene;
  area: Area;
  allows: Set<ResourceType> = new Set();

  count = { wood: 0, stone: 0 };

  color = 0x0044ff;
  slots: {
    col: number;
    row: number;
    resource: Resource | null;
    reserved: Task | null;
  }[] = [];

  //Methods
  reserve = reserve;
  store = store;
  take = take;
  emptySlot = emptySlot;

  constructor(area: Area) {
    this.area = area;
    this.scene = area.scene;

    this.allows.add("wood");
    this.allows.add("stone");
  }

  isFilled() {
    return !this.slots.some(
      (slot) =>
        !slot.resource ||
        (slot.resource && slot.resource.amount < MAX_STACK[slot.resource.type])
    );
  }
  getResourceCount() {
    for (const slot of this.slots) {
      if (slot.resource) {
        this.count[slot.resource.type] += slot.resource.amount;
      }
    }
    console.log(this.count);
  }
  addSlot(col: number, row: number) {
    this.slots.push({
      col,
      row,
      resource: null,
      reserved: null,
    });
    const resourceInPlace = this.scene.resources.resourceMatrix[row][col];
    if (resourceInPlace) this.store(col, row, resourceInPlace);
  }
  clearSlot(col: number, row: number) {
    const slot = this.slots.find(
      (slot) => slot.col === col && slot.row === row
    );
    if (slot) {
      if (slot.resource) {
        slot.resource.storage = null;
        slot.resource.update();
        slot.reserved?.cancel();
      }
      this.slots.splice(this.slots.indexOf(slot), 1);
    }
  }

  copySettings(module: Storage) {
    this.allows = new Set([...module.allows]);
    this.count = { ...module.count };
  }
}
