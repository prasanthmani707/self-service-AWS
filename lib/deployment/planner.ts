import { getEnvironmentPlan, roleName } from "@/config/data";
import type { DeploymentPlan, EnvironmentKey } from "@/types/deployment";
export function createPlan(environment: EnvironmentKey): DeploymentPlan { return getEnvironmentPlan(environment); }
export function plannedNames(environment: EnvironmentKey): string[] { return getEnvironmentPlan(environment).serverRoles.map(roleName); }
