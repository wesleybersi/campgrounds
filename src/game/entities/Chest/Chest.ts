import MainScene from "../../scenes/Main/MainScene";
import { CELL_HEIGHT } from "../../scenes/Main/constants";

export class Chest extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  tier: "silver" | "gold";
  row: number;
  col: number;
  constructor(
    scene: MainScene,
    tier: "silver" | "gold",
    initialState: "open" | "closed",
    row: number,
    col: number
  ) {
    super(
      scene,
      col * CELL_HEIGHT + CELL_HEIGHT / 2,
      row * CELL_HEIGHT,
      "chest",
      tier === "silver" ? 0 : 7
    );
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.tier = tier;

    this.setOrigin(0.5, 0.5);
    this.setDepth(4);
    this.createAnimation();
    this.scene.add.existing(this);
    if (initialState === "open") {
      this.open(true);
    }

    this.scene.events.on(`chest-${row}-${col}`, (type: "open" | "close") => {
      switch (type) {
        case "open":
          this.open();
          break;
        case "close":
          this.close();
          break;
      }
    });

    this.scene.events.once("clear", this.remove, this);
  }

  open(instantly?: boolean) {
    if (instantly) {
      this.anims.play("open-instant");
    } else {
      this.anims.play("open");
    }
  }
  close() {
    this.anims.play("close");
  }

  createAnimation() {
    this.anims.create({
      key: "open",
      frames: this.anims.generateFrameNumbers("chest", {
        start: this.tier === "silver" ? 0 : 7,
        end: this.tier === "silver" ? 3 : 10,
      }),
      frameRate: 5,
      repeat: 0,
    });
    this.anims.create({
      key: "open-instant",
      frames: this.anims.generateFrameNumbers("chest", {
        start: this.tier === "silver" ? 0 : 7,
        end: this.tier === "silver" ? 3 : 10,
      }),
      frameRate: 500,
      repeat: 0,
    });
    this.anims.create({
      key: "close",
      frames: this.anims.generateFrameNumbers("chest", {
        start: this.tier === "silver" ? 3 : 0,
        end: this.tier === "silver" ? 10 : 7,
      }),
      frameRate: 5,
      repeat: 0,
    });
  }
  remove() {
    this.scene.events.removeListener("clear", this.remove, this);
    this.scene.events.removeListener(`chest-${this.row}-${this.col}`);
    this.destroy();
  }
}
