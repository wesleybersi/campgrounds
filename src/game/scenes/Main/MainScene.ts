import Phaser from "phaser";
import { Player } from "../../entities/Player/player";
import preload from "./methods/preload";
import create from "./methods/create";
import BasicTilemap from "../../entities/Tilemap/tilemap";
import LoadingScene from "../Loading/LoadingScene";
import { Socket } from "socket.io-client";
import { Direction } from "../../types";
import { randomNum } from "../../utils/helper-functions";
import { CELL_HEIGHT, CELL_WIDTH, INITIAL_RESPAWN_COUNTER } from "./constants";
import Emitter from "../../entities/Emitter/Emitter";
import { Arrow } from "../../entities/Projectile/Arrow";
import Bullet from "../../entities/Projectile/Bullet";
import Rocket from "../../entities/Projectile/Rocket";
import Grenade from "../../entities/Projectile/Bomb";

import { Tile } from "../../entities/Tile/Tile";
import { Pickup } from "../../entities/Pickup/Pickup";
import { Wall } from "../../entities/Wall/wall";
import { Hole } from "../../entities/Hole/Hole";
import { CELL_SIZE } from "../../../../../../socket-shooter 2/server/src/constants";
import { Stairs } from "../../entities/Stairs/Stairs";
import { Spikes } from "../../entities/Spikes/Spikes";
import { Pot } from "../../entities/Pot/Pot";

export default class MainScene extends Phaser.Scene {
  socket!: Socket;
  socketID!: string;
  hasLoaded = false;
  deadzoneRect!: Phaser.GameObjects.Rectangle;
  tilemap!: BasicTilemap;
  loadingScene!: LoadingScene;
  loadingMessage = "";
  resetAll = false;
  rowCount!: number;
  colCount!: number;
  isBot = false;
  respawnCounter = INITIAL_RESPAWN_COUNTER;
  emitter: Emitter = new Emitter(this);

  //Controls
  buttons = { shift: false, r: false };
  cursors: Direction[] = [];

  //Players
  player!: Player;
  boundingBox!: Phaser.GameObjects.Rectangle;
  playersByID = new Map<string, Player>();

  holesByPos = new Map<string, Hole>();

  //Tiles
  tilesById = new Map<number, Tile>();
  objectsByPos = new Map<string, Stairs>();

  //Spikes
  spikesByPos = new Map<string, Spikes>();

  //Pots
  potsByPos = new Map<string, Pot>();

  //Matrix
  matrix: string[][] = [];

  //Pickups
  pickupsByPos = new Map<string, Pickup>();

  //Projectiles;
  projectilesById = new Map<number, Arrow | Bullet | Rocket | Grenade>();

  stateText!: Phaser.GameObjects.Text;
  frameCounter = 0;
  hover: {
    row: number;
    col: number;
    x: number;
    y: number;
  } = { row: -1, col: -1, x: -1, y: -1 };
  //External Methods
  preload = preload;
  create = create;
  letterPool: string[] = [];
  constructor() {
    super({ key: "Main" });
  }
  clear() {
    this.events.emit("clear");

    if (this.tilemap) {
      this.tilemap.floor.forEachTile((tile) => tile.destroy());
      this.tilemap.floor.destroy();
      this.tilemap.highlightedCells.forEachTile((tile) => tile.destroy());
      this.tilemap.highlightedCells.destroy();
      this.tilemap.floorMap.destroy();
      this.tilemap.wallMap.destroy();
    }
    for (const [, player] of this.playersByID) {
      player.delete();
    }
    for (const [, pickup] of this.pickupsByPos) {
      pickup.remove();
    }
    for (const [, tile] of this.tilesById) {
      tile.remove();
    }

    for (const [, hole] of this.holesByPos) {
      hole.remove();
    }
    for (const [, projectile] of this.projectilesById) {
      projectile.destroy();
    }
    for (const [, object] of this.objectsByPos) {
      object.remove();
    }

    //TODO Pots, torches, pickups, spikes

    this.objectsByPos.clear();
    this.playersByID.clear();
    this.pickupsByPos.clear();
    this.tilesById.clear();
    this.holesByPos.clear();
    this.projectilesById.clear();
    this.cameras.main.stopFollow();
    this.cameras.main.fadeOut();
  }
  isInViewport(x: number, y: number) {
    const { left, right, top, bottom } = this.cameras.main.worldView;
    if (
      x < left - CELL_WIDTH ||
      x > right + CELL_WIDTH ||
      y < top - CELL_HEIGHT ||
      y > bottom + CELL_HEIGHT
    ) {
      return false;
    } else return true;
  }

  update(time: number, delta: number) {
    if (!this.hasLoaded) return;
    const camera = this.cameras.main;
    this.frameCounter++;
    if (this.frameCounter % 60 === 0) {
      this.frameCounter = 0;
    }
    camera.deadzone?.setSize(
      camera.worldView.width * 0.15,
      camera.worldView.height * 0.1
    );

    if (this.frameCounter === 59) {
      camera.setLerp(0.1);
    }
    if (this.deadzoneRect && camera.deadzone) {
      this.deadzoneRect.x = camera.deadzone.x + camera.deadzone.width / 2;
      this.deadzoneRect.y = camera.deadzone.y + camera.deadzone.height / 2;
      this.deadzoneRect.width = camera.deadzone.width;
      this.deadzoneRect.height = camera.deadzone.height;
      this.deadzoneRect.setDepth(2000);
      this.deadzoneRect.setOrigin(0.5);
      this.deadzoneRect.setAlpha(0);
    }

    if (this.buttons.r) {
      this.respawnCounter--;
      if (this.respawnCounter === 0) {
        this.respawnCounter = INITIAL_RESPAWN_COUNTER;
        this.buttons.r = false;
        this.socket.emit(
          "Position Request",
          randomNum(this.rowCount),
          randomNum(this.colCount)
        );
      }
    }

    this.boundingBox.setPosition(this.player.x, this.player.y);

    // this.stateText?.destroy();
    // this.stateText = this.add.text(
    //   camera.worldView.right - CELL_WIDTH * 15,
    //   camera.worldView.bottom - CELL_HEIGHT,
    //   `${this.goto?.row},${this.goto?.col}`
    // );
    // this.stateText.setDepth(200);
  }
}
