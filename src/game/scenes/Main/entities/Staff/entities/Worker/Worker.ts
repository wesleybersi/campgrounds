import { MAX_CARRY } from "./../../../../constants";
import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";

import { Agent } from "../../../Agent/Agent";
import { Resource } from "../../../Resources/entities/Resource/Resource";

import { Task } from "../Task/Task";
import { getNewTask } from "./methods/get-task";
import { haul } from "./methods/haul";

import { LawnMower } from "../LawnMower/LawnMower";

export type WorkerType = "forester" | "builder";

export class Worker extends Agent {
  scene: MainScene;
  type: "forester" | "builder";
  taskQueue: Task[] = [];
  hat: Phaser.GameObjects.Sprite;
  haulTarget?: number;
  isHauling = false;
  carriedResource: Resource | null = null;
  tool: LawnMower | null = null;

  haul = haul;
  getNewTask = getNewTask;
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
    if (this.tool) {
      this.tool.update();
    }

    this.hat.x = this.x;
    this.hat.y = this.y;
    this.hat.setDepth(this.depth + 2);

    if (this.carriedResource) {
      this.carriedResource.setPosition(this.x, this.y);
      this.carriedResource.update();
    }

    if (
      this.haulTarget &&
      this.carriedResource &&
      this.carriedResource.amount < this.haulTarget
    ) {
      if (!this.isHauling) {
        return this.haul(this.carriedResource.type);
      }
    }

    if (this.taskQueue.length > 0) {
      //ANCHOR If assigned task
      const task = this.taskQueue[0];
      if (this.col === task.col && this.row === task.row) {
        task.advance(delta);
      } else {
        if (this.path.length === 0) {
          if (task.requiredResources) {
            if (!this.carriedResource) {
              task.getResources();
              return;
            } else {
              if (
                this.haulTarget &&
                this.carriedResource.amount < this.haulTarget
              ) {
                //ANCHOR If more resources required
                if (!this.haul(this.carriedResource.type)) {
                  //ANCHOR If no more resources found
                  this.haulTarget = this.carriedResource.amount;
                }
              }
            }
          }

          if (this.scene.grid.collisionMap[task.row][task.col] === 1) {
            //ANCHOR If target has collision, move next to target
            task.setVicinityTarget();
          }

          if (this.goto(task.col, task.row)) return; // Overrule super, so no random movement
        }
      }
    } else {
      //ANCHOR If no current task
      if (this.carriedResource) {
        if (!this.scene.resources.storageAvailable) {
          //ANCHOR Drop haul when no storage available
          this.carriedResource.drop();
          return;
        }

        if (this.carriedResource.amount < MAX_CARRY) {
          if (this.haul(this.carriedResource.type, false)) return;
          //ANCHOR Haul resource to storage
        }
        const storages = this.scene.resources.getAvailableStorages();
        if (storages.length > 0) {
          for (const storage of storages) {
            if (storage.reserve(this, this.carriedResource)) {
              break;
            }
          }
        }
      } else {
        //ANCHOR Find task
        this.getNewTask();
      }
    }

    super.update(delta);
  }
  remove() {
    this.scene.staff.workers.delete(this);
  }
}
