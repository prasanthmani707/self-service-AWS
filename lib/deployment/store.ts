import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { AwsRoleConnection } from "@/types/aws";
import type { Deployment } from "@/types/deployment";

type StoredDeployment = { deployment: Deployment; connection: AwsRoleConnection };
const storeDirectory = path.join(process.cwd(), ".data");
const storeFile = path.join(storeDirectory, "deployments.json");

function readDeployments(): Record<string, StoredDeployment> {
	if (!existsSync(storeFile)) return {};
	try { return JSON.parse(readFileSync(storeFile, "utf8")) as Record<string, StoredDeployment>; } catch { return {}; }
}

export function saveDeployment(value: StoredDeployment) { mkdirSync(storeDirectory, { recursive: true }); const deployments = readDeployments(); deployments[value.deployment.deploymentId] = value; writeFileSync(storeFile, JSON.stringify(deployments, null, 2), "utf8"); }
export function getStoredDeployment(deploymentId: string) { return readDeployments()[deploymentId]; }
export function listStoredDeployments() { return Object.values(readDeployments()).map(({ deployment }) => deployment).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }