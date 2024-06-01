import MainScene from "../../MainScene";
import { Agent } from "../Agent/Agent";
import { Site } from "../Recreation/entities/Site/Site";

import { Inventory } from "./entities/Inventory/Inventory";
import { Selection } from "./entities/Selection/Selection";
import { keyboardEvents } from "./events/keyboard";
import { pointerEvents } from "./events/pointer";

export class Client {
  scene: MainScene;
  target: { row: number; col: number; x: number; y: number };
  keys: { shift: boolean; meta: boolean; numeric: number | null };

  overlay: "area" | null = "area";

  modes = [
    "",
    "builder",
    "forester",
    "guests",
    "harvest",
    "plant tree",
    "cancel",
    "campsite",
    "reception",
    "spawn",
    "wooden wall",
    "hedge",
    "dirt",
    "concrete",
    "water",
  ];
  placeMode = "";

  selected: Agent | Site | null = null;
  selection: Selection | null = null;
  inventory: Inventory;

  //Events
  pointerEvents = pointerEvents;
  keyboardEvents = keyboardEvents;
  constructor(scene: MainScene) {
    this.scene = scene;
    this.target = { row: -1, col: -1, x: -1, y: -1 };
    this.keys = { shift: false, meta: false, numeric: null };
    this.inventory = new Inventory(this);

    this.pointerEvents();
    this.keyboardEvents();
  }
  update(delta: number) {
    //
  }
}
