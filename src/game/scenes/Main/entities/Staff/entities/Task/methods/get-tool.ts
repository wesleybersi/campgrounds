import { Task } from "../Task";
import { LawnMower } from "../../LawnMower/LawnMower";

export function getTool(this: Task) {
  if (!this.worker) return;
  if (this.requiredTool === "lawnmower") {
    const lawnmower = this.scene.grid.objectMatrix
      .flat()
      .find((obj) => obj instanceof LawnMower && !obj.worker);
    if (lawnmower && lawnmower instanceof LawnMower) {
      if (!lawnmower.worker) {
        const task = new Task(this.scene, lawnmower.col, lawnmower.row, {
          labor: ["forester"],
          multiplier: Infinity,
          onComplete: () => {
            if (task.worker) {
              lawnmower.worker = task.worker;
              task.worker.tool = lawnmower;
            }
          },
        });
        task.assign(this.worker);
      }
    }
  }
}
