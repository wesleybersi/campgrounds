import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Worker } from "../Worker/Worker";

const assets = {
  wood: "resource-logs",
  stone: "resource-stone",
};

export class Resource extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  type: "wood" | "stone";
  amount: number;
  col: number;
  row: number;
  text: Phaser.GameObjects.Text;
  carriedBy: Worker | null = null;

  constructor(
    scene: MainScene,
    type: "wood" | "stone",
    amount: number,
    col: number,
    row: number
  ) {
    super(scene, absolutePos(col), absolutePos(row), assets[type]);
    // switch (type) {
    //   case "wood":
    //     this.setFillStyle(0x7b4636);
    //     break;
    //   case "stone":
    //     this.setFillStyle(0x7c8ba6);
    //     break;
    // }
    this.scene = scene;
    this.type = type;
    this.amount = amount;
    this.col = col;
    this.row = row;
    this.setDepth(this.y - 1);
    this.scene.staff.resourceMatrix[row][col] = this;
    this.text = this.scene.add
      .text(this.x, this.y, this.amount.toString())
      .setOrigin(0.5, 0.5)
      .setFontSize("12px")
      .setDepth(this.y)
      .setAlpha(0);
    this.scene.add.existing(this);
  }
  update(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.text.x = x;
    this.text.y = y;

    this.text.setText(this.amount.toString());

    if (this.carriedBy) {
      if (this.scene.staff.resourceMatrix[this.row][this.col] === this) {
        this.scene.staff.resourceMatrix[this.row][this.col] = null;
      }
    }
  }
  combine(resource: Resource) {
    // if (resource.type === this.type) {
    //   const total = resource.amount + this.amount;
    //   if (total <= maxStack[resource.type]) {
    //     this.amount += resource.amount;
    //     resource.remove();
    //   }
    // }
  }
  remove() {
    if (this.carriedBy) this.carriedBy.carriedResource = null;
    if (this.scene.staff.resourceMatrix[this.row][this.col] === this) {
      this.scene.staff.resourceMatrix[this.row][this.col] = null;
    }
    this.text.destroy();
    this.destroy();
  }
}
