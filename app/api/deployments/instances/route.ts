import { NextResponse } from "next/server";
import { getStoredDeployment, listStoredDeployments, saveDeployment } from "@/lib/deployment/store";
import { assumePlatformRole } from "@/lib/aws/sts";
import { createAwsClients } from "@/lib/aws/client";
import { changeInstanceState, discoverInstancesByIds, discoverPlatformInstances, mapInstance } from "@/lib/aws/ec2";
import type { DeploymentInstance } from "@/types/deployment";
async function refreshDeployment(stored: ReturnType<typeof getStoredDeployment>) {
	if (!stored) return undefined;
	const credentials = await assumePlatformRole(stored.connection);
	const { ec2 } = createAwsClients(stored.connection.region, credentials);
	let liveInstances = await discoverInstancesByIds(ec2, stored.deployment.instances.map((instance) => instance.instanceId));
	if (!liveInstances.length) liveInstances = await discoverPlatformInstances(ec2, stored.deployment.deploymentId);
	const instances = liveInstances.map(mapInstance);
	const deployment = { ...stored.deployment, instances };
	saveDeployment({ ...stored, deployment });
	return deployment;
}

export async function GET(request: Request) {
	const deploymentId = new URL(request.url).searchParams.get("deploymentId");
	if (deploymentId) {
		const stored = getStoredDeployment(deploymentId);
		if (!stored) return NextResponse.json({ error: "Deployment not found." }, { status: 404 });
		try { const deployment = await refreshDeployment(stored); return NextResponse.json({ deploymentId, instances: deployment?.instances ?? [] }); }
		catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to refresh EC2 status." }, { status: 502 }); }
	}
	const refreshErrors: string[] = [];
	const deployments = await Promise.all(listStoredDeployments().map(async (deployment) => {
		try { return await refreshDeployment(getStoredDeployment(deployment.deploymentId)) ?? deployment; }
		catch (error) { refreshErrors.push(`${deployment.deploymentId}: ${error instanceof Error ? error.message : "AWS refresh failed."}`); return deployment; }
	}));
	return NextResponse.json({ deployments, refreshErrors });
}
export async function POST(request: Request) { try { const body = await request.json() as { deploymentId?: unknown; instanceId?: unknown; action?: unknown }; if (typeof body.deploymentId !== "string" || typeof body.instanceId !== "string" || !["start", "stop", "terminate"].includes(String(body.action))) return NextResponse.json({ error: "deploymentId, instanceId, and a valid action are required." }, { status: 400 }); const stored = getStoredDeployment(body.deploymentId); if (!stored) return NextResponse.json({ error: "Deployment not found." }, { status: 404 }); const credentials = await assumePlatformRole(stored.connection); const { ec2 } = createAwsClients(stored.connection.region, credentials); const instances = await discoverPlatformInstances(ec2, body.deploymentId); const target = instances.find((instance) => instance.InstanceId === body.instanceId); if (!target) return NextResponse.json({ error: "That instance is not part of this managed deployment." }, { status: 403 }); await changeInstanceState(ec2, body.action as "start" | "stop" | "terminate", body.instanceId); const updatedInstances: DeploymentInstance[] = (await discoverPlatformInstances(ec2, body.deploymentId)).map(mapInstance); const updatedDeployment = { ...stored.deployment, instances: updatedInstances }; saveDeployment({ ...stored, deployment: updatedDeployment }); return NextResponse.json({ deploymentId: body.deploymentId, instanceId: body.instanceId, action: body.action, instances: updatedInstances }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Instance action failed." }, { status: 400 }); } }
