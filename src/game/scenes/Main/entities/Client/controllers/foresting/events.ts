import { Client } from "../../Client";

export function forestingPointerDown(
  this: Client,
  pointer: Phaser.Input.Pointer
) {
  switch (this.command.current) {
    case "harvest":
      break;
  }
}
