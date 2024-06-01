import { getRandomInt, oneIn } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Agent } from "../../../Agent/Agent";
import { Notification } from "../../../Notification/Notification";
import { EnterTent } from "../../activities/EnterTent";
import { ExitTent } from "../../activities/ExitTent";
import { Activity } from "../Activity/Activity";
import { Group } from "../Group/Group";
import { Reception } from "../Reception/Reception";
import { Tent } from "../Tent/Tent";

export class Guest extends Agent {
  scene: MainScene;
  group: Group;
  activity: Activity | null = null;
  tent: Tent | null = null;
  isInsideTent = false;
  needs = {
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

  constructor(scene: MainScene, group: Group, col: number, row: number) {
    super(scene, col, row);
    this.scene = scene;
    this.group = group;
    // this.setTint(0x888fff);

    this.scene.recreation.guests.add(this);
  }
  update(delta: number) {
    if (!this.group.campsite) {
      const col = Math.floor(this.x / CELL_SIZE);
      const row = Math.floor(this.y / CELL_SIZE);
      if (
        this.scene.grid.areaMatrix[row][col] &&
        this.scene.grid.areaMatrix[row][col] instanceof Reception
      ) {
        this.scene.recreation.reception?.assignCampsite(this.group);
      }
    }

    this.needs.hunger += 0.05 * delta;
    this.needs.bladder += 0.03 * delta;
    this.needs.energy -= 0.03 * delta;

    this.needs.happiness = Math.max(0, Math.min(100, this.needs.happiness));
    this.needs.bladder = Math.max(0, Math.min(100, this.needs.bladder));
    this.needs.hunger = Math.max(0, Math.min(100, this.needs.hunger));
    this.needs.hygiene = Math.max(0, Math.min(100, this.needs.hygiene));
    this.needs.warmth = Math.max(0, Math.min(100, this.needs.warmth));
    this.needs.energy = Math.max(0, Math.min(100, this.needs.energy));
    this.needs.socialization = Math.max(
      0,
      Math.min(100, this.needs.socialization)
    );
    this.needs.safety = Math.max(0, Math.min(100, this.needs.safety));
    this.needs.exploration = Math.max(0, Math.min(100, this.needs.exploration));

    if (oneIn(1000)) {
      new Notification(this.scene, oneIn(2) ? "♫" : "♪", this.x, this.y);
    }

    if (this.activity) {
      //TODO Proper collision detection
      if (
        Math.abs(this.x - this.activity.x) < 24 &&
        Math.abs(this.y - this.activity.y) < 24
      ) {
        this.activity.advance(delta);
      } else {
        if (this.path.length === 0) {
          this.goto(this.activity.x, this.activity.y);
          return;
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
}
