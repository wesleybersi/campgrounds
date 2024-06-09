import MainScene from "../../../MainScene";
import { CELL_SIZE, INITIAL_ZOOM } from "../../../constants";
import { Tree } from "../../Grid/entities/Tree/Tree";
import { Client } from "../Client";

export function keyboardEvents(this: Client) {
  const keyDown = () => {
    this.scene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (!this.scene.hasLoaded || event.repeat) return;

      this.scene.cameras.main.stopFollow();

      switch (event.key) {
        case "h":
          this.hideTrees = !this.hideTrees;
          if (this.hideTrees) {
            this.scene.events.emit("hide trees");
          } else {
            this.scene.events.emit("show trees");
          }
          break;
        case "Meta":
          this.keys.meta = true;
          break;
        case "Shift":
          this.keys.shift = true;
          break;
        case "ArrowUp":
        case "W":
        case "w":
          this.keys.up = true;
          break;
        case "ArrowLeft":
        case "A":
        case "a":
          this.keys.left = true;
          break;
        case "ArrowDown":
        case "S":
        case "s":
          this.keys.down = true;
          break;
        case "ArrowRight":
        case "D":
        case "d":
          this.keys.right = true;
          break;

        case "[":
          this.scene.recreation.spawner.spawn();
          break;
        case "0":
          if (!this.overlay.areas) {
            this.overlay.areas = true;
            for (const area of this.scene.grid.getAreas("*")) {
              area.show();
            }
          } else {
            this.overlay.areas = false;
            for (const area of this.scene.grid.getAreas("*")) {
              area.hide();
            }
          }
          break;
        case "1":
          this.scene.setSpeed(1);
          break;
        case "2":
          this.scene.setSpeed(2);
          break;
        case "3":
          this.scene.setSpeed(3);
          break;
        case " ":
          this.scene.setSpeed(0);
          break;
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          //Editor
          {
            const number = Number(event.key);
            if (this.keys.numeric === number) {
              this.keys.numeric = null;
            } else {
              this.keys.numeric = number;
              console.log(this.keys.numeric);
            }
          }
          break;

        case "Home":
          this.scene.cameras.main.zoom = INITIAL_ZOOM;
          this.scene.cameras.main.centerOn(
            this.scene.recreation.spawner.col * CELL_SIZE,
            this.scene.recreation.spawner.row * CELL_SIZE
          );
          break;

        case "=":
          if (this.scene.scale.isFullscreen) {
            this.scene.scale.stopFullscreen();
          } else {
            this.scene.scale.startFullscreen();
          }
          break;
      }
    });
  };

  const keyUp = () => {
    this.scene.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
      if (!this.scene.hasLoaded) return;

      switch (event.key) {
        case "Meta":
          this.keys.meta = false;
          break;
        case "Shift":
          this.keys.shift = false;
          break;

        case "[":
          break;

        case "W":
        case "w":
        case "ArrowUp":
          this.keys.up = false;
          break;
        case "A":
        case "a":
        case "ArrowLeft":
          this.keys.left = false;
          break;
        case "ArrowDown":
        case "S":
        case "s":
          this.keys.down = false;
          break;
        case "ArrowRight":
        case "D":
        case "d":
          this.keys.right = false;
          break;
      }
    });
  };

  keyDown();
  keyUp();
}
