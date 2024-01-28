import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT, CELL_WIDTH } from "../../scenes/Main/constants";
import { Direction } from "../../types";

export class Door extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  row: number;
  col: number;
  orientation: "horizontal" | "vertical";
  constructor(
    scene: MainScene,
    orientation: "horizontal" | "vertical",
    row: number,
    col: number,
    isLocked?: boolean
  ) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      orientation === "vertical"
        ? row * CELL_HEIGHT
        : row * CELL_HEIGHT + CELL_HEIGHT / 2,
      isLocked
        ? "door-locked"
        : orientation === "horizontal"
        ? "door-horz"
        : "door-vert",
      0
    );
    this.scene = scene;
    this.orientation = orientation;
    this.row = row;
    this.col = col;

    this.setOrigin(0.5, 0.5);
    this.setDepth(4);

    scene.add.existing(this);

    this.scene.events.on(
      `door-${row}-${col}`,
      (
        type: "open" | "close" | "unlock",
        direction?: "up" | "down" | "left" | "right"
      ) => {
        switch (type) {
          case "open":
            if (direction) this.open(direction);
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
  open(direction: Direction) {
    if (this.orientation === "horizontal") {
      this.setTexture("door-vert");
      if (direction === "down") {
        this.x = this.col * CELL_WIDTH + CELL_WIDTH / 2 - 6;
        this.y = this.row * CELL_HEIGHT + CELL_HEIGHT / 2 + 2;
      } else if (direction === "up") {
        this.x = this.col * CELL_WIDTH + CELL_WIDTH / 2 - 6;
        this.y = this.row * CELL_HEIGHT + CELL_HEIGHT / 2 - 10;
      }
    } else if (this.orientation === "vertical") {
      if (direction === "left") {
        this.setScale(-1, 1);
        this.x = this.col * CELL_WIDTH + CELL_WIDTH / 2 - 6;
        this.y = this.row * CELL_HEIGHT + CELL_HEIGHT / 2 - 8;
      } else if (direction === "right") {
        this.setScale(1);
        this.x = this.col * CELL_WIDTH + CELL_WIDTH / 2 + 6;
        this.y = this.row * CELL_HEIGHT + CELL_HEIGHT / 2 - 8;
      }
      this.setTexture("door-horz");
    }
  }
  close() {
    if (this.orientation === "horizontal") {
      this.setTexture("door-horz");
      this.x = this.col * CELL_WIDTH + CELL_WIDTH / 2;
      this.y = this.row * CELL_HEIGHT + CELL_HEIGHT / 2;
    } else if (this.orientation === "vertical") {
      this.setScale(1);
      this.x = this.col * CELL_WIDTH + CELL_WIDTH / 2;
      this.y = this.row * CELL_HEIGHT;
      this.setTexture("door-vert");
    }
  }
}
