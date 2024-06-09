import { absolutePos } from "../../../../../utils/helper-functions";

import { Agent } from "../Agent";

export function move(this: Agent, delta: number) {
  if (!this.isActive) return;
  const { col, row } = this.path[0];
  this.isMoving = true;

  const directionCol = col - this.col;
  const directionRow = row - this.row;

  const xOffset = 0;
  const yOffset = 0;
  // if (this.path.length === 1) {
  //   xOffset = getRandomInt(-CELL_SIZE / 2, CELL_SIZE / 2);
  //   yOffset = getRandomInt(-CELL_SIZE / 2, CELL_SIZE / 2);
  // }

  let didUpdateHighlight = false;
  const tween = this.scene.tweens.add({
    targets: this,
    duration: this.movementDuration / delta,
    x: absolutePos(col) + xOffset,
    y: absolutePos(row) + yOffset,
    ease: this.path.length === 1 ? "Sine.Out" : "Linear",
    onStart: () => {
      this.scene.events.off(`${this.col},${this.row}`); // No longer listen to events on this cell

      this.anims.resume();

      // Determine primary direction (vertical or horizontal)
      if (Math.abs(directionRow) >= Math.abs(directionCol)) {
        // Primary direction is vertical
        if (directionRow > 0) {
          if (this.anims.currentAnim?.key !== "moving-down") {
            this.anims.play("moving-down");
            this.facing = "down";
          }
        } else if (directionRow < 0) {
          if (this.anims.currentAnim?.key !== "moving-up") {
            this.anims.play("moving-up");
            this.facing = "up";
          }
        }
      } else {
        // Primary direction is horizontal
        if (directionCol > 0) {
          if (this.anims.currentAnim?.key !== "moving-right") {
            this.anims.play("moving-right");
            this.facing = "right";
          }
        } else if (directionCol < 0) {
          if (this.anims.currentAnim?.key !== "moving-left") {
            this.anims.play("moving-left");
            this.facing = "left";
          }
        }
      }
    },
    onUpdate: () => {
      if (tween.progress >= 0.5 && !didUpdateHighlight) {
        this.highlightPath();
        didUpdateHighlight = true;
      }
    },
    onComplete: () => {
      this.scene.events.on(
        `${col},${row}`,
        (callback: (agent: Agent) => void) => {
          callback(this);
        }
      ); //Listen to events on this cell
      this.anims.restart();
      this.anims.pause();

      this.x = absolutePos(col) + xOffset;
      this.y = absolutePos(row) + yOffset;
      this.col = col;
      this.row = row;
      this.path.shift();
      this.isMoving = false;
    },
  });

  // const x = col * CELL_SIZE + CELL_SIZE / 2;
  // const y = row * CELL_SIZE + CELL_SIZE / 2;
  // if (Math.abs(x - this.x) < 8 && Math.abs(y - this.y) < 8) {
  //   this.path.shift();
  //   this.isMoving = false;
  //   this.col = col;
  //   this.row = row;
  //   // if (this.path.length > 0) this.move(delta);
  //   // this.scene.tilemap.pathForge(col, row);
  // } else {
  //   const distance = Math.sqrt(
  //     directionX * directionX + directionY * directionY
  //   );

  //   // Normalize the direction vector
  //   const normalizedDirectionX = directionX / distance;
  //   const normalizedDirectionY = directionY / distance;

  //   // Calculate the movement distance for this frame
  //   const moveDistance = 2000 * delta;

  //   // Update the position
  //   this.x += normalizedDirectionX * moveDistance;
  //   this.y += normalizedDirectionY * moveDistance;
}
