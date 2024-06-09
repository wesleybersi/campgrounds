import { ResourceType } from "../../Resource/Resource";
import { Task } from "../Task";

export function resourcesMatchRequirement(this: Task): boolean {
  const requiredResources = this.requiredResources;
  const currentResources = this.currentResources;
  if (!requiredResources || !currentResources) return false;

  for (const [resource, requiredQuantity] of Object.entries(
    requiredResources
  )) {
    if (currentResources[resource as ResourceType] !== undefined) {
      const currentQuantity = currentResources[resource as ResourceType] || 0;
      if (requiredQuantity > currentQuantity) return false;
    }
  }

  return true;
}
