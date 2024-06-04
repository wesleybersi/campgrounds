import MainScene from "../../../../MainScene";
import { Client } from "../../Client";
import { areaCommands } from "./controllers/areas/commands";
import { constructionCommands } from "./controllers/construction/commands";
import { forestingCommands } from "./controllers/foresting/commands";

export class Command {
  client: Client;
  category: "area" | "foresting" | "construction" | "" = "";
  order = "";
  selectionType: "none" | "free" | "grid" | "grid-empty" | "line" = "free";

  onPointerDown?: (
    scene: MainScene,
    pointer: Phaser.Input.Pointer,
    col: number,
    row: number
  ) => void;
  onPointerUp?: (
    scene: MainScene,
    pointer: Phaser.Input.Pointer,
    cells: { col: number; row: number }[]
  ) => void;

  constructor(client: Client) {
    this.client = client;
  }
  clear() {
    this.category = "";
    this.order = "";
    delete this.onPointerDown;
    delete this.onPointerUp;
  }
  instruct(category: "area" | "foresting" | "construction", order: string) {
    delete this.onPointerDown;
    delete this.onPointerUp;
    this.category = category;
    this.order = order;

    let commands = null;

    switch (category) {
      case "area":
        commands = areaCommands;
        break;
      case "foresting":
        commands = forestingCommands;
        break;
      case "construction":
        commands = constructionCommands;
        break;
    }
    if (commands) {
      this.onPointerDown = commands[order].onPointerDown;
      this.onPointerUp = commands[order].onPointerUp;
      this.selectionType = commands[order].selectionType;
    }
  }
}
