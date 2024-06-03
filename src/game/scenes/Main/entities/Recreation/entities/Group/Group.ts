import { getRandomInt } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Notification } from "../../../Notification/Notification";
import { UnpitchTent } from "../../activities/UnpitchTent";
import { Guest } from "../Guest/Guest";
import { Site } from "../Site/Site";
import { Tent } from "../Tent/Tent";

export class Group {
  scene: MainScene;
  guests = new Set<Guest>();
  campsite: Site | null = null;
  tents = new Set<Tent>();
  currentStay: number; // How long has this group been in the park
  targetStay: number; // How long until departure
  constructor(scene: MainScene, col: number, row: number) {
    this.scene = scene;
    const groupSize = getRandomInt(1, 5);

    for (let i = 0; i < groupSize; i++) {
      const guest = new Guest(this.scene, this, col, row);
      guest.findEmptyCell(true);
      this.guests.add(guest);
    }
    this.divideOverTents();
    this.currentStay = 0;
    this.targetStay = getRandomInt(1, 15);
    //TODO targetStay will decrease when guests are unhappy and vice versa
    this.scene.recreation.groups.add(this);

    if (this.scene.recreation.reception) {
      this.goto(
        Math.floor(this.scene.recreation.reception.x / CELL_SIZE),
        Math.floor(this.scene.recreation.reception.y / CELL_SIZE)
      );
    }
  }
  payment() {
    if (this.campsite) {
      this.scene.client.inventory.money += this.campsite.pricePerDay;
      const guest = Array.from(this.guests)[0];
      new Notification(
        this.scene,
        `+ ƒ ${this.campsite.pricePerDay},-`,
        guest.x,
        guest.y
      );
    }
  }

  goto(col: number, row: number) {
    for (const guest of this.guests) {
      guest.goto(col, row);
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

    const guestArray = Array.from(this.guests);
    for (const amountInTent of tents) {
      const tentBuddies = new Set<Guest>();
      for (let i = 0; i < amountInTent; i++) {
        const guest = guestArray.shift();
        if (guest) tentBuddies.add(guest);
      }
      this.tents.add(new Tent(this.scene, tentBuddies));
    }
  }
  leave() {
    console.log(this.tents);
    console.log("We are outta here");
    if (this.campsite) {
      this.campsite.occupants = null;
    }

    for (const tent of this.tents) {
      console.log("This tent is placed at", tent.col, tent.row);
      if (tent.isPitched) {
        new UnpitchTent(
          this.scene,
          tent,
          tent.occupants,
          tent.col ?? 0,
          tent.row ?? 0
        );
      }
    }
  }
  remove() {
    //TODO
  }
}
