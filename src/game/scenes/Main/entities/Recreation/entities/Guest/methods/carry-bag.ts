import { Guest } from "../Guest";

export function carryBag(this: Guest) {
  this.bag?.setPosition(this.x, this.y + 3);
  if (this.facing === "left") {
    this.bag?.setDepth(this.y - 1);
  } else {
    this.bag?.setDepth(this.y + 1);
  }

  if (this.facing === "down") {
    this.bag?.setFrame(1);
  } else if (this.facing === "up") {
    this.bag?.setFrame(2);
  } else {
    this.bag?.setFrame(0);
  }
}
