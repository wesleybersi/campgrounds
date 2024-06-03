import MainScene from "../../../MainScene";
import { CELL_SIZE } from "../../../constants";
import { Activity } from "../entities/Activity/Activity";
import { Guest } from "../entities/Guest/Guest";

export class ExitTent extends Activity {
  constructor(scene: MainScene, guest: Guest) {
    super(
      scene,
      new Set([guest]),
      guest.tent?.col ?? 0,
      guest.tent?.row ?? 0,
      1,
      undefined,
      () => {
        guest.tent?.exit(guest);
        console.log(guest.name, "left the tent");
      }
    );
  }
}
