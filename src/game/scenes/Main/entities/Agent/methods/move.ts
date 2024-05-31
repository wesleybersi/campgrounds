import { CELL_SIZE } from "../../../constants";
import { Agent } from "../Agent";

export function move(this: Agent, delta: number) {
  let { x, y } = this.path[0];

  x = x * CELL_SIZE + CELL_SIZE / 2;
  y = y * CELL_SIZE + CELL_SIZE / 2;
  if (Math.abs(x - this.x) < 8 && Math.abs(y - this.y) < 8) {
    this.path.shift();
    if (this.path.length > 0) this.move(delta);
    // this.scene.tilemap.pathForge(col, row);
  } else {
    const directionX = x - this.x;
    const directionY = y - this.y;

    const distance = Math.sqrt(
      directionX * directionX + directionY * directionY
    );

    // Normalize the direction vector
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;

    // Calculate the movement distance for this frame
    const moveDistance = this.movementSpeed * delta;

    // Update the position
    this.x += normalizedDirectionX * moveDistance;
    this.y += normalizedDirectionY * moveDistance;

    // if (directionX > 0){

    // }

    if (Math.abs(directionY) >= Math.abs(directionX)) {
      if (directionY > 0) {
        if (this.anims.currentAnim?.key !== "moving-down") {
          this.anims.play("moving-down");
          this.setFlipX(false);
        }
      } else if (directionY < 0) {
        if (this.anims.currentAnim?.key !== "moving-up") {
          this.anims.play("moving-up");
          this.setFlipX(false);
        }
      }
    } else if (Math.abs(directionX) > Math.abs(directionY)) {
      if (directionX > 0) {
        if (this.anims.currentAnim?.key !== "moving-horz") {
          this.anims.play("moving-horz");
          this.setFlipX(true);
        }
      } else if (directionX < 0) {
        if (this.anims.currentAnim?.key !== "moving-horz") {
          this.anims.play("moving-horz");
          this.setFlipX(false);
        }
      }
    }
  }
}
