import MainScene from "../../scenes/Main/MainScene";

export default class Rocket extends Phaser.GameObjects.Arc {
  scene: MainScene;
  id: number;

  constructor(
    scene: MainScene,
    id: number,
    x: number,
    y: number,
    angle: number
  ) {
    super(scene, x, y, 12);
    this.scene = scene;
    this.id = id;
    this.setAngle(angle);
    this.setFillStyle(0x000000, 1);
    scene.projectilesById.set(this.id, this);
    scene.add.existing(this);
  }
  update(state: string, x: number, y: number, z: number, angle: number) {
    this.setPosition(x, y);
    this.setAngle(angle);
    this.setDepth(z);
    this.scene.emitter.emitLooseBow(x, y);
  }
  impact() {
    this.setActive(false);
    this.setAlpha(0);
    this.scene.emitter.emitExplosion(this.x, this.y);
    this.destroy();
  }
}
