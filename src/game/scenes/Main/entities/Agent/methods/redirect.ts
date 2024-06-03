import { Agent } from "../Agent";

export function redirect(this: Agent) {
  //When client places or removes a wall for instance, we recreate a path with the same target as before
  if (this.target) {
    this.goto(this.target.col, this.target.row);
  }
}
