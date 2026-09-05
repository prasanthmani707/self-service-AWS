import { randomBytes } from "node:crypto";
export function createDeploymentId(): string { return `dep-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`.toUpperCase(); }
