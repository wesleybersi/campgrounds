import MainScene from "../../scenes/Main/MainScene";

export class Laser extends Phaser.GameObjects.Line {
  scene: MainScene;
  id: string;
  constructor(
    scene: MainScene,
    id: string,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    super(scene, 0, 0, start.x, start.y, end.x, end.y, 0x9f0404, 1);
    this.scene = scene;
    this.id = id;
    this.setLineWidth(3);
    this.scene.lasersByID.set(id, this);
    this.scene.add.existing(this);
  }
  update(start: { x: number; y: number }, end: { x: number; y: number }) {
    this.setTo(start.x, start.y, end.x, end.y);
    console.log(start.x, start.y, end.x, end.y);
    this.scene.emitter.emitLaser(end.x, end.y);
  }
  remove() {
    this.setActive(false);
    this.scene.lasersByID.delete(this.id);
    this.destroy();
  }
}
