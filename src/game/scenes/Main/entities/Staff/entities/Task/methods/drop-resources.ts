import { Resource } from "../../Resource/Resource";
import { Task } from "../Task";

export function dropResources(this: Task, resource: Resource) {
  const requiredResources = this.requiredResources;
  const currentResources = this.currentResources;
  if (!requiredResources || !currentResources) return;

  if (requiredResources[resource.type] === undefined) return;
  if (currentResources[resource.type] === undefined) {
    currentResources[resource.type] = 0;
  }

  let currentResource = currentResources[resource.type] || 0;
  const requiredResource = requiredResources[resource.type] || 0;

  while (resource.amount > 0 && currentResource < requiredResource) {
    resource.amount--;
    currentResource++;
  }
  currentResources[resource.type] = currentResource;
  resource.updateAmount();

  if (this.resourcesMatchRequirement()) {
    delete this.requiredResources;
  }
}
