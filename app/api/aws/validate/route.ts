import { NextResponse } from "next/server";
import { assumePlatformRole, getAwsIdentity } from "@/lib/aws/sts";
import { createAwsClients } from "@/lib/aws/client";
import { validateResources } from "@/lib/deployment/validator";
import { requireRoleConnection } from "@/lib/auth/auth";

export async function POST(request: Request) {
	try {
		const body = await request.json() as { roleArn?: unknown; externalId?: unknown; region?: unknown; keyName?: unknown };
		const connection = requireRoleConnection({ roleArn: body.roleArn, externalId: typeof body.externalId === "string" ? body.externalId.trim() || undefined : undefined, region: body.region });
		if (typeof body.keyName !== "string" || !body.keyName.trim()) return NextResponse.json({ error: "Enter an EC2 key pair name to check resources." }, { status: 400 });
		const credentials = await assumePlatformRole(connection);
		const identity = await getAwsIdentity(connection.region, credentials);
		const { ec2 } = createAwsClients(connection.region, credentials);
		const resources = await validateResources(ec2, body.keyName);
		return NextResponse.json({ valid: true, accountId: identity.accountId, region: connection.region, resources, checks: ["role assumed", "account verified", "VPC found", "subnet available", "security group found", "key pair found"] });
	} catch (error) {
		return NextResponse.json({ valid: false, error: error instanceof Error ? error.message : "AWS validation failed." }, { status: 400 });
	}
}
