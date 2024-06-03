import { oneIn } from "../../../../../../../utils/helper-functions";
import { Notification } from "../../../../Notification/Notification";
import { Guest } from "../Guest";

export function chatter(this: Guest) {
  //Base chatter on needs

  if (oneIn(1000)) {
    new Notification(this.scene, oneIn(2) ? "♫" : "♪", this.x, this.y);
  }
}
