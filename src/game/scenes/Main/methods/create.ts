import MainScene from "../MainScene.ts";
import { Player } from "../../../entities/Player/player.ts";
import BasicTilemap from "../../../entities/Tilemap/tilemap.ts";
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  INITIAL_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_FACTOR,
} from "../constants.ts";
import socket from "../../../socket.ts";
import {
  oneIn,
  randomNum,
  randomPlaceColor,
} from "../../../utils/helper-functions.ts";

import { Arrow } from "../../../entities/Projectile/Arrow.ts";
import { Tile } from "../../../entities/Tile/Tile.ts";
import { Pickup } from "../../../entities/Pickup/Pickup.ts";

import { Hole } from "../../../entities/Hole/Hole.ts";
import { Stairs } from "../../../entities/Stairs/Stairs.ts";
import { Spikes } from "../../../entities/Spikes/Spikes.ts";
import { Pot } from "../../../entities/Pot/Pot.ts";
import { Torch } from "../../../entities/Torch/Torch.ts";

export default function create(this: MainScene) {
  this.socket = socket;

  //ANCHOR Initial user settings
  // this.language = initialSettings.language;

  //ANCHOR Camera

  //ANCHOR Tilemap

  //TODO Move to server
  // const { letterDensity, wallDensity } = this.procedure;

  //Socket server join event
  //1 Receive set of Player data, including
  //DONE 2 Receive set of Wall data
  //2 Receive map of Tile data
  //4 Receive additional data. Time, scores etc...

  socket.emit("Join Game", {
    name: "Anonymous",
    // color: generateRandomColor(),
    color: randomPlaceColor(),
  });

  interface InitialData {
    id: string;
    size: {
      rows: number;
      cols: number;
    };
    players: {
      id: string;
      name: string;
      color: number;
      y: number;
      x: number;
      angle: number;
      weapon: { type: string; tier: string };
      height: number;
      width: number;
    }[];
    matrix: string[][];
    tiles: {
      id: number;
      type: "Crate" | "Metal Crate";
      x: number;
      y: number;
    }[];
    pickups: {
      row: number;
      col: number;
      type: string;
    }[];
  }

  socket.on("Clear", () => {
    this.hasLoaded = false;
  });

  socket.on("Initial Floor Data", (data: InitialData) => {
    this.hasLoaded = false;
    this.clear();
    //ANCHOR Eventually, this is going to be *floor* data
    console.table(data);
    const { id, size, players, tiles, matrix, pickups } = data;
    this.socketID = id;
    this.rowCount = size.rows;
    this.colCount = size.cols;
    const worldWidth = this.colCount * CELL_WIDTH;
    const worldHeight = this.rowCount * CELL_HEIGHT;

    //ANCHOR Create tilemap
    this.tilemap = new BasicTilemap(this, size.rows, size.cols);
    for (const player of players) {
      const newPlayer = new Player(
        this,
        player.id,
        player.name,
        player.color,
        player.weapon,
        player.y,
        player.x
      );
      this.playersByID.set(newPlayer.id, newPlayer);
      if (player.id === this.socketID) {
        this.player = newPlayer;
      }
    }

    for (const tileData of tiles) {
      const { id, type, x, y } = tileData;
      new Tile(this, type, id, x, y);
    }

    for (const pickupData of pickups) {
      const { row, col, type } = pickupData;
      new Pickup(this, row, col, type);
    }

    this.boundingBox?.destroy();
    this.boundingBox = this.add.rectangle(
      this.player.x,
      this.player.y,
      players[0].width,
      players[0].height,
      0xffeeff,
      0
    );

    //ANCHOR Create camera / deadzone
    const camera = this.cameras.main;

    camera.setBounds(0, 0, worldWidth, worldHeight);
    camera.zoom = INITIAL_ZOOM;
    camera.startFollow(this.player, true);

    camera.centerOn(this.player.x, this.player.y);

    camera.setDeadzone(
      camera.worldView.width * 0.75,
      camera.worldView.height * 0.5
    );
    // camera.setLerp(0.1);
    this.deadzoneRect?.destroy();
    this.deadzoneRect = this.add.rectangle(
      camera.deadzone?.centerX,
      camera.deadzone?.centerY,
      camera.deadzone?.width,
      camera.deadzone?.height,
      0x222222,
      1
    );
    this.deadzoneRect.setOrigin(0.5, 0.5);

    //ANCHOR Create walls
    // this.wallsByPos.clear();

    this.matrix = [...matrix];

    matrix.forEach((matrixRow, row) => {
      matrixRow.forEach((cell, col) => {
        if (cell.startsWith("stairs")) {
          new Stairs(this, cell, row, col);
        } else {
          switch (cell) {
            case "floor":
              break;
            case "wall":
              this.tilemap.placeWallTile(col, row);
              // new Wall(this, row, col, 16);
              break;
            case "hole":
              new Hole(this, row, col);
              break;
            case "spikes-on":
            case "spikes-off":
              new Spikes(this, cell.endsWith("off") ? "off" : "on", row, col);
              break;
            case "pot":
              new Pot(this, row, col);
              break;
          }
        }
      });
    });

    // this.holesByPos.clear();
    // for (const [, hole] of this.holesByPos) {
    //   this.tilemap.floor.removeTileAt(hole.col, hole.row);
    //   const upperHole = this.holesByPos.get(`${hole.row - 1},${hole.col}`);
    //   const wallAbove = this.wallsByPos.get(`${hole.row - 1},${hole.col}`);
    //   if (!upperHole || wallAbove) {
    //     hole.setFrame(0);
    //     hole.setTint(0xaaaaaa);
    //   }
    // }

    // for (const [, wall] of this.wallsByPos) {
    //   wall.autotile(this.wallsByPos);
    //   this.tilemap.floor.removeTileAt(wall.col, wall.row);
    // }

    // for (const [, wall] of this.wallsByPos) {
    //   if (wall.isSurrounded) wall.remove();
    // }

    this.tilemap.floor.forEachTile((tile) => {
      const wallAbove = this.tilemap.walls.hasTileAt(tile.x, tile.y - 1);
      const wallToLeft = this.tilemap.walls.hasTileAt(tile.x - 1, tile.y);
      if (wallAbove || wallToLeft) {
        tile.tint = 0x475967;
      }
    });

    //Torches
    let currentRowRange = 0;
    let lastY = 0;
    const newRange = () => {
      currentRowRange = Math.max(randomNum(12), 8);
    };
    newRange();
    this.tilemap.walls.forEachTile((wall) => {
      if (wall.y !== lastY) newRange();
      lastY = wall.y;
      if (wall.properties.type === "wall") {
        const bottom =
          this.matrix[wall.y + 1] &&
          this.matrix[wall.y + 1][wall.x] === "floor";

        if (bottom && wall.x % currentRowRange === 0) {
          new Torch(this, wall.y, wall.x);
        }
      }
    });

    this.hasLoaded = true;
    this.cameras.main.fadeIn();
  });

  interface GameIntervalData {
    client: {
      id: string;
      color: number;
      x: number;
      y: number;
      angle: number;
      weaponry: { type: string }[];
      weaponIndex: number;
    };
    players: {
      id: string;
      color: number;
      x: number;
      y: number;
      angle: number;
      weapon: { type: string; tier: string; isLoaded: boolean };
      wasHit?: boolean;
      isDead?: boolean;
    }[];
    tiles: {
      id: number;
      type: "Crate" | "Metal Crate";
      x: number;
      y: number;
      hp: number;
    }[];
    spikes: {
      row: number;
      col: number;
      state: "on" | "off";
    }[];
    destroyedPots: {
      row: number;
      col: number;
    }[];
    pickups: {
      row: number;
      col: number;
      type: string;
      tier: string;
      remove?: boolean;
    }[];
    projectiles: {
      id: number;
      type: "Arrow";
      state: string;
      x: number;
      y: number;
      z: number;
      angle: number;
      velocity: number;
    }[];

    tracker: {
      key: string;
      amount: number;
    }[];
  }

  const heatmap = [
    0x006ab8, 0x0095c2, 0x00bfcc, 0x00cd8a, 0x00d22e, 0x39dc07, 0xaaed15,
    0xffe71d, 0xff9d10, 0xff5203,
  ];

  socket.on("Game State Update", (gameState: GameIntervalData) => {
    if (!this.hasLoaded) return;
    const {
      players,
      tiles,
      projectiles,
      pickups,
      spikes,
      destroyedPots,
      tracker,
    } = gameState;

    for (const playerData of players) {
      const { id, color, x, y, angle, weapon, wasHit, isDead } = playerData;
      const player = this.playersByID.get(playerData.id);
      if (!player) {
        new Player(this, id, "", color, weapon, x, y);
      } else {
        player.update(x, y, angle, weapon, wasHit, isDead);
      }
    }

    for (const tileData of tiles) {
      const { id, x, y, hp } = tileData;
      const tile = this.tilesById.get(id);
      if (!tile) {
        continue;
      } else {
        tile.update(x, y, hp);
      }
    }

    for (const pickupData of pickups) {
      console.log(pickups);
      const { row, col, type, tier, remove } = pickupData;
      const pickup = this.pickupsByPos.get(`${row},${col}`);
      if (remove) {
        pickup?.remove();
      } else {
        if (!pickup) new Pickup(this, row, col, type);
        else pickup.update(type, tier);
      }
    }

    for (const projectileData of projectiles) {
      const { id, state, x, y, z, angle, type, velocity } = projectileData;
      const projectile = this.projectilesById.get(projectileData.id);
      if (!projectile) {
        if (type === "Arrow") {
          new Arrow(this, id, x, y, angle);
        }
      } else {
        projectile.update(state, x, y, z, angle, velocity);
      }
    }

    for (const spike of spikes) {
      const { row, col, state } = spike;
      const spikesInPlace = this.spikesByPos.get(`${row},${col}`);
      if (!spikesInPlace) continue;
      spikesInPlace.update(state);
    }

    for (const pot of destroyedPots) {
      const { row, col } = pot;
      const potInPlace = this.potsByPos.get(`${row},${col}`);
      if (!potInPlace) continue;
      potInPlace.remove();
    }

    // this.tilemap.highlightedCells.forEachTile((tile) =>
    //   this.tilemap.highlightedCells.removeTileAt(tile.x, tile.y)
    // );

    // for (const data of tracker) {
    //   const pos = data.key.split(",");
    //   const tile = this.tilemap.highlightedCells.putTileAt(
    //     0,
    //     Number(pos[1]),
    //     Number(pos[0])
    //   );
    //   tile.tint =
    //     heatmap[
    //       data.amount < heatmap.length ? data.amount : heatmap.length - 1
    //     ];
    //   tile.alpha = 1;
    // }
  });

  this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
    if (!this.hasLoaded || event.repeat) return;
    const { player, socket } = this;
    switch (event.key) {
      case "W":
      case "w":
      case "ArrowUp":
        socket.emit("Player Cursor", "up", true);
        break;
      case "A":
      case "a":
      case "ArrowLeft":
        socket.emit("Player Cursor", "left", true);
        break;
      case "S":
      case "s":
      case "ArrowDown":
        socket.emit("Player Cursor", "down", true);
        break;
      case "D":
      case "d":
      case "ArrowRight":
        socket.emit("Player Cursor", "right", true);
        break;
      case "R":
      case "r":
        this.buttons.r = true;
        break;
      case "Shift":
        this.buttons.shift = true;
        socket.emit("Player Shift", true);
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        socket.emit("Player Weapon Change", parseInt(event.key));
        break;
    }
  });
  this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
    if (!this.hasLoaded) return;

    switch (event.key) {
      case "W":
      case "w":
      case "ArrowUp":
        socket.emit("Player Cursor", "up", false);
        break;
      case "A":
      case "a":
      case "ArrowLeft":
        socket.emit("Player Cursor", "left", false);
        break;
      case "S":
      case "s":
      case "ArrowDown":
        socket.emit("Player Cursor", "down", false);
        break;
      case "D":
      case "d":
      case "ArrowRight":
        socket.emit("Player Cursor", "right", false);
        break;
      case "Shift":
        this.buttons.shift = false;
        socket.emit("Player Shift", false);
        break;
      case "E":
      case "e":
        if (event.repeat) return;
        socket.emit("Player Action");
        break;
      case "R":
      case "r":
        this.buttons.r = false;
        break;
      case "[":
        if (event.repeat) return;
        this.tilemap.highlightedCells.setAlpha(
          this.tilemap.highlightedCells.alpha === 0.35 ? 0 : 0.35
        );
        break;
    }
  });

  //ANCHOR Pointer events
  this.input.mouse?.disableContextMenu();
  this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    if (!this.hasLoaded) return;
    this.hover.x = pointer.worldX;
    this.hover.y = pointer.worldY;
    const row = Math.floor(pointer.worldY / CELL_HEIGHT);
    const col = Math.floor(pointer.worldX / CELL_WIDTH);

    this.hover.row = row;
    this.hover.col = col;

    const angle = Math.atan2(
      pointer.worldY - this.player.y,
      pointer.worldX - this.player.x
    );

    const angleInDegrees = angle * (180 / Math.PI);
    this.socket.emit("Player Angle", angleInDegrees);
  });

  this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (!this.hasLoaded) return;
    const row = this.hover.row;
    const col = this.hover.col;

    if (pointer.leftButtonDown()) {
      this.socket.emit("Player Pointer Down", "left");
    }
    if (pointer.rightButtonDown()) {
      this.socket.emit("Player Pointer Down", "right");
    }
  });

  this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
    if (!this.hasLoaded) return;
    if (pointer.leftButtonReleased()) {
      this.socket.emit("Player Pointer Up", "left");
    }
    if (pointer.rightButtonReleased()) {
      this.socket.emit("Player Pointer Up", "right");
    }
  });

  //ANCHOR Keyboard events
  this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
    if (!this.hasLoaded) return;
    switch (event.key) {
      case "Home":
        this.cameras.main.zoom = INITIAL_ZOOM;
        break;
      case "=":
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
        break;
    }
  });

  this.input.on(
    "wheel",
    (pointer: Phaser.Input.Pointer) => {
      return;
      if (!this.hasLoaded) return;
      const camera = this.cameras.main;
      const prevZoom = camera.zoom;

      if (pointer.deltaY < 0) {
        const zoom = camera.zoom * ZOOM_FACTOR;
        const cappedZoom = Math.min(MAX_ZOOM, zoom);
        camera.setZoom(cappedZoom);
      } else if (pointer.deltaY > 0) {
        if (
          camera.worldView.right > this.colCount * CELL_WIDTH ||
          camera.worldView.bottom > this.rowCount * CELL_HEIGHT
        ) {
          return;
        }
        const zoom = camera.zoom / ZOOM_FACTOR;
        const cappedZoom = Math.max(MIN_ZOOM, zoom);
        camera.setZoom(cappedZoom);
      }

      // Calculate the zoom ratio and the difference in camera position
      const zoomRatio = camera.zoom / prevZoom;
      const dx = (this.player.x - camera.worldView.centerX) * (1 - zoomRatio);
      const dy = (this.player.y - camera.worldView.centerY) * (1 - zoomRatio);

      // Calculate the new camera position
      let newScrollX = camera.scrollX - dx;
      let newScrollY = camera.scrollY - dy;

      // Ensure the camera does not go out of bounds
      newScrollX = Phaser.Math.Clamp(
        newScrollX,
        0,
        this.colCount * CELL_WIDTH - camera.width
      );
      newScrollY = Phaser.Math.Clamp(
        newScrollY,
        0,
        this.rowCount * CELL_HEIGHT - camera.height
      );

      // Set the new camera position
      camera.scrollX = newScrollX;
      camera.scrollY = newScrollY;
    },
    this
  );

  this.cameras.main.postFX.addVignette(0.5, 0.5, 0.75);
}
