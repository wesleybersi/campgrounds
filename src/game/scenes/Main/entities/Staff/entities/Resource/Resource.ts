import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { Worker } from "../Worker/Worker";
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
  col: number;
  row: number;
  // text: Phaser.GameObjects.Text;
  carriedBy: Worker | null = null;
  targeted: Worker | null = null;
  inStorage: Storage | null = null;
  constructor(
    scene: MainScene,
    type: ResourceType,
    amount: number,
    col: number,
    row: number
  ) {
    super(scene, absolutePos(col), absolutePos(row), assets[type], amount - 1);

    this.scene = scene;
    this.type = type;
    this.amount = amount;
    this.col = col;
    this.row = row;
    this.setDepth(this.y - 1);
    this.scene.staff.resourceMatrix[row][col] = this;
    this.scene.staff.resourcesNotInStorage.add(this);
    // this.text = this.scene.add
    //   .text(this.x, this.y, this.amount.toString())
    //   .setOrigin(0.5, 0.5)
    //   .setFontSize("8px")
    //   .setDepth(this.y)
    //   .setAlpha(1);
    this.scene.add.existing(this);
  }
  updateAmount() {
    this.setFrame(this.amount - 1);
    if (this.amount <= 0) {
      this.remove();
      return;
    }

    this.update(this.x, this.y);
  }
  update(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.setDepth(y + 1);

    if (this.carriedBy) {
      this.setScale(0.75);
    } else {
      this.setScale(1);
    }

    if (this.inStorage) {
      this.scene.staff.resourcesNotInStorage.delete(this);
    } else {
      this.scene.staff.resourcesNotInStorage.add(this);
    }
    // this.text.x = x;
    // this.text.y = y;

    // this.text.setText(this.amount.toString());

    if (this.carriedBy) {
      if (this.scene.staff.resourceMatrix[this.row][this.col] === this) {
        this.scene.staff.resourceMatrix[this.row][this.col] = null;
      }
    }
  }
  remove() {
    if (this.carriedBy) this.carriedBy.carriedResource = null;
    if (this.scene.staff.resourceMatrix[this.row][this.col] === this) {
      this.scene.staff.resourceMatrix[this.row][this.col] = null;
    }

    this.scene.staff.resourcesNotInStorage.delete(this);
    // this.text.destroy();
    this.destroy();
  }
}
