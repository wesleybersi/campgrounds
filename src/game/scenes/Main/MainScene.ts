import Phaser from "phaser";

import preload from "./methods/preload";
import create from "./methods/create/create";
import LoadingScene from "../Loading/LoadingScene";

import { CELL_SIZE } from "./constants";
import update from "./methods/update";
import { pointerEvents } from "./entities/Client/events/pointer";
import { keyboardEvents } from "./entities/Client/events/keyboard";
import { Client } from "./entities/Client/Client";
import { Grid } from "./entities/Grid/Grid";
import { Staff } from "./entities/Staff/Staff";
import { Agent } from "./entities/Agent/Agent";
import { Recreation } from "./entities/Recreation/Recreation";

export const createMainScene = (callback: (scene: MainScene) => void) => {
  return new MainScene(callback);
};

export default class MainScene extends Phaser.Scene {
  hasLoaded = false;
  client!: Client;
  grid!: Grid;
  // tilemap!: BasicTilemap;
  loadingScene!: LoadingScene;
  loadingMessage = "";

  siteName = "My Campsite";
  rowCount: number;
  colCount: number;
  cellCount: number;

  width: number;
  height: number;

  allAgents = new Set<Agent>();
  staff!: Staff;
  recreation!: Recreation;

  //Controls
  buttons = { shift: false, r: false };

  //Players

  // boundingBox!: Phaser.GameObjects.Rectangle;

  //Matrix
  objectMatrix: string[][] = [];
  spriteGridMatrix: string[][] = []; // <row,col, sprite>

  stateText!: Phaser.GameObjects.Text;
  frameCounter = 0;
  delta!: number;
  gameSpeed = 1;
  gameSpeedValues = [0, 1, 2, 4];

  currentDay = 1;
  isEvening = false;
  // framesPerDay = 2500;

  framesPerDay = 18000;
  timeOfDay = 0;

  target: {
    row: number;
    col: number;
    x: number;
    y: number;
  } = { row: -1, col: -1, x: -1, y: -1 };
  //External Methods
  preload = preload;
  create = create;
  update = update;

  topDepth = 1_000_000;

  //Events
  pointerEvents = pointerEvents;
  keyboardEvents = keyboardEvents;
  reactCallback: (scene: MainScene) => void;

  constructor(callback: (scene: MainScene) => void) {
    super({ key: "Main" });
    // this.rowCount = 400;
    // this.colCount = 650;
    this.rowCount = 250;
    this.colCount = 350;
    this.cellCount = this.rowCount * this.colCount;
    this.reactCallback = callback;
    this.width = this.colCount * CELL_SIZE;
    this.height = this.rowCount * CELL_SIZE;
  }
  clear() {
    this.events.emit("clear");
    this.cameras.main.stopFollow();
    this.cameras.main.fadeOut();
  }
  setSpeed(index: number) {
    this.gameSpeed = this.gameSpeedValues[index];
  }
  increaseSpeed() {
    let index = this.gameSpeedValues.indexOf(this.gameSpeed);
    if (index === this.gameSpeedValues.length - 1) {
      index = 0;
    } else {
      index++;
    }
    this.gameSpeed = this.gameSpeedValues[index];
  }
  decreaseSpeed() {
    let index = this.gameSpeedValues.indexOf(this.gameSpeed);
    if (index === 0) {
      index = this.gameSpeedValues.length - 1;
    } else {
      index--;
    }
    this.gameSpeed = this.gameSpeedValues[index];
  }

  isInViewport(x: number, y: number) {
    const { left, right, top, bottom } = this.cameras.main.worldView;
    return !(
      x < left - CELL_SIZE ||
      x > right + CELL_SIZE ||
      y < top - CELL_SIZE ||
      y > bottom + CELL_SIZE
    );
  }
}
