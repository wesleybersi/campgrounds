import MainScene from "../../../Main/MainScene";
import HUDScene from "../../HudScene";
import { Container } from "./../../../../../../../basket-js/src/store/types";
export class GameSpeed {
  mainScene: MainScene;
  background: Phaser.GameObjects.Rectangle;
  prevGameSpeed = 1;
  buttons: Phaser.GameObjects.Rectangle[] = [];

  dayBackground: Phaser.GameObjects.Rectangle;
  dayCounter: Phaser.GameObjects.Rectangle;
  dayText: Phaser.GameObjects.Text;
  x: number;
  y: number;
  constructor(HUD: HUDScene, mainScene: MainScene) {
    this.mainScene = mainScene;
    const amount = mainScene.gameSpeedValues.length;
    const buttonWidth = 40;
    const buttonHeight = 40;
    const totalPadding = amount * HUD.innerPad + HUD.innerPad;
    const width = buttonWidth * amount + totalPadding;
    const height = buttonHeight + HUD.innerPad * 2;
    this.x = HUD.camera.width - width - HUD.innerPad;
    this.y = HUD.innerPad;

    this.background = HUD.add
      .rectangle(this.x, this.y, width, height, 0x000000, 0.25)
      .setOrigin(0, 0);

    for (let i = 0; i < mainScene.gameSpeedValues.length; i++) {
      let buttonX = this.x;
      const offset = i * (buttonWidth + HUD.innerPad);
      buttonX += offset;
      const button = HUD.add
        .rectangle(
          buttonX + HUD.innerPad,
          this.y + HUD.innerPad,
          buttonWidth,
          buttonHeight
        )
        .setFillStyle(0x000000)
        .setAlpha(0.15)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true });
      this.buttons.push(button);

      button.on("pointerdown", () => {
        this.mainScene.setSpeed(i);
      });
    }

    this.dayBackground = HUD.add
      .rectangle(
        this.x,
        this.y + height + HUD.innerPad,
        width,
        HUD.innerPad * 2.5,
        0x000000,
        0.25
      )
      .setOrigin(0, 0);

    this.dayCounter = HUD.add
      .rectangle(
        this.x,
        this.y + height + HUD.innerPad,
        width,
        HUD.innerPad * 2.5,
        0x2244ff,
        0.65
      )
      .setOrigin(0, 0);

    this.dayText = HUD.add
      .text(this.x + width / 2, this.y + height + HUD.innerPad + 2, "1")
      .setOrigin(0.5, 0);
  }
  update() {
    const speed = this.mainScene.gameSpeed;
    const index = this.mainScene.gameSpeedValues.indexOf(speed);

    this.buttons.forEach((btn, i) => {
      if (i === index) {
        btn.setFillStyle(0xffffff);
        btn.setAlpha(0.5);
      } else {
        btn.setFillStyle(0x000000);
        btn.setAlpha(0.15);
      }
    });
  }
  updateDay() {
    const lengthOfDay = this.mainScene.framesPerDay;
    const phase = this.mainScene.timeOfDay;
    const progress = (phase / lengthOfDay) * 100;

    this.dayCounter.setSize(
      this.dayBackground.width * (progress / 100),
      this.dayBackground.height
    );

    if (this.mainScene.isEvening) {
      this.dayCounter.setFillStyle(0x1122aa);
    } else {
      this.dayCounter.setFillStyle(0x3366cc);
    }
    this.dayText.setText(this.mainScene.currentDay.toString());
  }
}
