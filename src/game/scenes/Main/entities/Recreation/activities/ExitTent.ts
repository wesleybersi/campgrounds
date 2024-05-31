import MainScene from "../../../MainScene";
import { CELL_SIZE } from "../../../constants";
import { Activity } from "../entities/Activity/Activity";
import { Guest } from "../entities/Guest/Guest";

export class ExitTent extends Activity {
  constructor(scene: MainScene, guest: Guest) {
    super(
      scene,
      new Set([guest]),
      Math.floor(guest.tent?.col ?? 0) * CELL_SIZE,
      Math.floor(guest.tent?.row ?? 0) * CELL_SIZE,
      1,
      undefined,
      () => {
        guest.tent?.exit(guest);
        console.log(guest.name, "left the tent");
      }
    );
  }
}
