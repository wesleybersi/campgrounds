import { ResourceType } from "./../Resource/Resource";
import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { MAX_STACK } from "../../../../constants";
import { Area } from "../../../Area/Area";
import { Resource } from "../Resource/Resource";
import { Task } from "../Task/Task";
import { Worker } from "../Worker/Worker";

export class Storage {
  scene: MainScene;
  area: Area;
  allows: Set<ResourceType> = new Set();
  color = 0x0044ff;
  slots: {
    col: number;
    row: number;
    resource: Resource | null;
    reserved: Resource | null;
  }[] = [];
  isFilled = false;
  constructor(area: Area) {
    this.area = area;
    this.scene = area.scene;
    this.allows.add("wood");
    // this.allows.add("stone");
    this.update();
  }
  update() {
    if (!this.slots) this.slots = [];
    for (const cell of this.area.cells) {
      const slot = this.slots.find(
        (slot) => slot.col === cell.col && slot.row === cell.row
      );
      const resourceInPlace =
        this.scene.staff.resourceMatrix[cell.row][cell.col];
      if (resourceInPlace) {
        this.slots.push({
          ...cell,
          resource: slot?.resource ?? resourceInPlace,
          reserved: slot?.reserved ?? null,
        });
      } else {
        this.slots.push({
          ...cell,
          resource: slot?.resource ?? null,
          reserved: slot?.reserved ?? null,
        });
      }
      cell.graphic?.setTint(this.color);
    }

    if (
      this.slots.some(
        (slot) =>
          !slot.resource || slot.resource.amount < MAX_STACK[slot.resource.type]
      )
    ) {
      this.isFilled = false;
    } else {
      this.isFilled = true;
    }
  }
  reserveSlot(worker: Worker, resource: Resource) {
    for (const slot of this.slots) {
      if (!this.allows.has(resource.type)) continue;
      if (slot.reserved) continue;
      if (slot.resource) {
        if (slot.resource.type !== resource.type) continue;
        if (slot.resource.amount >= MAX_STACK[slot.resource.type]) continue;
        const sum = slot.resource.amount + resource.amount;
        if (sum > MAX_STACK[resource.type]) continue;
      }

      const { row, col } = slot;
      const haulTask = new Task(this.scene, col, row, {
        labor: [worker.type],
        multiplier: Infinity,
        hidePlaceholder: true,
        onStart: () => {
          slot.reserved = resource;
          worker.isHauling = true;
        },
        onComplete: () => {
          this.store(col, row, resource);
          worker.isHauling = false;
        },
      });
      haulTask.assign(worker);
      break;
    }
  }
  store(col: number, row: number, resource: Resource) {
    const slot = this.slots.find(
      (slot) => slot.col === col && slot.row === row
    );
    if (!slot) return;

    if (slot.resource) {
      while (
        slot.resource.amount < MAX_STACK[slot.resource.type] &&
        resource.amount > 0
      ) {
        slot.resource.amount++;
        resource.amount--;
      }

      resource.updateAmount();
      slot.resource.updateAmount();
    } else {
      slot.resource = resource;
      if (resource.carriedBy) {
        resource.carriedBy.carriedResource = null;
      }
      resource.col = col;
      resource.row = row;
      resource.update(absolutePos(col), absolutePos(row));
      resource.targeted = null;

      resource.inStorage = this;
      if (slot.resource.carriedBy) {
        slot.resource.carriedBy.carriedResource = null;
      }
    }
    slot.reserved = null;

    this.scene.staff.resourceMatrix[row][col] = slot.resource;

    this.update();
  }
}
