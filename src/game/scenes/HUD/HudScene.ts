import Phaser from "phaser";
import MainScene from "../Main/MainScene";
import { GameSpeed } from "./entities/GameSpeed/GameSpeed";
import { Center } from "./entities/Center/Center";
import { Agents } from "./entities/Agents/Agents";
import { InfoPanel } from "./entities/InfoPanel/InfoPanel";
import { Resources } from "./entities/Resources/Resources";

export default class HUDScene extends Phaser.Scene {
  main!: MainScene;
  camera!: Phaser.Cameras.Scene2D.Camera;
  screenPad = 16;
  innerPad = 8;
  gameSpeed!: GameSpeed;
  center!: Center;
  agents!: Agents;
  infoPanel!: InfoPanel;
  resources!: Resources;

  constructor() {
    super({ key: "HUD" });
  }
  create(main: MainScene) {
    this.main = main;
    this.camera = this.cameras.main;
    this.gameSpeed = new GameSpeed(this, this.main);
    this.gameSpeed.update();
    this.center = new Center(this, this.main);
    this.agents = new Agents(this, this.main);
    this.infoPanel = new InfoPanel(this, this.main);
    this.resources = new Resources(this, this.main);
  }
  update() {
    // const camera = this.cameras.main;
    if (this.gameSpeed.prevGameSpeed !== this.main.gameSpeed) {
      this.gameSpeed.update();
      this.gameSpeed.prevGameSpeed = this.main.gameSpeed;
    }
    this.gameSpeed.updateDay();

    this.agents.update();
    this.center.update();

    this.infoPanel.update();
    this.resources.update();
    // this.modeText?.destroy();
    // this.modeText = this.add
    //   .text(
    //     camera.worldView.right - CELL_SIZE * 15,
    //     camera.worldView.bottom - CELL_SIZE,
    //     `GameSpeed: ${this.gameSpeed} Mode: ${this.client.placeMode} - ${availableAgents} / ${totalAgents} TASKS: ${this.labour.queuedTasks.length}, wood: ${this.client.resources.wood}`
    //   )
    //   .setFill("#000000");

    // this.stateText.setDepth(200);
  }
}
