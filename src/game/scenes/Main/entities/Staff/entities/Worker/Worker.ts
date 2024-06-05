import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";
import { Agent } from "../../../Agent/Agent";
import { Resource } from "../Resource/Resource";
import { Task } from "../Task/Task";

export type WorkerType = "forester" | "builder";

export class Worker extends Agent {
  scene: MainScene;
  type: "forester" | "builder";
  taskQueue: Task[] = [];
  hat: Phaser.GameObjects.Sprite;
  carriedResource: Resource | null = null;
  constructor(
    scene: MainScene,
    type: "forester" | "builder",
    col: number,
    row: number
  ) {
    super(scene, col, row);
    this.scene = scene;
    this.type = type;
    this.hat = this.scene.add
      .sprite(absolutePos(col), absolutePos(row), "helmet")
      .setOrigin(0.5, 0.6);

    switch (type) {
      case "builder":
        this.hat.setTint(0xd3bd03);
        break;
      case "forester":
        this.hat.setTint(0x3f642f);
        break;
    }
    this.scene.staff.workers.add(this);
  }

  update(delta: number) {
    this.hat.x = this.x;
    this.hat.y = this.y;
    this.hat.setDepth(this.depth + 2);

    if (this.carriedResource) {
      this.carriedResource.update(this.x, this.y);
    }

    if (this.taskQueue.length > 0) {
      //ANCHOR Work task
      const task = this.taskQueue[0];
      if (this.col === task.col && this.row === task.row) {
        task.advance(delta);
      } else {
        if (this.path.length === 0) {
          if (
            !this.carriedResource &&
            task.resourceRequired &&
            task.resourceCount < task.resourceRequired.amount
          ) {
            task.haul();
            console.log("A");
            return;
          }

          if (this.scene.grid.collisionMap[task.row][task.col] === 1) {
            task.setVicinityTarget();
          }
          if (this.goto(task.col, task.row)) return; // Overrule super, so no random movement
        }
      }
    } else {
      //ANCHOR Find task
      if (this.scene.staff.queuedTasks.length > 0) {
        const relevantTasks = this.scene.staff.queuedTasks.filter(
          (task) =>
            !task.worker &&
            !task.isCompleted &&
            task.laborType.includes(this.type)
        );

        const prioritySlice = 5;
        const prioritizedTasks = relevantTasks.slice(0, prioritySlice);

        if (prioritizedTasks.length > 0) {
          const nearestTask = prioritizedTasks.reduce((prev, curr) =>
            Math.abs(curr.row - this.row) + Math.abs(curr.col - this.col) <
            Math.abs(prev.row - this.row) + Math.abs(prev.col - this.col)
              ? curr
              : prev
          );
          nearestTask.assign(this);
        }
      }
    }

    super.update(delta);
  }
  remove() {
    this.scene.staff.workers.delete(this);
  }
}
