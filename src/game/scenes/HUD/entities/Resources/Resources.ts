import MainScene from "../../../Main/MainScene";
import HUDScene from "../../HudScene";

export class Resources {
  mainScene: MainScene;
  background: Phaser.GameObjects.Rectangle;
  prevGameSpeed = 1;
  buttons: Phaser.GameObjects.Rectangle[] = [];
  resourceText: Phaser.GameObjects.Text[] = [];
  x: number;
  y: number;
  constructor(HUD: HUDScene, mainScene: MainScene) {
    this.mainScene = mainScene;
    const amount = mainScene.gameSpeedValues.length;
    const buttonWidth = 64;
    const buttonHeight = 64;
    const totalPadding = amount * HUD.innerPad + HUD.innerPad;
    const height = buttonWidth * amount + totalPadding;
    const width = buttonHeight + HUD.innerPad * 2;
    this.x = HUD.camera.width - width - HUD.innerPad;
    this.y = HUD.camera.centerY - height / 2;

    this.background = HUD.add
      .rectangle(this.x, this.y, width, height, 0x000000, 0.25)
      .setOrigin(0, 0);

    for (
      let i = 0;
      i < Object.entries(mainScene.client.inventory.materials).length;
      i++
    ) {
      let buttonY = this.y;
      const offset = i * (buttonHeight + HUD.innerPad);
      buttonY += offset;
      const button = HUD.add
        .rectangle(
          this.x + HUD.innerPad,
          buttonY + HUD.innerPad,
          buttonWidth,
          buttonHeight
        )
        .setFillStyle(0x000000)
        .setAlpha(0.15)
        .setOrigin(0, 0)
        .setInteractive();
      this.buttons.push(button);
      this.resourceText.push(
        HUD.add
          .text(this.x + 12, buttonY + buttonHeight / 2, "100")
          .setOrigin(0, 0)
      );
    }
  }
  update() {
    const materials = Object.entries(this.mainScene.client.inventory.materials);
    materials.forEach(([type, amount], i) => {
      this.resourceText[i].setText(amount.toString());
    });
  }
}
