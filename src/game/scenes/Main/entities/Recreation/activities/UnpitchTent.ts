import MainScene from "../../../MainScene";

import { Activity } from "../entities/Activity/Activity";
import { Guest } from "../entities/Guest/Guest";
import { Tent } from "../entities/Tent/Tent";

export class UnpitchTent extends Activity {
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
        tent.unpitch(progress);
        console.log("unpitch - progress");
      },
      () => {
        tent.remove();
        console.log("unpitch - remove");
        console.log("Tent has been removed");
        for (const guest of guests) {
          guest.leave();
        }
      },
      true
    );
  }
}
