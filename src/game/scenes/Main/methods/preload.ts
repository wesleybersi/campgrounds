import MainScene from "../MainScene";

import LoadingScene from "../../Loading/LoadingScene";

import tile from "../../../assets/images/tiles/whie_tile_32.png";
import carrot from "../../../assets/images/tiles/carrot.png";
import { CELL_SIZE } from "../constants";
import agent from "../../../assets/images/tiles/agent.png";

import tentA from "../../../assets/images/tents/tent-a.png";

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

import rock1 from "../../../assets/summer/objects/rocks/rock-1.png";
import rock2 from "../../../assets/summer/objects/rocks/rock-2.png";
import rock3 from "../../../assets/summer/objects/rocks/rock-3.png";
import rock4 from "../../../assets/summer/objects/rocks/rock-4.png";
import rock5 from "../../../assets/summer/objects/rocks/rock-5.png";
import rock6 from "../../../assets/summer/objects/rocks/rock-6.png";
import rock7 from "../../../assets/summer/objects/rocks/rock-7.png";

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
    frameWidth: 64,
    frameHeight: 64,
  });

  this.load.spritesheet("tiles", tiles, {
    frameWidth: 16,
    frameHeight: 16,
  });

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
}
