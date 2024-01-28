import MainScene from "../MainScene";

import floorTilesGrey from "../../../assets/images/rogue/floor-a.png";
import wallTilesGrey from "../../../assets/images/rogue/walls-lo.png";
import crate from "../../../assets/images/rogue/crate.png";
import spears from "../../../assets/images/rogue/spears.png";
import spear from "../../../assets/images/rogue/spear.png";
import sword from "../../../assets/images/rogue/sword.png";
import wallBelow from "../../../assets/images/rogue/wall-below.png";
import arrowTrap from "../../../assets/images/rogue/arrow-trap.png";
import wallTilesNoBottomGrey from "../../../assets/images/rogue/walls-a-nobottom.png.png";

import circle from "../../../assets/images/tilesets/circle.png";
import spikes from "../../../assets/images/rogue/floor-spikes.png";
import signs from "../../../assets/images/rogue/signs.png";
import arrow from "../../../assets/images/rogue/items/arrow.png";
import bow from "../../../assets/images/tilesets/bow.png";
import light64 from "../../../assets/images/rogue/light-64.png.png";
import doorHorz from "../../../assets/images/rogue/door-horz.png";
import doorVert from "../../../assets/images/rogue/door-vert.png";
import doorLocked from "../../../assets/images/rogue/door-locked.png";
import particle from "../../../assets/images/tilesets/particle.png";
import crossbow from "../../../assets/images/tilesets/weapons/crossbow.png";

import torch from "../../../assets/images/rogue/torch.png";
import holes from "../../../assets/images/tilesets/holes.png";
import staircaseUp from "../../../assets/images/rogue/staircase-up.png";
import staircaseDown from "../../../assets/images/rogue/staircase-down.png";
import pots from "../../../assets/images/rogue/pot.png";
import heart from "../../../assets/images/rogue/items/heart.png";
import chest from "../../../assets/images/rogue/chest.png";
import coin from "../../../assets/images/rogue/coin.png";
import potionRed from "../../../assets/images/rogue/items/potion-red.png";
import potionBlue from "../../../assets/images/rogue/items/potion-blue.png";
import potionGreen from "../../../assets/images/rogue/items/potion-green.png";

import player from "../../../assets/images/rogue/player.png";

import wallBelow32 from "../../../assets/images/tilesets/wall_below_32.png";
import wallBelow48 from "../../../assets/images/tilesets/wall_below_48.png";
import wallBelow64 from "../../../assets/images/tilesets/wall_below_64.png";
import wallBelow96 from "../../../assets/images/tilesets/wall_below_96.png";
import wallBelow128 from "../../../assets/images/tilesets/wall_below_128.png";

import spritesheetCrates from "../../../assets/images/spritesheets/crates-30.png";
import spritesheetBlocks from "../../../assets/images/tilesets/blocks-128.png";
// import spritesheetBlocks from "../../../assets/images/tilesets/blocks-144.png";
import spritesheetLetters from "../../../assets/images/tilesets/alphabet.png";
import crates from "../../../assets/images/tilesets/crate.png";
import spritesheetWalls from "../../../assets/images/spritesheets/walls.png";

import spritesheetPillars from "../../../assets/images/spritesheets/pillars.png";

import spritesheetWater from "../../../assets/images/spritesheets/water.png";

import spritesheetAlhabetInverted from "../../../assets/images/tilesets/alphabet-inverted.png";

import imageRampHorizontal from "../../../assets/images/spritesheets/ramp-h.png";
import imageRampVertical from "../../../assets/images/spritesheets/ramp-v.png";

import spritesheetExplosion from "../../../assets/images/spritesheets/explosion.png";
import spritesheetCracks from "../../../assets/images/spritesheets/wallcrack.png";
import spritesheetOil from "../../../assets/images/spritesheets/oil.png";

import spritesheetLadder from "../../../assets/images/spritesheets/ladder.png";

import imageCornerpiece from "../../../assets/images/cornerpiece.png";
import imageEntrance from "../../../assets/images/entrance.png";
import imageTint from "../../../assets/images/tilesets/tint_128.png";

import sfxCreateOn from "../../../assets/audio/create-on.wav";
import sfxCreateOff from "../../../assets/audio/create-off.wav";

import LoadingScene from "../../Loading/LoadingScene";

import shadow6 from "../../../assets/images/shadow-6.png";
import shadow24 from "../../../assets/images/tilesets/shadow-24.png";

import { CELL_HEIGHT, CELL_WIDTH } from "../constants";
import { CELL_SIZE } from "../../../../../../../socket-shooter 2/server/src/constants";

export default function preload(this: MainScene) {
  this.scene.launch("Loading", this);
  console.log("Main: Preload");
  this.loadingScene = this.scene.get("Loading") as LoadingScene;

  this.loadingScene.progress("Loading tilesets");
  //Tilesets
  this.load.spritesheet("floor", floorTilesGrey, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("signs", signs, {
    frameWidth: 16,
    frameHeight: 16,
  });

  this.load.spritesheet("sword", sword, {
    frameWidth: 32,
    frameHeight: 32,
  });

  this.load.spritesheet("walls", wallTilesGrey, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("walls-no-bottom", wallTilesNoBottomGrey, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("spears", spears, {
    frameWidth: 8,
    frameHeight: 96,
  });

  this.load.spritesheet("spear", spear, {
    frameWidth: 128,
    frameHeight: 128,
  });

  this.load.spritesheet("wall-below", wallBelow, {
    frameWidth: 16,
    frameHeight: 8,
  });

  this.load.spritesheet("arrow-trap", arrowTrap, {
    frameWidth: 16,
    frameHeight: 16,
  });

  this.load.spritesheet("torch", torch, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("chest", chest, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT * 2,
  });
  this.load.spritesheet("pots", pots, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("holes", holes, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });

  this.load.spritesheet("spikes", spikes, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("light-64", light64, {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("coin", coin, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });

  this.load.spritesheet("crossbow", crossbow, {
    frameWidth: 265,
    frameHeight: 265,
  });

  this.load.image("crate", crate);
  this.load.image("door-horz", doorHorz);
  this.load.image("door-vert", doorVert);
  this.load.image("door-locked", doorLocked);

  this.load.image("arrow", arrow);
  this.load.image("heart", heart);
  this.load.image("potion-red", potionRed);
  this.load.image("potion-blue", potionBlue);
  this.load.image("potion-green", potionGreen);

  this.loadingScene.progress("Loading spritesheets");
  this.load.image("cornerpiece", imageCornerpiece);
  this.load.image("entrance", imageEntrance);

  this.load.image("bow", bow);
  this.load.image("shadow-6", shadow6);
  this.load.image("shadow-24", shadow24);
  this.load.image("tint", imageTint);
  this.load.image("smoke", particle);

  this.load.image("staircase-up", staircaseUp);
  this.load.image("staircase-down", staircaseDown);

  //Spritsheets
  this.load.spritesheet("player", player, {
    frameWidth: 48,
    frameHeight: 48,
  });
  this.load.spritesheet("alphabet", spritesheetLetters, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("alphabet-inverted", spritesheetAlhabetInverted, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });

  this.load.spritesheet("blocks", spritesheetBlocks, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("pillars", spritesheetPillars, {
    frameWidth: 32,
    frameHeight: 40,
  });
  this.load.spritesheet("ladder", spritesheetLadder, {
    frameWidth: 32,
    frameHeight: 16,
  });

  this.load.spritesheet("ramp-horizontal", imageRampHorizontal, {
    frameWidth: 64,
    frameHeight: 40,
  });
  this.load.spritesheet("ramp-vertical", imageRampVertical, {
    frameWidth: 32,
    frameHeight: 64,
  });

  this.load.spritesheet("walls", spritesheetBlocks, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });

  this.load.spritesheet("wall-below-32", wallBelow32, {
    frameWidth: CELL_WIDTH,
    frameHeight: 32,
  });
  this.load.spritesheet("wall-below-48", wallBelow48, {
    frameWidth: CELL_WIDTH,
    frameHeight: 48,
  });
  this.load.spritesheet("wall-below-64", wallBelow64, {
    frameWidth: CELL_WIDTH,
    frameHeight: 64,
  });
  this.load.spritesheet("wall-below-96", wallBelow96, {
    frameWidth: CELL_WIDTH,
    frameHeight: 96,
  });
  this.load.spritesheet("wall-below-128", wallBelow128, {
    frameWidth: CELL_WIDTH,
    frameHeight: 128,
  });

  this.load.spritesheet("water", spritesheetWater, {
    frameWidth: 32,
    frameHeight: 24,
  });

  // this.load.spritesheet("player", circle, {
  //   frameWidth: CELL_WIDTH,
  //   frameHeight: CELL_HEIGHT,
  // });
  this.load.spritesheet("circle", circle, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });

  this.load.spritesheet("explosion", spritesheetExplosion, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("cracks", spritesheetCracks, {
    frameWidth: CELL_WIDTH,
    frameHeight: CELL_HEIGHT,
  });
  this.load.spritesheet("oil", spritesheetOil, {
    frameWidth: CELL_HEIGHT,
    frameHeight: CELL_HEIGHT,
  });

  this.loadingScene.progress("Loading audio assets");
  this.load.audio("create-on", sfxCreateOn);
  this.load.audio("create-off", sfxCreateOff);
}
