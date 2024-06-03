import { getRandomInt, oneIn } from "../../../../utils/helper-functions";
import MainScene from "../../MainScene";
import { Group } from "./entities/Group/Group";
import { Guest } from "./entities/Guest/Guest";
import { Reception } from "./entities/Reception/Reception";
import { Site } from "./entities/Site/Site";
import { Spawner } from "./entities/Spawner/Spawner";

export class Recreation {
  scene: MainScene;
  sites = new Set<Site>();
  guests = new Set<Guest>();
  groups = new Set<Group>();
  spawner: Spawner;
  reception: Reception | null = null;
  constructor(scene: MainScene) {
    this.scene = scene;
    let row = 0;
    let col = 0;
    if (oneIn(2)) {
      col = oneIn(2) ? 0 : scene.colCount - 1;
      row = getRandomInt(scene.rowCount);
    } else {
      col = getRandomInt(scene.colCount);
      row = oneIn(2) ? 0 : scene.rowCount - 1;
    }
    this.spawner = new Spawner(scene, col, row);
  }
  update(delta: number) {
    // for (const guest of this.guests) {
    //   if (!guest.group.campsite) {
    //     this.allocateGroup(guest.group);
    //     break;
    //   }
    // }
    for (const group of this.groups) {
      if (group.guests.size === 0) {
        this.groups.delete(group);
      }
    }
  }
  // allocateGroup(group: Group) {
  //   for (const site of this.sites) {
  //     if (!site.occupants) {
  //       site.occupy(group);
  //       break;
  //     }
  //   }
  // }
}
