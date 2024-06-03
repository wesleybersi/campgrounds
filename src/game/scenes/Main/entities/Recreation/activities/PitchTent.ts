import {
  absolutePos,
  getRandomInt,
  oneIn,
} from "../../../../../utils/helper-functions";
import MainScene from "../../../MainScene";
import { CELL_SIZE } from "../../../constants";
import { Notification } from "../../Notification/Notification";

import { Activity } from "../entities/Activity/Activity";
import { Guest } from "../entities/Guest/Guest";
import { Tent } from "../entities/Tent/Tent";

export class PitchTent extends Activity {
  constructor(
    scene: MainScene,
    tent: Tent,
    guests: Set<Guest>,
    col: number,
    row: number
  ) {
    super(
      scene,
      guests,
      col,
      row,
      0.1,
      (progress: number) => {
        tent.pitch(progress);
        console.log("Tent is", progress * 100, "percent pitched");

        if (oneIn(250)) {
          const pitchEmojis = ["💢", "💀", "🗣️", "😤", "🤬", "🤦‍♂️", "🤦‍♀️"];
          const xOffset = getRandomInt(-CELL_SIZE, CELL_SIZE);
          const yOffset = getRandomInt(-CELL_SIZE, CELL_SIZE);
          new Notification(
            scene,
            pitchEmojis[getRandomInt(pitchEmojis.length)],
            absolutePos(col) + xOffset,
            absolutePos(row) + yOffset
          );
        }
      },
      () => {
        tent.place(col, row);
        console.log("Tent has been pitched");
      },
      true
    );
  }
}
