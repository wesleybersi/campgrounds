import { getRandomInt, oneIn } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { Agent } from "../../../Agent/Agent";
import { EnterTent } from "../../activities/EnterTent";
import { ExitTent } from "../../activities/ExitTent";
import { Activity } from "../Activity/Activity";
import { Group } from "../Group/Group";
import { Reception } from "../Reception/Reception";
import { Tent } from "../Tent/Tent";
import { carryBag } from "./methods/carry-bag";
import { chatter } from "./methods/chatter";
import { updateNeeds } from "./methods/needs";

export class Guest extends Agent {
  scene: MainScene;
  group: Group;
  activity: Activity | null = null;
  bag?: Phaser.GameObjects.Sprite;
  tent: Tent | null = null;
  isInsideTent = false;
  isLeaving = false;

  needs: { [key: string]: number } = {
    happiness: 75, // Represents the camper's overall mood and satisfaction level.
    bladder: 0, // Indicates the camper's need to urinate, with higher values representing a stronger urge.
    hunger: 0, // Reflects the camper's level of hunger, with higher values indicating greater hunger.
    hygiene: 100, // Represents the camper's cleanliness and personal hygiene, with higher values indicating better hygiene.
    warmth: 50, // Indicates the camper's comfort level in terms of warmth, with higher values representing greater warmth.
    energy: 100, // Reflects the camper's level of fatigue and need for rest, with higher values indicating greater energy.
    socialization: 50, // Represents the camper's need for social interaction and companionship, with higher values indicating a stronger desire for socializing.
    safety: 75, // Reflects the camper's sense of security and safety, with higher values indicating a greater feeling of safety.
    exploration: 50, // Indicates the camper's desire for exploration and adventure, with higher values representing a stronger urge to explore.
  };
  updateNeeds: (delta: number) => void = updateNeeds;
  chatter: () => void = chatter;
  carryBag: () => void = carryBag;

  constructor(scene: MainScene, group: Group, col: number, row: number) {
    super(scene, col, row);
    this.scene = scene;
    this.group = group;

    this.scene.recreation.guests.add(this);
  }
  update(delta: number) {
    if (!this.isActive) return;
    if (this.isLeaving && this.path.length === 0) {
      const exit = this.scene.recreation.spawner;
      if (this.col !== exit.col && this.row !== exit.row) {
        this.goto(
          this.scene.recreation.spawner.col,
          this.scene.recreation.spawner.row
        );
      } else {
        this.remove();
      }
    }
    //TODO Receptionist
    if (!this.group.campsite) {
      if (
        this.scene.grid.areaMatrix[this.row][this.col] &&
        this.scene.grid.areaMatrix[this.row][this.col] instanceof Reception
      ) {
        this.scene.recreation.reception?.assignCampsite(this.group);
      }
    }

    if (this.bag) this.carryBag();
    this.updateNeeds(delta);
    this.chatter();

    if (this.group.campsite && oneIn(1000)) {
      this.goto(
        this.group.campsite.rect.topLeft.col +
          getRandomInt(this.group.campsite.grid[0].length),
        this.group.campsite.rect.topLeft.row +
          getRandomInt(this.group.campsite.grid.length)
      );
    }

    if (this.activity) {
      if (this.col === this.activity.col && this.row === this.activity.row) {
        this.activity.advance(delta);
      } else {
        if (this.path.length === 0) {
          this.goto(this.activity.col, this.activity.row);
          return; // Overrule super, so random movement is denied
        }
      }
    }
    super.update(delta);
  }
  enterTent() {
    if (this.tent?.isPitched) new EnterTent(this.scene, this);
  }
  exitTent() {
    if (this.tent?.isPitched) new ExitTent(this.scene, this);
  }
  leave() {
    this.isLeaving = true;
  }
  remove() {
    this.isActive = false;
    this.bag?.destroy();
    this.group.guests.delete(this);
    this.scene.recreation.guests.delete(this);
    super.remove();
  }
}
