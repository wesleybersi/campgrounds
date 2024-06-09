import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { MAX_CARRY } from "../../../../constants";
import { Worker } from "../../../Staff/entities/Worker/Worker";
import { Storage } from "../Storage/Storage";

export type ResourceType = "wood" | "stone";

const assets = {
  wood: "resource-logs",
  stone: "resource-stone",
};

export class Resource extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  type: ResourceType;
  amount: number;
  col: number | null = null;
  row: number | null = null;
  carriedBy: Worker | null = null;
  reservedBy: Worker | null = null;
  storage: Storage | null = null;
  constructor(
    scene: MainScene,
    type: ResourceType,
    amount: number,
    col: number | null,
    row: number | null
  ) {
    super(
      scene,
      absolutePos(col ?? 0) ?? 0,
      absolutePos(row ?? 0),
      assets[type]
    );
    if (amount > 0) {
      this.setFrame(amount - 1);
    }
    this.scene = scene;
    this.type = type;
    this.amount = amount;

    if (col !== null && row !== null) {
      this.col = col;
      this.row = row;
      this.scene.resources.resourceMatrix[row][col] = this;
      this.scene.resources.resourcesNotInStorage.add(this);
    }
    this.setDepth(this.y - 1);
    this.scene.add.existing(this);
  }
  // add(worker:Worker,addAmount:number){

  // }
  take(worker: Worker, takeAmount: number) {
    if (this.col === null || this.row === null) return;
    if (!worker.carriedResource) {
      const resource = new Resource(
        this.scene,
        this.type,
        0,
        this.col,
        this.row
      );
      resource.carry(worker);
    }
    if (worker.carriedResource) {
      if (worker.carriedResource.type !== this.type) return;
      while (
        this.amount > 0 &&
        takeAmount > 0 &&
        worker.carriedResource.amount < MAX_CARRY
      ) {
        worker.carriedResource.amount++;
        this.amount--;
        takeAmount--;
      }
      worker.carriedResource.update();
      this.update();
    }
  }

  update() {
    if (this.amount <= 0) {
      this.remove();
      return;
    }

    this.setFrame(this.amount - 1);
    this.setDepth(this.y + 1);

    if (this.storage) {
      this.scene.resources.resourcesNotInStorage.delete(this);
    } else {
      this.scene.resources.resourcesNotInStorage.add(this);
    }

    if (this.carriedBy) {
      if (this.row !== null && this.col !== null) {
        this.scene.resources.resourceMatrix[this.row][this.col] = null;
        this.row = null;
        this.col = null;
      }
    } else {
      if (this.row !== null && this.col !== null) {
        this.setPosition(absolutePos(this.col), absolutePos(this.row));
        this.scene.resources.resourceMatrix[this.row][this.col] = this;
      }
    }
  }
  carry(worker: Worker) {
    this.carriedBy = worker;
    this.carriedBy.carriedResource = this;
  }
  clearCarry() {
    if (this.carriedBy) {
      this.carriedBy.carriedResource = null;
      this.carriedBy = null;
    }
  }
  setStore(col: number, row: number, storage: Storage) {
    this.storage = storage;
    this.col = col;
    this.row = row;
  }
  drop() {
    if (this.carriedBy) {
      this.col = this.carriedBy.col;
      this.row = this.carriedBy.row;
      this.reservedBy = null;
      this.clearCarry();
    }
  }
  remove() {
    this.clearCarry();

    if (this.row !== null && this.col !== null) {
      this.scene.resources.resourceMatrix[this.row][this.col] = null;
      if (this.storage) {
        this.storage.emptySlot(this.col, this.row);
      }
    }

    this.scene.resources.resourcesNotInStorage.delete(this);
    this.destroy();
  }
}
