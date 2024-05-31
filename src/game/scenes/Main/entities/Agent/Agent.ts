import { Vector } from "../../../../types";
import { getRandomInt, oneIn } from "../../../../utils/helper-functions";
import MainScene from "../../MainScene";
import { CELL_SIZE } from "../../constants";
import { createAnimations } from "./animation/create-animations";
import { findEmptyCell } from "./methods/find-empty-cell";
import { goto } from "./methods/goto";
import { move } from "./methods/move";
import { generateRandomName } from "./methods/random-name";
import { redirect } from "./methods/redirect";

export class Agent extends Phaser.GameObjects.Sprite {
  scene: MainScene;

  daysInService = 0;
  didMove = false;
  movementSpeed = 50;
  target: Vector | null = null;
  path: Vector[] = [];
  name = "";
  description: string[] = ["General use agent without a cause"];

  goto: (x: number, y: number) => boolean = goto;
  move: (delta: number) => void = move;
  findEmptyCell: () => void = findEmptyCell;
  redirect: () => void = redirect;
  generateRandomName: () => void = generateRandomName;

  createAnimations: () => void = createAnimations;
  constructor(scene: MainScene, col: number, row: number) {
    super(
      scene,
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      "agent",
      0
    );
    this.scene = scene;
    // this.setAlpha(0.5);
    // this.setFillStyle(0x222222);
    // this.setStrokeStyle(CELL_SIZE / 10, 0xffffff);
    this.generateRandomName();
    this.createAnimations();
    this.setScale(0.65);
    this.scene.allAgents.add(this);
    this.scene.add.existing(this);
  }
  update(delta: number) {
    if (this.path.length > 0) {
      this.move(delta);
    } else {
      this.setFlipX(false);
      this.anims.restart();
      this.anims.pause();

      //Random movement
      const movementProbability = 300;
      if (oneIn(movementProbability)) {
        const maxDistance = 64;
        const xDistance = getRandomInt(maxDistance);
        const yDistance = getRandomInt(maxDistance);
        const x = getRandomInt(this.x - xDistance, this.x + xDistance);
        const y = getRandomInt(this.y - yDistance, this.y + yDistance);
        this.goto(x, y);
        return;
      }
    }
  }
  goHome() {
    this.goto(0, 0);
  }
  select() {
    this.scene.client.selected = this;
    this.setAlpha(1);
  }
  deselect() {
    this.scene.client.selected = null;
    this.setAlpha(0.5);
  }
}
