import MainScene from "../../../MainScene";
import { Activity } from "../entities/Activity/Activity";
import { Guest } from "../entities/Guest/Guest";

export class EnterTent extends Activity {
  constructor(scene: MainScene, guest: Guest) {
    super(
      scene,
      new Set([guest]),
      guest.tent?.col ?? 0,
      guest.tent?.row ?? 0,
      1,
      undefined,
      () => {
        guest.tent?.enter(guest);
        console.log(guest.name, "entered the tent");
      }
    );
  }
}
