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
import { randomPlaceColor } from "../../../utils/helper-functions.ts";

import { ProjectileArrow } from "../../../entities/Projectile/Arrow.ts";

import { Pickup } from "../../../entities/Pickup/Pickup.ts";

import { Hole } from "../../../entities/Hole/Hole.ts";
import { Stairs } from "../../../entities/Stairs/Stairs.ts";
import { Spikes } from "../../../entities/Spikes/Spikes.ts";
import { Pot } from "../../../entities/Pot/Pot.ts";
import { Torch } from "../../../entities/Torch/Torch.ts";

import { Chest } from "../../../entities/Chest/Chest.ts";
import { Door } from "../../../entities/Door/Door.ts";
import { Coin } from "../../../entities/Items/Coin/Coin.ts";
import ProjectilePot from "../../../entities/Projectile/Pot.ts";
import { ArrowPickup } from "../../../entities/Items/ArrowPickup/ArrowPickup.ts";
import { Direction } from "../../../types.ts";
import { WallBelow } from "../../../entities/WallBelow/WallBelow.ts";
import { Potion } from "../../../entities/Items/Potion/Potion.ts";
import { Heart } from "../../../entities/Items/Heart/Heart.ts";
import { ProjectileSpear } from "../../../entities/Projectile/Spear.ts";
import { Shooter } from "../../../entities/Shooter/Shooter.ts";
import { Sign } from "../../../entities/Sign/Sign.ts";

interface EmissionData {
  type:
    | "pot"
    | "spikes"
    | "chest"
    | "door"
    | "projectile-arrow"
    | "projectile-pot"
    | "projectile-spear"
    | "drop-coin"
    | "drop-potion-red"
    | "drop-potion-blue"
    | "drop-potion-green"
    | "drop-heart"
    | "drop-key"
    | "drop-arrow"
    | "drop-five-arrows";
  state: string;
  id: string;
  row?: number;
  col?: number;
  x?: number;
  y?: number;
  z?: number;
  angle?: number;
  hp?: number;
  velocity?: number;
  isOn?: boolean;
  isOpen?: boolean;
  isCarry?: boolean;
  hit?: boolean;
  flash?: boolean;
  remove?: boolean;
  direction: Direction;
}

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
      weapon: { type: string; tier: string } | null;
      height: number;
      width: number;
    }[];
    objectMatrix: string[][];
    spriteGridMatrix: [string, string][];
    lastEmissions: [string, EmissionData][];
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
    decoration: {
      torches: { row: number; col: number }[];
    };
  }

  socket.on("Clear", () => {
    this.hasLoaded = false;
  });

  socket.on("Initial Floor Data", (data: InitialData) => {
    this.hasLoaded = false;
    this.clear();

    const {
      id,
      size,
      players,
      tiles,
      objectMatrix,
      spriteGridMatrix,
      lastEmissions: spriteIDMatrix,
      pickups,
    } = data;
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

    for (const pickupData of pickups) {
      const { row, col, type } = pickupData;
      new Pickup(this, row, col, type);
    }
    // for (const torch of decoration.torches) {
    //   new Torch(this, torch.row, torch.col);
    // }

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

    camera.setDeadzone(camera.worldView.width * 4, camera.worldView.height * 4);
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

    this.objectMatrix = [...objectMatrix];
    this.spriteGridMatrix = [...spriteGridMatrix];

    spriteGridMatrix.forEach(([pos, sprite]) => {
      const position = pos.split(",");
      const row = Number(position[0]);
      const col = Number(position[1]);

      switch (sprite) {
        case "horz-door-open-up":
        case "horz-door-open-down":
        case "horz-door-closed":
        case "horz-door-locked":
          {
            const door = new Door(this, "horizontal", row, col, false);
            if (sprite.includes("open")) {
              if (sprite.endsWith("left")) door.open("left");
              else if (sprite.endsWith("right")) door.open("right");
              else if (sprite.endsWith("up")) door.open("up");
              else if (sprite.endsWith("down")) door.open("down");
            }
          }
          break;
        case "vert-door-open-left":
        case "vert-door-open-right":
        case "vert-door-closed":
        case "vert-door-locked":
          {
            const door = new Door(this, "vertical", row, col, false);
            if (sprite.includes("open")) {
              if (sprite.endsWith("left")) door.open("left");
              else if (sprite.endsWith("right")) door.open("right");
              else if (sprite.endsWith("up")) door.open("up");
              else if (sprite.endsWith("down")) door.open("down");
            }
          }
          break;
        case "chest-silver-open":
        case "chest-silver-closed":
        case "chest-gold-open":
        case "chest-gold-closed":
          new Chest(
            this,
            sprite.includes("silver") ? "silver" : "gold",
            sprite.includes("open") ? "open" : "closed",
            row,
            col
          );
          break;
        case "stairs-up":
        case "stairs-down":
          new Stairs(this, sprite, row, col);
          break;
        case "shooter-up":
        case "shooter-down":
        case "shooter-left":
        case "shooter-right":
          new Shooter(this, sprite.slice(8) as Direction, row, col);
          break;
        case "sign-rectangle":
          new Sign(this, row, col);
          break;
      }
    });

    for (const [id, emission] of spriteIDMatrix) {
      const { x, y } = emission;
      switch (emission.type) {
        case "pot":
          if (x === undefined || y === undefined) break;
          new Pot(this, id, x, y);
          break;
        case "drop-potion-red":
        case "drop-potion-blue":
        case "drop-potion-green":
          new Potion(this, id, emission.type.slice(7), x ?? 0, y ?? 0);
          break;
        case "drop-heart":
          new Heart(this, id, x ?? 0, y ?? 0);
          break;
        case "drop-arrow":
          new ArrowPickup(this, id, x ?? 0, y ?? 0);
          break;
        case "drop-five-arrows":
          new ArrowPickup(this, id, x ?? 0, y ?? 0).setTint(0xff0000);
          break;
        case "drop-coin":
          new Coin(this, id, x ?? 0, y ?? 0);
          break;
        case "projectile-arrow":
        case "projectile-pot":
        case "projectile-spear": {
          const { id, state, x, y, z, angle, type, velocity, remove } =
            emission;
          if (!this.events.eventNames().includes(id)) {
            if (type === "projectile-arrow") {
              new ProjectileArrow(this, id, x ?? 0, y ?? 0, angle ?? 0);
            } else if (type === "projectile-pot") {
              new ProjectilePot(this, id, x ?? 0, y ?? 0, z ?? 0, angle ?? 0);
            } else if (type === "projectile-spear") {
              new ProjectileSpear(this, id, x ?? 0, y ?? 0, angle ?? 0);
            }
          }
        }
      }
    }

    objectMatrix.forEach((matrixRow, row) => {
      matrixRow.forEach((cell, col) => {
        switch (cell) {
          case "floor-0":
          case "floor-1":
          case "floor-2":
          case "floor-3":
          case "floor-4":
          case "floor-5":
          case "floor-6":
          case "floor-7":
          case "floor-8":
          case "floor-9":
          case "floor-10":
          case "floor-11":
          case "floor-12":
          case "floor-13":
          case "floor-14":
          case "floor-15":
          case "floor-16":
          case "floor-17":
          case "floor-18":
          case "floor-19":
            this.tilemap.placeEmptyFloorTile(col, row, Number(cell.slice(6)));
            break;
          case "wall":
            // new Wall(this, row, col);
            this.tilemap.placeWallTile(col, row);
            break;
          case "wall-torch":
            // new Wall(this, row, col);
            this.tilemap.placeWallTile(col, row);
            new Torch(this, row, col);
            break;
          case "wall-cracks":
            // new Wall(this, row, col);
            this.tilemap.placeWallTile(col, row, true);
            break;
          case "surrounded-wall":
            this.tilemap.floor.removeTileAt(col, row);
            break;

          case "hole":
            new Hole(this, row, col);
            break;
          case "spikes-on":
          case "spikes-off":
            new Spikes(this, cell.endsWith("off") ? "off" : "on", row, col);
            break;
        }
      });
    });

    this.objectMatrix.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell.includes("wall")) {
          if (
            this.objectMatrix[y + 1] &&
            !this.objectMatrix[y + 1][x].includes("wall")
          ) {
            new WallBelow(this, y, x);
          }
        }
      })
    );

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
    //   // this.tilemap.floor.removeTileAt(wall.col, wall.row);
    // }

    //TODO Move to server
    // this.tilemap.walls.forEachTile((tile) => {
    //   if (tile.index === -1) {
    //     this.tilemap.walls.removeTileAt(tile.x, tile.y);

    //     this.matrix[tile.y][tile.x] = "surrounded";
    //   }
    // });
    // this.tilemap.walls.forEachTile((tile) => {
    //   tile.index = autoTile(tile, this.matrix);
    // });

    this.tilemap.floor.forEachTile((tile) => {
      const wallInPlace = this.tilemap.walls.hasTileAt(tile.x, tile.y);
      const wallAbove = this.tilemap.walls.hasTileAt(tile.x, tile.y - 1);
      const wallToLeft = this.tilemap.walls.hasTileAt(tile.x - 1, tile.y);
      if (!wallInPlace && (wallAbove || wallToLeft)) {
        tile.tint = 0x34393d;
      }
    });

    this.hasLoaded = true;
    this.cameras.main.fadeIn();
    console.log(
      this.events.eventNames().length,
      "active events",
      this.events.eventNames()
    );
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
      state: "moving" | "falling" | "swimming";
      angle: number;
      weapon: {
        type: string;
        tier: string;
        isLoaded: boolean;
        isAttack?: boolean;
        position?: string;
      };
      wasHit?: boolean;
      isDead?: boolean;
    }[];
    updaters: EmissionData[];
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
      type: "Arrow" | "ThrownPot";
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
    // if (gameState.updaters.length > 0) console.log(gameState.updaters);

    if (!this.hasLoaded) return;
    const { players, updaters, pickups, tracker } = gameState;

    for (const playerData of players) {
      const { id, color, state, x, y, angle, weapon, wasHit, isDead } =
        playerData;

      const player = this.playersByID.get(playerData.id);
      if (!player) {
        new Player(this, id, "", color, weapon, x, y);
      } else {
        player.update(x, y, state, angle, weapon, wasHit, isDead);
      }
    }

    for (const updater of updaters) {
      switch (updater.type) {
        case "projectile-arrow":
        case "projectile-pot":
        case "projectile-spear":
          {
            const { id, state, x, y, z, angle, type, velocity, remove } =
              updater;
            if (!this.events.eventNames().includes(id)) {
              if (type === "projectile-arrow") {
                new ProjectileArrow(this, id, x ?? 0, y ?? 0, angle ?? 0);
              } else if (type === "projectile-pot") {
                new ProjectilePot(this, id, x ?? 0, y ?? 0, z ?? 0, angle ?? 0);
              } else if (type === "projectile-spear") {
                new ProjectileSpear(this, id, x ?? 0, y ?? 0, angle ?? 0);
              }
            } else {
              if (remove) {
                this.events.emit(id, "remove");
              } else {
                this.events.emit(id, "update", state, x, y, z, angle, velocity);
              }
            }
          }
          break;
        case "spikes":
          {
            const { row, col, isOn } = updater;

            this.events.emit(
              `spikes-${row}-${col}`,
              isOn ? "turn-on" : "turn-off"
            );
          }
          break;
        case "drop-coin":
        case "drop-heart":
        case "drop-potion-red":
        case "drop-potion-blue":
        case "drop-potion-green":
        case "drop-arrow":
        case "drop-five-arrows":
          {
            const type = updater.type.slice(5);
            const { id, x, y, flash, remove } = updater;
            if (typeof id === "number") break;

            if (flash) {
              this.events.emit(id, "flash");
            } else if (remove) {
              this.events.emit(id, "get");
            } else {
              if (x === undefined || y === undefined) break;
              if (type === "coin") new Coin(this, id, x, y);
              else if (type === "heart") new Heart(this, id, x, y);
              else if (type === "potion-red") new Potion(this, id, "red", x, y);
              else if (type === "potion-blue")
                new Potion(this, id, "blue", x, y);
              else if (type === "potion-green")
                new Potion(this, id, "green", x, y);
              else if (type === "arrow") {
                new ArrowPickup(this, id, x, y);
              } else if (type === "five-arrows") {
                new ArrowPickup(this, id, x, y).setTint(0xff0000);
              }
            }
          }
          break;

        case "pot":
          {
            const { id, x, y, remove, hit } = updater;
            if (remove) {
              this.events.emit(id, "remove");
            } else if (hit) {
              this.events.emit(id, "hit");
            } else {
              this.events.emit(id, "update", x, y);
            }
          }
          break;
        case "door":
          {
            const { row, col, isOpen, direction } = updater;
            if (isOpen)
              this.events.emit(`door-${row}-${col}`, "open", direction);
            else {
              this.events.emit(`door-${row}-${col}`, "close");
            }
          }
          break;
        case "chest":
          {
            const { row, col, isOpen } = updater;
            this.events.emit(`chest-${row}-${col}`, isOpen ? "open" : "close");
          }
          break;
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

    if (this.frameCounter % 4 == 0) {
      this.tilemap.highlightedCells.forEachTile((tile) =>
        this.tilemap.highlightedCells.removeTileAt(tile.x, tile.y)
      );

      for (const data of tracker) {
        const pos = data.key.split(",");
        const tile = this.tilemap.highlightedCells.putTileAt(
          0,
          Number(pos[1]),
          Number(pos[0])
        );
        tile.tint =
          heatmap[
            data.amount < heatmap.length ? data.amount : heatmap.length - 1
          ];
        tile.alpha = 1;
      }
    }
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
        socket.emit("Player Reload");
        break;
      case "I":
      case "i":
        socket.emit("Player Inventory");
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
      case "End":
        this.enableZoom = !this.enableZoom;
        break;
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
      if (!this.hasLoaded || !this.enableZoom) return;
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

  this.cameras.main.postFX.addVignette(0.5, 0.5, 0.9);
}
