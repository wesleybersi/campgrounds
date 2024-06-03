import { getRandomInt } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE, PRICE_PER_CELL } from "../../../../constants";
import { Area } from "../../../Area/Area";
import { Notification } from "../../../Notification/Notification";
import { PitchTent } from "../../activities/PitchTent";
import { Group } from "../Group/Group";

import { Tent } from "../Tent/Tent";

export class Site extends Area {
  pricePerDay = 0;
  occupants: Group | null = null;
  constructor(
    scene: MainScene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width, height);
    this.scene = scene;

    this.scene.recreation.sites.add(this);
    this.scene.add.existing(this);

    this.pricePerDay += PRICE_PER_CELL * this.grid.flat().length;
  }

  occupy(group: Group) {
    //This is where we allocate the tents randomly
    this.setFillStyle(0xffffff, this.scene.client.overlay === "area" ? 0.1 : 0);
    this.occupants = group;
    group.campsite = this;
    for (const guest of group.guests) {
      const col = this.rect.topLeft.col + getRandomInt(this.grid[0].length);
      const row = this.rect.topLeft.row + getRandomInt(this.grid.length);

      guest.goto(col, row);
    }

    //Randomly place tents in empty spots
    const placedTents: Tent[] = [];
    for (const tent of group.tents) {
      let placed = false;
      let failed = false;
      let retries = 0;
      while (!placed) {
        retries++;

        if (retries > 200) {
          failed = true;
          alert("My tent does not seem to fit anywhere :-(");

          // group.campsite = null;
          // for (const guest of group.guests) {
          //   guest.goto(guest.x, guest.y);
          //   //TODO tent.remove()
          //   guest.tent?.sprite?.destroy();
          //   guest.tent = null;
          // }
          // this.occupants = null;

          return;
        }
        const col = getRandomInt(this.grid[0].length);
        const row = getRandomInt(this.grid.length);

        // Check if it fits within the grid
        if (this.fitsWithinGrid(col, row, tent.size[0], tent.size[1])) {
          // Check for overlap with existing rectangles
          let overlap = false;
          for (const placedTent of placedTents) {
            if (
              this.doRectanglesOverlap(
                col,
                row,
                tent.size[0],
                tent.size[1],
                placedTent.col ?? 0,
                placedTent.row ?? 0,
                placedTent.size[0],
                placedTent.size[1]
              )
            ) {
              overlap = true;
              break;
            }
          }

          if (!overlap) {
            tent.col = col;
            tent.row = row;
            placedTents.push(tent);
            placed = true;

            new PitchTent(
              this.scene,
              tent,
              tent.occupants,
              tent.col + this.rect.topLeft.col,
              tent.row + this.rect.topLeft.row
            );
          }
        }
      }
    }
  }
  doRectanglesOverlap(
    col1: number,
    row1: number,
    width1: number,
    height1: number,
    col2: number,
    row2: number,
    width2: number,
    height2: number
  ): boolean {
    return !(
      col1 + width1 <= col2 ||
      col2 + width2 <= col1 ||
      row1 + height1 <= row2 ||
      row2 + height2 <= row1
    );
  }
  fitsWithinGrid(
    col: number,
    row: number,
    cols: number,
    rows: number
  ): boolean {
    return (
      col >= 0 &&
      row >= 0 &&
      col + cols <= this.grid[0].length &&
      row + rows <= this.grid.length
    );
  }
}
