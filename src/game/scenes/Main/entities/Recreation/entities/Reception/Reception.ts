import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Area } from "../../../Area/Area";
import { Group } from "../Group/Group";

export class Reception extends Area {
  constructor(
    scene: MainScene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width, height);
    for (const group of this.scene.recreation.groups) {
      if (!group.campsite) {
        group.goto(
          Math.floor(this.x / CELL_SIZE),
          Math.floor(this.y / CELL_SIZE)
        );
      }
    }
    this.scene.recreation.reception = this;
  }
  assignCampsite(group: Group) {
    if (group.campsite) return;
    for (const site of this.scene.recreation.sites) {
      if (!site.occupants) {
        site.occupy(group);
        //TODO invalid
        break;
      }
    }
  }
}
