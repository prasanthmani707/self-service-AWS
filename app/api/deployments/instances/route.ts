import { NextResponse } from "next/server";
import { assumePlatformRole } from "@/lib/aws/sts";
import { createAwsClients } from "@/lib/aws/client";
import { changeInstanceState, discoverPlatformInstances, mapInstance } from "@/lib/aws/ec2";
import { requireRoleConnection } from "@/lib/auth/auth";
import type { DeploymentInstance } from "@/types/deployment";

export async function GET(request: Request) {
	const params = new URL(request.url).searchParams;
	const deploymentId = params.get("deploymentId");
	if (!deploymentId) return NextResponse.json({ error: "deploymentId is required." }, { status: 400 });
	try {
		const connection = requireRoleConnection({ region: params.get("region"), accessKeyId: params.get("accessKeyId"), secretAccessKey: params.get("secretAccessKey"), sessionToken: params.get("sessionToken") });
		const credentials = await assumePlatformRole(connection);
		const { ec2 } = createAwsClients(connection.region, credentials);
		const instances = (await discoverPlatformInstances(ec2, deploymentId)).map(mapInstance);
		return NextResponse.json({ deploymentId, instances });
	} catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to refresh EC2 status." }, { status: 502 }); }
}
export async function POST(request: Request) { try { const body = await request.json() as { deploymentId?: unknown; instanceId?: unknown; action?: unknown; region?: unknown; accessKeyId?: unknown; secretAccessKey?: unknown; sessionToken?: unknown }; if (typeof body.deploymentId !== "string" || typeof body.instanceId !== "string" || !["start", "stop", "terminate"].includes(String(body.action))) return NextResponse.json({ error: "deploymentId, instanceId, and a valid action are required." }, { status: 400 }); const connection = requireRoleConnection({ region: body.region, accessKeyId: body.accessKeyId, secretAccessKey: body.secretAccessKey, sessionToken: body.sessionToken }); const credentials = await assumePlatformRole(connection); const { ec2 } = createAwsClients(connection.region, credentials); const instances = await discoverPlatformInstances(ec2, body.deploymentId); const target = instances.find((instance) => instance.InstanceId === body.instanceId); if (!target) return NextResponse.json({ error: "That instance is not part of this managed deployment." }, { status: 403 }); await changeInstanceState(ec2, body.action as "start" | "stop" | "terminate", body.instanceId); const updatedInstances: DeploymentInstance[] = (await discoverPlatformInstances(ec2, body.deploymentId)).map(mapInstance); return NextResponse.json({ deploymentId: body.deploymentId, instanceId: body.instanceId, action: body.action, instances: updatedInstances }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Instance action failed." }, { status: 400 }); } }
