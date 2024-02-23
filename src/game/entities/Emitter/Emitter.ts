import MainScene from "../../scenes/Main/MainScene";

class Emitter {
  scene: MainScene;
  constructor(scene: MainScene) {
    this.scene = scene;
  }

  emitSmoke(x: number, y: number) {
    const emitter = this.scene.add
      .particles(x, y, "particle", {
        color: [0xffffff, 0xefefef, 0xafafaf, 0xdfdfdf],
        colorEase: "quad.out",
        lifespan: 500,
        // angle: { min: -100, max: -80 },
        alpha: { start: 0.5, end: 0, ease: "sine.out" },
        scale: { start: 1, end: 0, ease: "sine.out" },
        speed: 600,
        advance: 475,
        deathCallback: () => {
          emitter.stop();
        },
      })
      .setDepth(500);
  }
  emitBlood(x: number, y: number) {
    const emitter = this.scene.add
      .particles(x, y, "particle", {
        color: [0x9f0404, 0xff0000],
        colorEase: "quad.out",
        lifespan: 500,
        // angle: { min: -100, max: -80 },
        alpha: { start: 0.4, end: 0, ease: "sine.out" },
        scale: { start: 0.75, end: 0, ease: "sine.out" },
        speed: 600,
        advance: 450,
        deathCallback: () => {
          emitter.stop();
        },
      })
      .setDepth(500);
  }

  emitExplosion(x: number, y: number) {
    const emitter = this.scene.add
      .particles(x, y, "particle", {
        color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        colorEase: "quad.out",
        lifespan: 500,
        // angle: { min: -100, max: -80 },
        alpha: { start: 1, end: 0.25, ease: "sine.out" },
        scale: { start: 2, end: 0, ease: "sine.out" },
        speed: 800,
        advance: 400,
        deathCallback: () => {
          emitter.stop();
        },
      })
      .setDepth(500);
  }
}

export default Emitter;
