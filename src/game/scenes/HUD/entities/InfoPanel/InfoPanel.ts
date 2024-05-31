import MainScene from "../../../Main/MainScene";
import HUDScene from "../../HudScene";

export class InfoPanel {
  mainScene: MainScene;
  background: Phaser.GameObjects.Rectangle;
  title: Phaser.GameObjects.Text;
  daysAlive: Phaser.GameObjects.Text;
  description: Phaser.GameObjects.Text;
  x: number;
  y: number;
  constructor(HUD: HUDScene, mainScene: MainScene) {
    this.mainScene = mainScene;
    const width = 250;
    const height = 300;
    this.x = HUD.innerPad;
    this.y = 154;

    this.background = HUD.add
      .rectangle(this.x, this.y, width, height, 0x000000, 0.25)
      .setOrigin(0, 0);

    this.title = HUD.add
      .text(this.x + HUD.innerPad, this.y + HUD.innerPad, "Title")
      .setFontSize("24px")
      .setSize(width, height)
      .setWordWrapWidth(width);
    this.daysAlive = HUD.add
      .text(this.x + HUD.innerPad, this.y + HUD.innerPad + 32, "")
      .setFontSize("16px")
      .setSize(width, height)
      .setWordWrapWidth(width);
    this.description = HUD.add
      .text(this.x + HUD.innerPad, this.y + HUD.innerPad + 64, "")
      .setFontSize("16px")
      .setSize(width, height)
      .setWordWrapWidth(width);
  }
  update() {
    const selection = this.mainScene.client.selected;
    if (selection) {
      const title = selection.name;
      this.background.setAlpha(1);
      this.title.setText(title);
      this.daysAlive.setText(
        "Days in service: " + selection.daysInService.toString()
      );
      this.description.setText(selection.description[0]);
    } else {
      this.title.setText("");
      this.daysAlive.setText("");
      this.background.setAlpha(0);
    }
  }
}
