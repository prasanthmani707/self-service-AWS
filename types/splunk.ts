import type { ServerRole } from "./deployment";
export interface SplunkHost { host: string; role: ServerRole; privateIp: string; }
export interface ConfigurationResult { deploymentId: string; status: "queued" | "running" | "ready" | "failed"; message: string; }
