import { getRandomInt } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { Guest } from "../Guest/Guest";
import { Site } from "../Site/Site";
import { Tent } from "../Tent/Tent";

export class Group {
  scene: MainScene;
  guests = new Set<Guest>();
  campsite: Site | null = null;
  tents = new Set<Tent>();
  currentDuration: number; // How long has this group been in the park
  targetDuration: number; // How long until departure
  constructor(scene: MainScene, col: number, row: number) {
    this.scene = scene;
    const amountOfPeople = getRandomInt(1, 6);

    for (let i = 0; i < amountOfPeople; i++) {
      const guest = new Guest(this.scene, this, col, row);
      this.guests.add(guest);
    }
    this.divideOverTents();
    this.currentDuration = 0;
    this.targetDuration = getRandomInt(1, 8);
    this.scene.recreation.groups.add(this);

    if (this.scene.recreation.reception) {
      this.goto(
        this.scene.recreation.reception.x +
          this.scene.recreation.reception.width / 2,
        this.scene.recreation.reception.y +
          this.scene.recreation.reception.height / 2
      );
    }
  }

  goto(x: number, y: number) {
    for (const guest of this.guests) {
      guest.goto(x, y);
    }
  }
  divideOverTents() {
    const tents = [];
    let amount = this.guests.size;
    const maxPartValue = 4;
    const minPartValue = 1;
    while (amount > 0) {
      const partValue =
        Math.floor(Math.random() * (maxPartValue - minPartValue + 1)) +
        minPartValue;

      // Ensure the part value does not exceed the remaining number
      const actualPartValue = Math.min(partValue, amount);
      tents.push(actualPartValue);

      // Deduct the part value from the remaining number
      amount -= actualPartValue;
    }
    console.log(tents);

    const guestArray = Array.from(this.guests);
    for (const tentBuddies of tents) {
      const tentGroup = new Set<Guest>();
      for (let i = 0; i < tentBuddies; i++) {
        const guest = guestArray.shift();
        if (guest) tentGroup.add(guest);
      }
      this.tents.add(new Tent(this.scene, tentGroup));
    }
  }
  remove() {
    //TODO
  }
}
