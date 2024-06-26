import MainScene from "../../MainScene.ts";

import { CELL_SIZE, INITIAL_ZOOM } from "../../constants.ts";
import { Staff } from "../../entities/Staff/Staff.ts";
import { Client } from "../../entities/Client/Client.ts";
import { Grid } from "../../entities/Grid/Grid.ts";

import { Recreation } from "../../entities/Recreation/Recreation.ts";
import { Resources } from "../../entities/Resources/Resources.ts";
import { Nature } from "../../entities/Grid/entities/Nature/Nature.ts";
import { LawnMower } from "../../entities/Staff/entities/LawnMower/LawnMower.ts";

export default function create(this: MainScene) {
  this.hasLoaded = false;

  const createEntities = () => {
    this.client = new Client(this);
    this.grid = new Grid(this, this.rowCount, this.colCount);
    this.staff = new Staff(this);
    this.resources = new Resources(this);
    this.recreation = new Recreation(this);
    this.nature = new Nature(this);

    const cell = this.grid.getRandomEmptyCell();
    new LawnMower(this, cell.col, cell.row);
  };

  const createCamera = () => {
    const camera = this.cameras.main;

    camera.setBounds(0, 0, this.width, this.height);
    camera.zoom = INITIAL_ZOOM;
    // camera.startFollow(this.player, true);

    // camera.centerOn(this.player.x, this.player.y);

    camera.setDeadzone(camera.worldView.width * 4, camera.worldView.height * 4);
    this.cameras.main.centerOn(
      this.recreation.spawner.col * CELL_SIZE,
      this.recreation.spawner.row * CELL_SIZE
    );
    // camera.setLerp(0.1);

    this.hasLoaded = true;
    this.cameras.main.fadeIn();
  };

  const createEvents = () => {
    //this.customevent()

    console.log(
      this.events.eventNames().length,
      "active events",
      this.events.eventNames()
    );
  };
  // const createHUD = () => {
  //   this.scene.launch("HUD", this);
  // };

  createEntities();
  createCamera();
  createEvents();
  // createHUD();

  this.hasLoaded = true;

  // this.cameras.main.postFX.addVignette(0.5, 0.5, 0.9);
}
