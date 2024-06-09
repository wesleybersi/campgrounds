import { Resource, ResourceType } from "../../Resource/Resource";
import { Task } from "../../Task/Task";
import { Worker } from "../Worker";

export function haul(this: Worker, type: ResourceType) {
  const relevantResources = this.scene.staff.resourceMatrix
    .flat()
    .filter(
      (resource) =>
        resource instanceof Resource &&
        resource.type === type &&
        !resource.carriedBy &&
        !resource.targeted
    );

  if (relevantResources.length > 0) {
    const resource = relevantResources.reduce((prev, curr) =>
      curr instanceof Resource &&
      prev instanceof Resource &&
      Math.abs(curr.row - this.row) + Math.abs(curr.col - this.col) <
        Math.abs(prev.row - this.row) + Math.abs(prev.col - this.col)
        ? curr
        : prev
    );
    if (resource) {
      const haulTask = new Task(this.scene, resource.col, resource.row, {
        labor: [this.type],
        multiplier: Infinity,
        hidePlaceholder: true,
        onStart: () => {
          this.isHauling = true;
          resource.targeted = this; // TODO Remove target when canceled or carried
        },
        onComplete: () => {
          resource.targeted = null;
          if (!this.carriedResource) {
            if (this.haulTarget) {
              if (resource.amount <= this.haulTarget) {
                //ANCHOR Take it all
                this.carriedResource = resource;
                this.carriedResource.carriedBy = this;
              } else if (resource.amount > this.haulTarget) {
                //ANCHOR Take only what's neccesary
                this.carriedResource = resource;
                this.carriedResource.carriedBy = this;

                const splitAmount = resource.amount - this.haulTarget;
                resource.amount -= splitAmount;

                new Resource(
                  this.scene,
                  resource.type,
                  splitAmount,
                  resource.col,
                  resource.row
                );
                this.carriedResource.updateAmount();
              }
            }
          } else if (this.carriedResource) {
            if (this.haulTarget) {
              while (
                this.carriedResource.amount < this.haulTarget &&
                resource.amount > 0
              ) {
                this.carriedResource.amount++;
                resource.amount--;
              }
              resource.updateAmount();
              this.carriedResource.updateAmount();

              if (this.carriedResource?.amount === this.haulTarget) {
                delete this.haulTarget;
              }
            }
          }
          this.isHauling = false;
        },
      });
      haulTask.assign(this);
      return true;
    }
  }
  return false;
}
