import { NextResponse } from "next/server";
import { createDeploymentId } from "@/lib/deployment/deployment-id";
import { createPlan } from "@/lib/deployment/planner";
import { createDeploymentSchema } from "@/lib/security/validation";
import { assumePlatformRole, getAwsIdentity } from "@/lib/aws/sts";
import { createAwsClients } from "@/lib/aws/client";
import { validateResources } from "@/lib/deployment/validator";
import { provisionDeployment } from "@/lib/deployment/provisioner";
import { discoverDeployment } from "@/lib/deployment/instance-discovery";
import { saveDeployment } from "@/lib/deployment/store";
import type { Deployment, EnvironmentKey } from "@/types/deployment";

export async function POST(request: Request) {
	let requestedEnvironment: EnvironmentKey | undefined;
	try {
		const parsed = createDeploymentSchema.safeParse(await request.json());
		if (!parsed.success) return NextResponse.json({ error: "Invalid deployment request.", details: parsed.error.flatten() }, { status: 400 });
		const input = parsed.data;
		requestedEnvironment = input.environment;
		const connection = { roleArn: input.roleArn, externalId: input.externalId?.trim() || undefined, region: input.region };
		const credentials = await assumePlatformRole(connection);
		const identity = await getAwsIdentity(input.region, credentials);
		const { ec2 } = createAwsClients(input.region, credentials);
		const resources = await validateResources(ec2, input.keyName);
		const deploymentId = createDeploymentId();
		await provisionDeployment(ec2, { deploymentId, environment: input.environment, subnetId: resources.subnetId, securityGroupId: resources.securityGroupId, keyName: input.keyName, imageId: input.imageId });
		const deployment: Deployment = { deploymentId, accountId: identity.accountId, region: input.region, environment: input.environment, stage: "infrastructure-ready", vpcId: resources.vpcId, subnetId: resources.subnetId, instances: await discoverDeployment(ec2, deploymentId), createdAt: new Date().toISOString() };
		saveDeployment({ deployment, connection });
		return NextResponse.json({ deployment, message: "EC2 servers created. Splunk configuration has not started." }, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Deployment creation failed.";
		const errorName = typeof error === "object" && error !== null && "name" in error ? String(error.name) : "";
		if (errorName === "VcpuLimitExceeded" || message.includes("vCPU limit")) return NextResponse.json({ error: `AWS vCPU quota reached. The ${requestedEnvironment ?? "selected"} plan requires ${requestedEnvironment === "standalone" ? "1" : "the configured number of"} instance(s). Request a quota increase or release unused instances.` }, { status: 429 });
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
