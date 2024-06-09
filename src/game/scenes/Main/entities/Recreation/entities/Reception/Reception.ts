import MainScene from "../../../../MainScene";
import { Area } from "../../../Area/Area";
import { Group } from "../Group/Group";

export class Reception {
  scene: MainScene;
  area: Area;
  color: number;
  constructor(area: Area) {
    this.scene = area.scene;
    this.color = 0xffffff;
    this.area = area;
  }
  assignCampsite(group: Group) {
    if (group.campsite) return;
    for (const site of this.area.scene.recreation.sites) {
      if (!site.occupants) {
        site.occupy(group);
        //TODO invalid
        break;
      }
    }
  }
  update() {
    for (const cell of this.area.cells) {
      cell.graphic?.setTint(this.color);
    }
  }
}
