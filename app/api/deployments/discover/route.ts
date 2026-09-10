import { NextResponse } from "next/server";
import { assumePlatformRole, getAwsIdentity } from "@/lib/aws/sts";
import { createAwsClients } from "@/lib/aws/client";
import { discoverPlatformInstances, mapInstance } from "@/lib/aws/ec2";
import { requireRoleConnection } from "@/lib/auth/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      roleArn?: unknown;
      externalId?: unknown;
      region?: unknown;
      accessKeyId?: unknown;
      secretAccessKey?: unknown;
      sessionToken?: unknown;
    };
    const connection = requireRoleConnection({
      roleArn: body.roleArn,
      externalId: typeof body.externalId === "string" ? body.externalId.trim() || undefined : undefined,
      region: body.region,
      accessKeyId: body.accessKeyId,
      secretAccessKey: body.secretAccessKey,
      sessionToken: typeof body.sessionToken === "string" ? body.sessionToken.trim() || undefined : undefined,
    });
    const credentials = await assumePlatformRole(connection);
    const identity = await getAwsIdentity(connection.region, credentials);
    const { ec2 } = createAwsClients(connection.region, credentials);
    const instances = await discoverPlatformInstances(ec2);
    const requestedDeploymentId = typeof (body as { deploymentId?: unknown }).deploymentId === "string" ? (body as { deploymentId: string }).deploymentId : undefined;
    const grouped = new Map<string, ReturnType<typeof mapInstance>[]>();
    for (const instance of instances) {
      const deploymentId = instance.Tags?.find((tag) => tag.Key === "DeploymentId")?.Value;
      if (!deploymentId) continue;
      if (requestedDeploymentId && deploymentId !== requestedDeploymentId) continue;
      const group = grouped.get(deploymentId) ?? [];
      group.push(mapInstance(instance));
      grouped.set(deploymentId, group);
    }
    const deployments = [...grouped.entries()].map(([deploymentId, deploymentInstances]) => ({ deploymentId, accountId: identity.accountId, region: connection.region, environment: (deploymentInstances[0]?.role === "standalone" ? "standalone" : "cluster") as "standalone" | "cluster", stage: "infrastructure-ready" as const, instances: deploymentInstances, createdAt: new Date().toISOString() }));
    return NextResponse.json({ deployments });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to discover AWS deployments." }, { status: 400 });
  }
}