import {
  generateRandomColor,
  getRandomInt,
} from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { CELL_SIZE } from "../../../../constants";
import { Guest } from "../Guest/Guest";
import { Site } from "../Site/Site";

export class Tent {
  scene: MainScene;
  site: Site | null = null;
  pitchProgress = 0; // Out of 1
  isPitched = false;
  sprite?: Phaser.GameObjects.Sprite;
  occupants = new Set<Guest>();
  size: [number, number] = [0, 0];
  color: number;
  row?: number;
  col?: number;

  constructor(scene: MainScene, occupants: Set<Guest>) {
    this.scene = scene;
    this.occupants = occupants;
    for (const guest of occupants) {
      guest.tent = this;
    }
    this.color = generateRandomColor();
    this.size = this.getTentSize(occupants.size);

    console.log("new tent created", this.color, this.size);

    // for (let y = 0; y < rows; y++) {
    //   for (let x = 0; x < cols; x++) {
    //     site.grid[y][x].object = this;
    //   }
    // }

    // this.setOrigin(0, 0);
    // this.scene.add.existing(this);
  }
  pitch(progress: number) {
    this.pitchProgress = progress;
  }
  enter(occupant: Guest) {
    occupant.setAlpha(0);
    occupant.isInsideTent = true;
  }
  exit(occupant: Guest) {
    occupant.setAlpha(1);
    occupant.isInsideTent = false;
  }
  place(col: number, row: number) {
    this.sprite = this.scene.add.sprite(
      col * CELL_SIZE,
      row * CELL_SIZE,
      "tent",
      getRandomInt(6)
      // CELL_SIZE * this.size[0],
      // CELL_SIZE * this.size[1],
    );
    this.col = col;
    this.row = row;
    this.sprite.setOrigin(0, 0);
    this.sprite.setTint(this.color);
    this.isPitched = true;
  }
  getTentSize(persons: number): [number, number] {
    switch (persons) {
      case 1: {
        const types: [number, number][] = [[2, 2]];
        return types[getRandomInt(types.length)];
      }
      case 2: {
        const types: [number, number][] = [
          [3, 3],
          [4, 2],
          [2, 4],
        ];
        return types[getRandomInt(types.length)];
      }

      case 3: {
        const types: [number, number][] = [
          [4, 4],
          [3, 5],
          [5, 3],
        ];
        return types[getRandomInt(types.length)];
      }

      case 4: {
        const types: [number, number][] = [
          [5, 5],
          [4, 5],
          [5, 4],
          [6, 3],
          [3, 6],
        ];
        return types[getRandomInt(types.length)];
      }
    }
    return [0, 0];
  }
}
