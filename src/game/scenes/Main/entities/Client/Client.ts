import MainScene from "../../MainScene";
import { CAMERA_MOVEMENT_SPEED } from "../../constants";
import { Agent } from "../Agent/Agent";
import { Site } from "../Recreation/entities/Site/Site";
import { Command } from "./entities/Command/Command";

import { Inventory } from "./entities/Inventory/Inventory";
import { Selection } from "./entities/Selection/Selection";
import { forestingPointerDown } from "./controllers/foresting/events";
import { keyboardEvents } from "./events/keyboard";
import { pointerEvents } from "./events/pointer";

export class Client {
  scene: MainScene;
  target: { row: number; col: number; x: number; y: number };
  keys: {
    shift: boolean;
    meta: boolean;
    numeric: number | null;
    up: boolean;
    left: boolean;
    down: boolean;
    right: boolean;
  };

  overlay: "area" | null = "area";

  // commands = {
  //   areas: {
  //     command: null | "clear" | "reception" | "campsite" = null
  //   }
  // },
  orders = [
    "",
    "guests",
    "harvest",
    "plant tree",
    "plant flower",
    "floor planks",
    "cancel",
    "campsite",
    "reception",
    "wooden wall",
    "hedge",
    "dirt",
    "concrete",
    "water",
  ];
  order = "";
  command = new Command(this);

  selected: Agent | Site | null = null;
  selection: Selection | null = null;
  inventory: Inventory;

  //Events
  pointerEvents = pointerEvents;
  keyboardEvents = keyboardEvents;

  forestingPointerDown = forestingPointerDown;
  constructor(scene: MainScene) {
    this.scene = scene;
    this.target = { row: -1, col: -1, x: -1, y: -1 };
    this.keys = {
      shift: false,
      meta: false,
      numeric: null,
      up: false,
      left: false,
      down: false,
      right: false,
    };
    this.inventory = new Inventory(this);

    this.pointerEvents();
    this.keyboardEvents();
  }
  update(delta: number, staticDelta: number) {
    if (this.keys.up) {
      this.scene.cameras.main.scrollY -= CAMERA_MOVEMENT_SPEED * staticDelta;
    } else if (this.keys.down) {
      this.scene.cameras.main.scrollY += CAMERA_MOVEMENT_SPEED * staticDelta;
    }

    if (this.keys.left) {
      this.scene.cameras.main.scrollX -= CAMERA_MOVEMENT_SPEED * staticDelta;
    } else if (this.keys.right) {
      this.scene.cameras.main.scrollX += CAMERA_MOVEMENT_SPEED * staticDelta;
    }
  }
}
