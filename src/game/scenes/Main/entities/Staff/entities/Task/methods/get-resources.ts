import { MAX_CARRY } from "../../../../../constants";
import { ResourceType } from "../../../../Resources/entities/Resource/Resource";
import { Task } from "../Task";

export function getResources(this: Task) {
  const requiredResources = this.requiredResources;
  const currentResources = this.currentResources;
  if (!this.worker || !currentResources || !requiredResources) return;

  for (const [resource, amount] of Object.entries(requiredResources)) {
    if (
      currentResources[resource as ResourceType] === undefined ||
      currentResources[resource as ResourceType] ===
        requiredResources[resource as ResourceType]
    )
      continue;
    const alreadyHauled = currentResources[resource as ResourceType];
    if (alreadyHauled !== undefined) {
      this.worker.haulTarget = Math.min(amount - alreadyHauled, MAX_CARRY);
      this.worker.haul(resource as ResourceType);
    }
  }
}
