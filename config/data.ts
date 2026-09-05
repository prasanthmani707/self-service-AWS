import type { DeploymentPlan, EnvironmentKey, ServerRole } from "@/types/deployment";

export const PLATFORM_TAGS = { ManagedBy: "splunk-cloud-platform" } as const;
export const ENVIRONMENTS: Record<EnvironmentKey, DeploymentPlan> = {
  standalone: { environment: "standalone", serverCount: 1, instanceType: "t3.medium", volumeSizeGiB: 150, serverRoles: ["standalone"], requiredPorts: [22, 8000, 8089] },
  cluster: { environment: "cluster", serverCount: 5, instanceType: "t3.medium", volumeSizeGiB: 250, serverRoles: ["cluster-manager", "indexer", "indexer", "search-head", "deployment-server"], requiredPorts: [22, 8000, 8089, 9997] },
};
export function getEnvironmentPlan(environment: EnvironmentKey): DeploymentPlan { return ENVIRONMENTS[environment]; }
export function roleName(role: ServerRole, index: number): string { return `splunk-${role}-${String(index + 1).padStart(2, "0")}`; }
