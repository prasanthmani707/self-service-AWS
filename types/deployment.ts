export type EnvironmentKey = "standalone" | "cluster";
export type DeploymentStage = "validating" | "provisioning" | "infrastructure-ready" | "configuring" | "ready" | "failed";
export type ServerRole = "standalone" | "indexer" | "search-head" | "cluster-manager" | "deployment-server";

export interface DeploymentPlan { environment: EnvironmentKey; serverCount: number; instanceType: string; volumeSizeGiB: number; serverRoles: ServerRole[]; requiredPorts: number[]; }
export interface DeploymentInstance { instanceId: string; name: string; role: ServerRole; privateIp?: string; publicIp?: string; state: string; }
export interface Deployment { deploymentId: string; accountId: string; region: string; environment: EnvironmentKey; stage: DeploymentStage; vpcId?: string; subnetId?: string; instances: DeploymentInstance[]; createdAt: string; }
