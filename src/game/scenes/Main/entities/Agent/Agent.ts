import { Position } from "../../../../types";
import { getRandomInt, absolutePos } from "../../../../utils/helper-functions";
import MainScene from "../../MainScene";
import { createAnimations } from "./animation/create-animations";
import { findEmptyCell } from "./methods/find-empty-cell";
import { goto } from "./methods/goto";
import { move } from "./methods/move";
import { generateRandomName } from "./methods/random-name";
import { redirect } from "./methods/redirect";
import { wander } from "./methods/wander";

export class Agent extends Phaser.GameObjects.Sprite {
  shadow: Phaser.GameObjects.Image;
  isActive = true;
  scene: MainScene;
  col: number;
  row: number;
  daysInService = 0;
  isMoving = false;
  movementDuration = 8;
  target: Position | null = null;
  path: Position[] = [];
  pathHighlights: Phaser.GameObjects.Line[] = [];
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

    this.shadow = this.scene.add
      .image(this.x, this.y, "agent-shadow")
      .setOrigin(0.5, -0.35);

    this.generateRandomName();
    this.createAnimations();
    this.scene.allAgents.add(this);
    this.scene.add.existing(this);
  }
  update(delta: number) {
    this.shadow.setPosition(this.x, this.y);
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
  pathHighlight() {
    for (const highlight of this.pathHighlights) {
      highlight.destroy();
    }
    this.path.forEach(({ col, row }, index) => {
      if (index < this.path.length - 1) {
        this.pathHighlights.push(
          this.scene.add
            .line(
              0,
              0,
              absolutePos(col),
              absolutePos(row),
              absolutePos(this.path[index + 1].col),
              absolutePos(this.path[index + 1].row)
            )
            .setStrokeStyle(2, 0xffffff, 0.25)
            .setDepth(0)
            .setOrigin(0, 0)
        );
      }
    });
  }
  goHome() {
    this.goto(0, 0);
  }

  follow() {
    this.scene.cameras.main.startFollow(this);
  }
  remove() {
    this.scene.allAgents.delete(this);
    this.destroy();
  }
}
