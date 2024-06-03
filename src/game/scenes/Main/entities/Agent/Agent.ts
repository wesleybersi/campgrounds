import { Position } from "../../../../types";
import {
  getRandomInt,
  oneIn,
  absolutePos,
} from "../../../../utils/helper-functions";
import MainScene from "../../MainScene";
import { CELL_SIZE } from "../../constants";
import { createAnimations } from "./animation/create-animations";
import { findEmptyCell } from "./methods/find-empty-cell";
import { goto } from "./methods/goto";
import { move } from "./methods/move";
import { generateRandomName } from "./methods/random-name";
import { redirect } from "./methods/redirect";
import { wander } from "./methods/wander";

export class Agent extends Phaser.GameObjects.Sprite {
  isActive = true;
  scene: MainScene;
  col: number;
  row: number;
  daysInService = 0;
  isMoving = false;
  movementDuration = 8;
  target: Position | null = null;
  path: Position[] = [];
  name = "";
  characterIndex = getRandomInt(16);
  description: string[] = ["General use agent without a cause"];
  facing: "up" | "down" | "left" | "right" = "down";

  goto: (col: number, row: number) => boolean = goto;
  move: (delta: number) => void = move;
  wander: () => void = wander;
  findEmptyCell: (instant?: boolean) => void = findEmptyCell;
  redirect: () => void = redirect;
  generateRandomName: () => void = generateRandomName;

  createAnimations: () => void = createAnimations;
  constructor(scene: MainScene, col: number, row: number) {
    super(scene, absolutePos(col), absolutePos(row), "chars", 0);
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.generateRandomName();
    this.createAnimations();
    this.scene.allAgents.add(this);
    this.scene.add.existing(this);
  }
  update(delta: number) {
    this.setDepth(this.y);

    if (this.scene.grid.collisionMap[this.row][this.col] === 1) {
      this.findEmptyCell(true);
    }

    if (this.path.length > 0) {
      if (!this.isMoving) this.move(delta);
    } else {
      this.wander();
    }
  }
  goHome() {
    this.goto(0, 0);
  }
  select() {
    this.scene.client.selected = this;
  }
  deselect() {
    this.scene.client.selected = null;
  }
  follow() {
    this.scene.cameras.main.startFollow(this);
  }
  remove() {
    this.destroy();
  }
}
