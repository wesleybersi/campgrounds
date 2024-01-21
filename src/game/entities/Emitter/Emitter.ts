import MainScene from "../../scenes/Main/MainScene";
import { clamp, randomNum } from "../../utils/helper-functions";

class Emitter {
  scene: MainScene;
  emitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor(scene: MainScene) {
    this.scene = scene;
    this.emitter?.setDepth(200);
  }
  emitSmoke(x: number, y: number) {
    this.emitter = this.scene.add.particles(x, y, "smoke", {
      // color: [0xffffff],/
      color: [0xffffff, 0xefefef, 0xafafaf, 0xdfdfdf],
      colorEase: "quad.out",
      lifespan: 400,
      // angle: { min: -100, max: -80 },
      alpha: { start: 1, end: 0.25, ease: "sine.out" },
      scale: { start: 4, end: 0, ease: "sine.out" },
      speed: 50,
      advance: 500,
      deathCallback: () => {
        this.emitter?.stop();
      },
    });
  }

  emitBlood(x: number, y: number) {
    this.emitter = this.scene.add.particles(x, y, "smoke", {
      color: [0x9f0404, 0xff0000],
      colorEase: "quad.out",
      lifespan: clamp(randomNum(750), 125, 500),
      // angle: { min: -100, max: -80 },
      alpha: { start: 1, end: 0.25, ease: "sine.out" },
      scale: { start: 2, end: 0, ease: "sine.out" },
      speed: 150,
      advance: 500,
      deathCallback: () => {
        this.emitter?.stop();
      },
    });
    this.emitter?.setDepth(500);
  }
  emitExplosion(x: number, y: number) {
    this.emitter = this.scene.add.particles(x, y, "smoke", {
      color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
      // color: [0xffffff, 0x8800ff],
      colorEase: "quad.out",
      lifespan: 1500,
      // angle: { min: -100, max: -80 },
      alpha: { start: 1, end: 0.25, ease: "sine.out" },
      scale: { start: 0.65, end: 0, ease: "sine.out" },
      speed: 150,
      advance: 1500,
      deathCallback: () => {
        this.emitter?.stop();
      },
    });
  }
  emitLooseBow(x: number, y: number) {
    this.emitter = this.scene.add.particles(x, y, "smoke", {
      color: [0xffffff, 0xefefef, 0xafafaf, 0xdfdfdf],
      colorEase: "quad.out",
      lifespan: 500,
      // angle: { min: -100, max: -80 },
      alpha: { start: 0.15, end: 0, ease: "sine.out" },
      scale: { start: 0.5, end: 0, ease: "sine.out" },
      speed: 200,
      advance: 1750,
      deathCallback: () => {
        this.emitter?.stop();
      },
    });
    this.emitter.setDepth(10000);
  }
  emitImpact(x: number, y: number) {
    this.emitter = this.scene.add.particles(x, y, "smoke", {
      color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],

      colorEase: "quad.out",
      lifespan: clamp(randomNum(500), 125, 500),
      // angle: { min: -100, max: -80 },
      alpha: { start: 1, end: 0.25, ease: "sine.out" },
      scale: { start: 0.65, end: 0, ease: "sine.out" },
      speed: 200,
      advance: 1500,
      deathCallback: () => {
        this.emitter?.stop();
      },
    });
  }
  emitLaser(x: number, y: number) {
    this.emitter = this.scene.add.particles(x, y, "smoke", {
      color: [0xffffff, 0xf83600, 0x9f0404],

      colorEase: "quad.out",
      lifespan: clamp(randomNum(400), 75, 400),
      // angle: { min: -100, max: -80 },
      alpha: { start: 0.5, end: 0.25, ease: "sine.out" },
      scale: { start: 0.45, end: 0, ease: "sine.out" },
      speed: 200,
      advance: 5000,
      deathCallback: () => {
        this.emitter?.stop();
      },
    });
  }
}

export default Emitter;
