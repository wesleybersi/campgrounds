import MainScene from "../../../Main/MainScene";
import HUDScene from "../../HudScene";

export class Center {
  mainScene: MainScene;
  background: Phaser.GameObjects.Rectangle;
  buttons: Phaser.GameObjects.Rectangle[] = [];
  modeText: Phaser.GameObjects.Text;
  x: number;
  y: number;
  constructor(HUD: HUDScene, mainScene: MainScene) {
    this.mainScene = mainScene;
    const width = 400;
    const height = 64;
    this.x = HUD.camera.centerX - width / 2;
    this.y = HUD.innerPad;

    this.background = HUD.add
      .rectangle(this.x, this.y, width, height, 0x000000, 0.25)
      .setOrigin(0, 0);

    this.modeText = HUD.add
      .text(this.x + HUD.innerPad, this.y + height / 2 - 16, "")
      .setFontSize("24px");
  }
  update() {
    this.modeText.setText("Tool: " + this.mainScene.client.order);
    //
  }
}
