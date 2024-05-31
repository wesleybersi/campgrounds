import MainScene from "../../../MainScene";
import { CELL_SIZE } from "../../../constants";
import { Activity } from "../entities/Activity/Activity";
import { Guest } from "../entities/Guest/Guest";
import { Tent } from "../entities/Tent/Tent";

export class PitchTent extends Activity {
  constructor(
    scene: MainScene,
    tent: Tent,
    guests: Set<Guest>,
    x: number,
    y: number
  ) {
    super(
      scene,
      guests,
      x,
      y,
      0.1,
      (progress: number) => {
        tent.pitch(progress);
        console.log("Tent is", progress * 100, "percent pitched");
      },
      () => {
        tent.place(Math.floor(x / CELL_SIZE), y / CELL_SIZE);
        console.log("Tent has been pitched");
      }
    );
  }
}
