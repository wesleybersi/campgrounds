import MainScene from "../MainScene";

import LoadingScene from "../../Loading/LoadingScene";

import tile from "../../../assets/images/tiles/whie_tile_32.png";
import carrot from "../../../assets/images/tiles/carrot.png";
import { CELL_SIZE } from "../constants";
import agent from "../../../assets/images/tiles/agent.png";
import woodenPath from "../../../assets/summer/objects/wooden_path.png";

import chars from "../../../assets/characters/chars.png";
import helmet from "../../../assets/characters/helmet.png";

import tentA from "../../../assets/images/tents/tent-a-alt.png";

import resourceLogs from "../../../assets/resources/logs.png";

import hedge from "../../../assets/summer/walls/hedge.png";
import treeA1 from "../../../assets/summer/objects/trees/a/tree-a1.png";
import treeA2 from "../../../assets/summer/objects/trees/a/tree-a2.png";

import treeB1 from "../../../assets/summer/objects/trees/b/tree-b1.png";
import treeB2 from "../../../assets/summer/objects/trees/b/tree-b2.png";
import treeB3 from "../../../assets/summer/objects/trees/b/tree-b3.png";

import treeC1 from "../../../assets/summer/objects/trees/c/tree-c1.png";
import treeC2 from "../../../assets/summer/objects/trees/c/tree-c2.png";
import treeC3 from "../../../assets/summer/objects/trees/c/tree-c3.png";

import treeD1 from "../../../assets/summer/objects/trees/d/tree-d1.png";
import treeD2 from "../../../assets/summer/objects/trees/d/tree-d2.png";

import treeE1 from "../../../assets/summer/objects/trees/e/tree-e1.png";

import treeF1 from "../../../assets/summer/objects/trees/f/tree-f1.png";

import tiles from "../../../assets/summer/tileset/tiles-summer.png";

import bag1 from "../../../assets/images/tents/bags/bag-1.png";

import rock1 from "../../../assets/summer/objects/rocks/rock-1.png";
import rock2 from "../../../assets/summer/objects/rocks/rock-2.png";
import rock3 from "../../../assets/summer/objects/rocks/rock-3.png";
import rock4 from "../../../assets/summer/objects/rocks/rock-4.png";
import rock5 from "../../../assets/summer/objects/rocks/rock-5.png";
import rock6 from "../../../assets/summer/objects/rocks/rock-6.png";
import rock7 from "../../../assets/summer/objects/rocks/rock-7.png";

import flowerA from "../../../assets/summer/objects/flowers/a.png";
import flowerB from "../../../assets/summer/objects/flowers/b.png";
import flowerC from "../../../assets/summer/objects/flowers/c.png";
import flowerD from "../../../assets/summer/objects/flowers/d.png";
import flowerE from "../../../assets/summer/objects/flowers/e.png";
import flowerF from "../../../assets/summer/objects/flowers/f.png";

import flower1 from "../../../assets/summer/objects/flowers/flower-1.png";
import flower2 from "../../../assets/summer/objects/flowers/flower-2.png";
import flower3 from "../../../assets/summer/objects/flowers/flower-3.png";
import flower4 from "../../../assets/summer/objects/flowers/flower-4.png";
import flower5 from "../../../assets/summer/objects/flowers/flower-5.png";
import flower6 from "../../../assets/summer/objects/flowers/flower-6.png";
import flower7 from "../../../assets/summer/objects/flowers/flower-7.png";
import flower8 from "../../../assets/summer/objects/flowers/flower-8.png";
import flower9 from "../../../assets/summer/objects/flowers/flower-9.png";
import flower10 from "../../../assets/summer/objects/flowers/flower-10.png";
import flower11 from "../../../assets/summer/objects/flowers/flower-11.png";
import flower12 from "../../../assets/summer/objects/flowers/flower-12.png";
import flower13 from "../../../assets/summer/objects/flowers/flower-13.png";
import flower14 from "../../../assets/summer/objects/flowers/flower-14.png";
import flower15 from "../../../assets/summer/objects/flowers/flower-15.png";
import flower16 from "../../../assets/summer/objects/flowers/flower-16.png";
import flower17 from "../../../assets/summer/objects/flowers/flower-17.png";

export default function preload(this: MainScene) {
  this.scene.launch("Loading", this);
  console.log("Main: Preload");
  this.loadingScene = this.scene.get("Loading") as LoadingScene;

  this.loadingScene.progress("Loading tilesets");
  //Tilesets
  this.load.spritesheet("white-tile", tile, {
    frameWidth: CELL_SIZE,
    frameHeight: CELL_SIZE,
  });

  this.load.spritesheet("agent", agent, {
    frameWidth: 32,
    frameHeight: 48,
  });

  this.load.spritesheet("tent", tentA, {
    frameWidth: 32,
    frameHeight: 32,
  });

  this.load.spritesheet("tiles", tiles, {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.spritesheet("chars", chars, {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.spritesheet("wooden-path", woodenPath, {
    frameWidth: 16,
    frameHeight: 16,
  });

  this.load.image("helmet", helmet);
  this.load.image("rock-1", rock1);
  this.load.image("rock-2", rock2);
  this.load.image("rock-3", rock3);
  this.load.image("rock-4", rock4);
  this.load.image("rock-5", rock5);
  this.load.image("rock-6", rock6);
  this.load.image("rock-7", rock7);

  this.load.image("carrot", carrot);

  //Trees
  this.load.image("tree-a1", treeA1);
  this.load.image("tree-a2", treeA2);

  this.load.image("tree-b1", treeB1);
  this.load.image("tree-b2", treeB2);
  this.load.image("tree-b3", treeB3);

  this.load.image("tree-c1", treeC1);
  this.load.image("tree-c2", treeC2);
  this.load.image("tree-c3", treeC3);

  this.load.image("tree-d1", treeD1);
  this.load.image("tree-d2", treeD2);

  this.load.image("tree-e1", treeE1);

  this.load.image("tree-f1", treeF1);

  this.load.spritesheet("bag-1", bag1, {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.spritesheet("hedge", hedge, {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.spritesheet("flower-a", flowerA, {
    frameWidth: 8,
    frameHeight: 16,
  });
  this.load.spritesheet("flower-b", flowerB, {
    frameWidth: 8,
    frameHeight: 16,
  });
  this.load.spritesheet("flower-c", flowerC, {
    frameWidth: 8,
    frameHeight: 16,
  });
  this.load.spritesheet("flower-d", flowerD, {
    frameWidth: 8,
    frameHeight: 16,
  });
  this.load.spritesheet("flower-e", flowerE, {
    frameWidth: 8,
    frameHeight: 16,
  });
  this.load.spritesheet("flower-f", flowerF, {
    frameWidth: 8,
    frameHeight: 16,
  });

  this.load.image("resource-logs", resourceLogs);

  this.load.image("flower-1", flower1);
  this.load.image("flower-2", flower2);
  this.load.image("flower-3", flower3);
  this.load.image("flower-4", flower4);
  this.load.image("flower-5", flower5);
  this.load.image("flower-6", flower6);
  this.load.image("flower-7", flower7);
  this.load.image("flower-8", flower8);
  this.load.image("flower-9", flower9);
  this.load.image("flower-10", flower10);
  this.load.image("flower-11", flower11);
  this.load.image("flower-12", flower12);
  this.load.image("flower-13", flower13);
  this.load.image("flower-14", flower14);
  this.load.image("flower-15", flower15);
  this.load.image("flower-16", flower16);
  this.load.image("flower-17", flower17);
}
