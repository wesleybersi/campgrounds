import MainScene from "../MainScene";

import LoadingScene from "../../Loading/LoadingScene";

import tile from "../../../assets/images/tiles/whie_tile_32.png";
import carrot from "../../../assets/images/tiles/carrot.png";
import { CELL_SIZE } from "../constants";
import agent from "../../../assets/images/tiles/agent.png";

import tentA from "../../../assets/images/tents/tent-a.png";

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

  this.load.image("carrot", carrot);
}
