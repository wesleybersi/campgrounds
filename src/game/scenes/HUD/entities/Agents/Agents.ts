import MainScene from "../../../Main/MainScene";
import HUDScene from "../../HudScene";
import { Container } from "../../../../../../../basket-js/src/store/types";
export class Agents {
  mainScene: MainScene;
  backgroundTop: Phaser.GameObjects.Rectangle;
  backgroundBottom: Phaser.GameObjects.Rectangle;

  topText: Phaser.GameObjects.Text;
  bottomText: Phaser.GameObjects.Text;
  x: number;
  y: number;

  constructor(HUD: HUDScene, mainScene: MainScene) {
    this.mainScene = mainScene;
    const topWidth = 128;
    const topHeight = 96;
    const bottomWidth = 128;
    const bottomHeight = 32;
    this.x = HUD.innerPad;
    this.y = HUD.innerPad;

    this.backgroundTop = HUD.add
      .rectangle(this.x, this.y, topWidth, topHeight, 0x000000, 0.25)
      .setOrigin(0, 0);
    this.backgroundBottom = HUD.add
      .rectangle(
        this.x,
        this.y + topHeight + HUD.innerPad,
        bottomWidth,
        bottomHeight,
        0x000000,
        0.25
      )
      .setOrigin(0, 0);

    this.topText = HUD.add
      .text(this.x + topWidth / 2, this.y + topHeight / 2, "1/14")
      .setFontSize("40px")
      .setOrigin(0.5, 0.5);

    this.bottomText = HUD.add
      .text(
        this.x + topWidth / 2,
        this.y + topHeight + HUD.innerPad + 4,
        "8 tasks"
      )
      .setFontSize("24px")
      .setOrigin(0.5, 0);
  }
  update() {
    const totalAgents = this.mainScene.staff.workers.size;
    const availableAgents = Array.from(this.mainScene.staff.workers).filter(
      (agent) => !agent.taskQueue
    ).length;

    this.topText.setText(`${availableAgents}/${totalAgents}`);
    this.bottomText.setText(`${this.mainScene.staff.queuedTasks.length} tasks`);
  }
}
