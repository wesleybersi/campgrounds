import { MAX_CARRY } from "./../../../../constants";
import { absolutePos } from "../../../../../../utils/helper-functions";
import MainScene from "../../../../MainScene";

import { Agent } from "../../../Agent/Agent";
import { Resource } from "../Resource/Resource";

import { Task } from "../Task/Task";
import { getNewTask } from "./methods/get-task";
import { haul } from "./methods/haul";
import { Storage } from "../Storage/Storage";

export type WorkerType = "forester" | "builder";

export class Worker extends Agent {
  scene: MainScene;
  type: "forester" | "builder";
  taskQueue: Task[] = [];
  hat: Phaser.GameObjects.Sprite;
  haulTarget?: number;
  isHauling = false;
  carriedResource: Resource | null = null;

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
    this.hat.x = this.x;
    this.hat.y = this.y;
    this.hat.setDepth(this.depth + 2);

    if (this.carriedResource) {
      this.carriedResource.update(this.x, this.y);
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
      //ANCHOR Work task

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
                //ANCHOR If more resources needed
                if (!this.haul(this.carriedResource.type)) {
                  //ANCHOR If no more resources found
                  this.haulTarget = this.carriedResource.amount;
                }
              }
            }
          }

          if (this.scene.grid.collisionMap[task.row][task.col] === 1) {
            task.setVicinityTarget();
          }

          if (this.goto(task.col, task.row)) return; // Overrule super, so no random movement
        }
      }
    } else {
      //ANCHOR Find task
      const isTaskAssigned = this.getNewTask();

      if (
        !isTaskAssigned &&
        this.scene.staff.resourcesNotInStorage.size > 0 &&
        !this.isHauling
      ) {
        if (
          !this.carriedResource ||
          (this.carriedResource && this.carriedResource.amount < MAX_CARRY)
        ) {
          for (const resource of this.scene.staff.resourcesNotInStorage) {
            if (
              this.carriedResource &&
              this.carriedResource.type !== resource?.type
            )
              continue;
            if (!resource || resource.carriedBy || resource.targeted) continue;

            const areaInPlace = this.scene.grid.areaMap.get(
              `${resource.col},${resource.row}`
            );
            if (
              !areaInPlace ||
              (areaInPlace && areaInPlace.type !== "storage")
            ) {
              //Resource should get hauled to storage
              const haulTask = new Task(
                this.scene,
                resource.col,
                resource.row,
                {
                  labor: [this.type],
                  multiplier: Infinity,
                  hidePlaceholder: true,
                  onStart: () => {
                    this.isHauling = true;
                    resource.targeted = this; // TODO Remove target when canceled or carried
                  },
                  onComplete: () => {
                    resource.targeted = null;
                    this.isHauling = false;
                    if (!this.carriedResource) {
                      if (resource.amount <= MAX_CARRY) {
                        //ANCHOR Take it all
                        this.carriedResource = resource;
                        this.carriedResource.carriedBy = this;
                      } else if (resource.amount > MAX_CARRY) {
                        //ANCHOR Take only what's neccesary
                        this.carriedResource = resource;
                        this.carriedResource.carriedBy = this;

                        const splitAmount = resource.amount - MAX_CARRY;
                        resource.amount -= splitAmount;
                        new Resource(
                          this.scene,
                          resource.type,
                          splitAmount,
                          resource.col,
                          resource.row
                        );
                        this.carriedResource?.updateAmount();
                      }
                    } else {
                      while (
                        this.carriedResource.amount < MAX_CARRY &&
                        resource.amount > 0
                      ) {
                        this.carriedResource.amount++;
                        resource.amount--;
                      }

                      resource?.updateAmount();
                      this.carriedResource?.updateAmount();
                    }
                  },
                }
              );
              haulTask.assign(this);
              break;
            }
          }
        }

        if (this.carriedResource) {
          const areas = this.scene.grid
            .getAreas("storage")
            .filter(
              (storage) =>
                storage.module instanceof Storage && !storage.module.isFilled
            );
          //TODO Nearby storage

          if (areas.length > 0) {
            const storage = areas[0];
            if (storage.module instanceof Storage) {
              storage.module.reserveSlot(this, this.carriedResource);
            }
          }
        }
        //Haul resources to storage
      }
    }

    super.update(delta);
  }
  remove() {
    this.scene.staff.workers.delete(this);
  }
}
