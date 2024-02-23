import MainScene from "../../scenes/Main/MainScene";
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  SHADOW_SIZE,
  STROKE_COLOR,
  STROKE_WIDTH,
} from "../../scenes/Main/constants";
import { getRandomInt, oneIn } from "../../utils/helper-functions";

export class Pot extends Phaser.GameObjects.Container {
  scene: MainScene;
  id: string;

  shadow: Phaser.GameObjects.Rectangle | null = null;

  plankT: Phaser.GameObjects.Rectangle | null = null;
  plankL: Phaser.GameObjects.Rectangle | null = null;
  plankR: Phaser.GameObjects.Rectangle | null = null;
  plankB: Phaser.GameObjects.Rectangle | null = null;

  outer: Phaser.GameObjects.Rectangle | null = null;
  inner: Phaser.GameObjects.Rectangle | null = null;
  plank1: Phaser.GameObjects.Rectangle | null = null;
  plank2: Phaser.GameObjects.Rectangle | null = null;
  bombIcon: Phaser.GameObjects.Arc | null = null;

  isBig: boolean;
  isExplosive: boolean;
  constructor(
    scene: MainScene,
    id: string,
    x: number,
    y: number,
    isBig: boolean,
    isExplosive: boolean
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.id = id;
    this.isBig = isBig;
    this.isExplosive = isExplosive;

    const width = isBig ? CELL_WIDTH * 2 : CELL_WIDTH;
    const height = isBig ? CELL_HEIGHT * 2 : CELL_HEIGHT;
    const plankWidth = isBig ? 30 : 22;
    const strokeSize = 5;

    const palette = {
      dark: 0x937162,
      light: 0xb59384,
      darkExplosive: 0xa92b2e,
      lightExplosive: 0xd2af34,
    };

    this.shadow = this.scene.add
      .rectangle(0, 0, width + SHADOW_SIZE, height + SHADOW_SIZE)
      .setFillStyle(0x222222)
      .setAlpha(0.15)
      .setDepth(0);

    this.outer = this.scene.add
      .rectangle(0, 0, width, height)
      .setFillStyle(!isExplosive ? palette.dark : palette.darkExplosive)
      .setStrokeStyle(strokeSize, STROKE_COLOR);

    this.inner = this.scene.add
      .rectangle(0, 0, width - plankWidth * 2, height - plankWidth * 2)
      .setFillStyle(!isExplosive ? palette.light : palette.lightExplosive)
      .setStrokeStyle(strokeSize, STROKE_COLOR);

    this.add([this.shadow, this.outer, this.inner]);

    // if (isExplosive) {
    //   this.bombIcon = this.scene.add.arc(0, 0, 28).setFillStyle(STROKE_COLOR);
    //   this.add(this.bombIcon);
    // }

    if (oneIn(2)) {
      this.plank1 = this.scene.add
        .rectangle(0, 0, plankWidth, height + 32)
        .setFillStyle(!isExplosive ? palette.dark : palette.darkExplosive)
        .setStrokeStyle(strokeSize, STROKE_COLOR)
        .setAngle(45);
      this.add(this.plank1);
    }

    if (oneIn(2)) {
      this.plank2 = this.scene.add
        .rectangle(0, 0, plankWidth, height + 32)
        .setFillStyle(!isExplosive ? palette.dark : palette.darkExplosive)
        .setStrokeStyle(strokeSize, STROKE_COLOR)
        .setAngle(-45);
      this.add(this.plank2);
    }

    if (oneIn(2)) {
      if (this.plank1) this.add(this.plank1);
      if (this.plank2) this.add(this.plank2);
    } else {
      if (this.plank2) this.add(this.plank2);
      if (this.plank1) this.add(this.plank1);
    }

    this.scene.add.existing(this);
    this.setDepth(5);

    this.scene.events.on(
      this.id,
      (type: "remove" | "update" | "hit", x?: number, y?: number) => {
        switch (type) {
          // case "remove":
          //   this.hit();
          //   break;
          case "hit":
            this.hit();
            break;
          case "update":
            this.update(x ?? 0, y ?? 0);
            break;
        }
      }
    );
    this.scene.events.once("clear", this.remove, this);
  }
  remove() {
    this.scene.events.removeListener(this.id);
    this.scene.events.removeListener("clear", this.remove, this);
    this.destroy();
  }
  hit() {
    if (this.isExplosive) {
      if (this.isBig) {
        this.scene.emitter.emitExplosion(
          this.x - CELL_WIDTH,
          this.y - CELL_HEIGHT
        );
        this.scene.emitter.emitExplosion(
          this.x - CELL_WIDTH,
          this.y + CELL_HEIGHT
        );
        this.scene.emitter.emitExplosion(
          this.x + CELL_WIDTH,
          this.y + CELL_HEIGHT
        );
        this.scene.emitter.emitExplosion(
          this.x + CELL_WIDTH,
          this.y - CELL_HEIGHT
        );
      } else {
        this.scene.emitter.emitExplosion(this.x, this.y);
      }
      this.scene.emitter.emitSmoke(this.x, this.y);
      this.remove();
      return;
    } else this.scene.emitter.emitSmoke(this.x, this.y);

    const isBig = this.isBig;
    const plankWidth = isBig ? 32 : 24;

    if (oneIn(4)) {
      this.plankT = this.scene.add
        .rectangle(
          0,
          isBig ? -CELL_HEIGHT : -CELL_HEIGHT / 2,
          isBig ? CELL_WIDTH * 2 : CELL_WIDTH,
          plankWidth
        )
        .setFillStyle(0x937162)
        .setStrokeStyle(6, STROKE_COLOR);
      this.add(this.plankT);
      this.scene.tweens.add({
        targets: this.plankT,
        angle: getRandomInt(0, 110),
        scale: 0.8,
        duration: getRandomInt(100, 500),
      });
    }

    if (oneIn(4)) {
      this.plankB = this.scene.add
        .rectangle(
          0,
          isBig ? +CELL_HEIGHT : +CELL_HEIGHT / 2,
          isBig ? CELL_WIDTH * 2 : CELL_WIDTH,
          plankWidth
        )
        .setFillStyle(0x937162)
        .setStrokeStyle(6, STROKE_COLOR);
      this.add(this.plankB);
      this.scene.tweens.add({
        targets: this.plankB,
        angle: getRandomInt(0, 110),
        scale: 0.8,
        duration: getRandomInt(100, 500),
      });
    }

    if (oneIn(4)) {
      this.plankR = this.scene.add
        .rectangle(
          isBig ? +CELL_HEIGHT : +CELL_HEIGHT / 2,
          0,
          plankWidth,
          isBig ? CELL_WIDTH * 2 : CELL_WIDTH
        )
        .setFillStyle(0x937162)
        .setStrokeStyle(6, STROKE_COLOR);
      this.add(this.plankR);
      this.scene.tweens.add({
        targets: this.plankR,
        angle: getRandomInt(0, 110),
        scale: 0.8,
        duration: getRandomInt(100, 500),
      });
    }

    if (oneIn(4)) {
      this.plankL = this.scene.add
        .rectangle(
          isBig ? -CELL_HEIGHT : -CELL_HEIGHT / 2,
          0,
          plankWidth,
          isBig ? CELL_WIDTH * 2 : CELL_WIDTH
        )
        .setFillStyle(0x937162)
        .setStrokeStyle(6, STROKE_COLOR);
      this.add(this.plankL);
      this.scene.tweens.add({
        targets: this.plankL,
        angle: getRandomInt(0, 110),
        scale: 0.8,
        duration: getRandomInt(100, 500),
      });
    }

    // this.add([this.plankB, this.plankT, this.plankL, this.plankR]);

    this.scene.tweens.add({
      targets: [this.shadow, this.outer, this.inner],
      scale: 0.9,
      angle: getRandomInt(-15, 15),
      duration: 400,
      alpha: 0,
      ease: "Sine.Out",

      onComplete: () => {
        this.setDepth(0);
      },
    });

    if (this.bombIcon) {
      this.scene.tweens.add({
        targets: [this.bombIcon],
        scale: 0.9,
        angle: getRandomInt(-15, 15),
        duration: 400,
        alpha: 0,
        ease: "Sine.Out",
      });
    }

    // if (this.plankB) {
    //   this.scene.tweens.add({
    //     targets: this.plankB,
    //     angle: getRandomInt(0, 110),
    //     scale: 0.8,
    //     ease: "Sine.Out",
    //     duration: getRandomInt(100, 500),
    //   });
    // }

    // if (this.plankL) {
    //   this.scene.tweens.add({
    //     targets: this.plankL,
    //     angle: getRandomInt(0, 110),
    //     scale: 0.8,
    //     duration: getRandomInt(100, 500),
    //   });
    // }
    // if (this.plankR) {
    //   this.scene.tweens.add({
    //     targets: this.plankR,
    //     angle: getRandomInt(0, 110),
    //     scale: 0.8,
    //     duration: getRandomInt(100, 500),
    //   });
    // }

    if (this.plank1) {
      this.scene.tweens.add({
        targets: this.plank1,
        angle: getRandomInt(0, 110),
        scale: 0.8,
        duration: getRandomInt(100, 500),
      });
    }
    if (this.plank2) {
      this.scene.tweens.add({
        targets: this.plank2,
        scale: 0.8,
        angle: getRandomInt(0, 110) * -1,
        duration: getRandomInt(100, 500),
      });
    }

    setTimeout(() => {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.remove();
        },
      });
    }, 10000);
  }

  update(x: number, y: number) {
    this.setPosition(x, y);
    this.setDepth(2000);
  }
}
