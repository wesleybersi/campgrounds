import MainScene from "../../../MainScene";
import { CELL_SIZE, INITIAL_ZOOM } from "../../../constants";
import { Client } from "../Client";

export function keyboardEvents(this: Client) {
  const keyDown = () => {
    this.scene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (!this.scene.hasLoaded || event.repeat) return;
      switch (event.key) {
        case "Meta":
          this.keys.meta = true;
          break;
        case "Shift":
          this.keys.shift = true;
          break;
        case "s":
        case "S":
          this.scene.recreation.spawner.spawn();
          break;
        case "Backspace":
          this.scene.grid.areaMatrix.flat().forEach((area) => area?.deselect());
          this.placeMode = "";
          break;
        case "0":
          if (!this.overlay) {
            this.overlay = "area";
            for (const area of this.scene.grid.areaMatrix.flat()) {
              if (area) area.setFillStyle(0x000000, 0.1);
            }
          } else {
            this.overlay = null;
            for (const area of this.scene.grid.areaMatrix.flat()) {
              if (area) area.setFillStyle(0x000000, 0);
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
        case "PageDown":
          {
            let index = this.modes.indexOf(this.placeMode);
            if (index === 0) {
              index = this.modes.length - 1;
            } else {
              index--;
            }
            this.placeMode = this.modes[index];
          }
          break;
        case "PageUp":
          {
            let index = this.modes.indexOf(this.placeMode);
            if (index === this.modes.length - 1) {
              index = 0;
            } else {
              index++;
            }
            this.placeMode = this.modes[index];
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

        case "w":
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
      }
    });
  };

  keyDown();
  keyUp();
}
