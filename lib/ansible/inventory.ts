import type { DeploymentInstance } from "@/types/deployment";
export function buildInventory(instances: DeploymentInstance[]) { return ["[all]", ...instances.filter((instance) => instance.privateIp).map((instance) => `${instance.name} ansible_host=${instance.privateIp} splunk_role=${instance.role}`), ""].join("\n"); }
