import { discoverPlatformInstances, mapInstance } from "@/lib/aws/ec2";
import type { EC2Client } from "@aws-sdk/client-ec2";
export async function discoverDeployment(ec2: EC2Client, deploymentId: string) { const instances = await discoverPlatformInstances(ec2, deploymentId); return instances.map(mapInstance); }
export async function discoverDeployments(ec2: EC2Client) { const instances = await discoverPlatformInstances(ec2); return instances.reduce<Record<string, ReturnType<typeof mapInstance>[]>>((grouped, instance) => { const deploymentId = instance.Tags?.find((tag) => tag.Key === "DeploymentId")?.Value ?? "unknown"; (grouped[deploymentId] ??= []).push(mapInstance(instance)); return grouped; }, {}); }
