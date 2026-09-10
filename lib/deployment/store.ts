import type { AwsRoleConnection } from "@/types/aws";
import type { Deployment } from "@/types/deployment";

type StoredDeployment = { deployment: Deployment; connection: AwsRoleConnection };
const STORAGE_KEY = "fieldline.deployments.demo";

function readDeployments(): Record<string, StoredDeployment> {
	if (typeof window === "undefined") return {};
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Record<string, StoredDeployment>) : {};
	} catch {
		return {};
	}
}

export function saveDeployment(value: StoredDeployment) {
	if (typeof window === "undefined") return;
	const deployments = readDeployments();
	deployments[value.deployment.deploymentId] = value;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deployments));
}

export function getStoredDeployment(deploymentId: string) {
	return readDeployments()[deploymentId];
}

export function listStoredDeployments() {
	return Object.values(readDeployments()).map(({ deployment }) => deployment).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}