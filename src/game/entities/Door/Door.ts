import MainScene from "../../scenes/Main/MainScene";
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  STROKE_COLOR,
  STROKE_WIDTH,
} from "../../scenes/Main/constants";
import { Direction } from "../../types";

export class Door extends Phaser.GameObjects.Container {
  scene: MainScene;
  row: number;
  col: number;
  orientation: "horizontal" | "vertical";
  direction: Direction;
  base: Phaser.GameObjects.Rectangle;
  thickness = 32;
  // knob: Phaser.GameObjects.Arc;
  constructor(
    scene: MainScene,
    orientation: "horizontal" | "vertical",
    direction: "up" | "down" | "left" | "right",
    row: number,
    col: number,
    isLocked?: boolean
  ) {
    super(
      scene,
      orientation === "horizontal"
        ? col * CELL_WIDTH + CELL_WIDTH
        : col * CELL_WIDTH + CELL_WIDTH / 2, //x
      orientation === "horizontal"
        ? row * CELL_HEIGHT + CELL_HEIGHT / 2
        : row * CELL_HEIGHT + CELL_HEIGHT
    );

    this.scene = scene;
    this.orientation = orientation;
    this.row = row;
    this.col = col;

    this.direction = direction;
    this.base = this.scene.add.rectangle(
      orientation === "horizontal" ? -CELL_WIDTH : 0,
      orientation === "horizontal" ? 0 : -CELL_HEIGHT,
      orientation === "horizontal" ? CELL_WIDTH * 2 : this.thickness,
      orientation === "horizontal" ? this.thickness : CELL_HEIGHT * 2
    );
    this.base.setFillStyle(0x3e2b29);
    this.base.setStrokeStyle(STROKE_WIDTH, STROKE_COLOR);
    this.base.setOrigin(0, 0);
    this.add(this.base);

    this.setDepth(0);

    scene.add.existing(this);

    this.scene.events.on(
      `door-${row}-${col}`,
      (
        type: "open" | "close" | "unlock",
        direction?: "up" | "down" | "left" | "right"
      ) => {
        switch (type) {
          case "open":
            this.open();
            break;
          case "close":
            this.close();
            break;
        }
      }
    );

    this.scene.events.once("clear", this.remove, this);
  }
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.scene.events.removeListener(`door-${this.row}-${this.col}`);
    this.destroy();
  }
  open() {
    switch (this.orientation) {
      case "horizontal":
        {
          const targetAngle = this.direction === "up" ? -90 : 90;
          this.scene.tweens.add({
            targets: this.base,
            angle: targetAngle,
            duration: 250,
            ease: "Sine.In",
          });
        }
        break;
      case "vertical":
        {
          const targetAngle = this.direction === "left" ? -90 : 90;
          this.scene.tweens.add({
            targets: this.base,
            angle: targetAngle,
            duration: 250,
            ease: "Sine.In",
          });
        }
        break;
    }
  }
  close() {
    switch (this.orientation) {
      case "horizontal":
        {
          this.scene.tweens.add({
            targets: this.base,
            angle: 0,
            duration: 250,
            ease: "Sine.In",
          });
        }
        break;
      case "vertical":
        {
          this.scene.tweens.add({
            targets: this.base,
            angle: 0,
            duration: 250,
            ease: "Sine.In",
          });
        }
        break;
    }
  }
}
