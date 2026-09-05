import { keyPairExists } from "@/lib/aws/key-pair";
import { findDefaultVpc } from "@/lib/aws/vpc";
import { findAvailableSubnet } from "@/lib/aws/subnet";
import { findPlatformSecurityGroup } from "@/lib/aws/security-group";
import type { EC2Client } from "@aws-sdk/client-ec2";
export async function validateResources(ec2: EC2Client, keyName: string) { if (!(await keyPairExists(ec2, keyName))) throw new Error(`Key pair '${keyName}' was not found in the selected region.`); const vpcId = await findDefaultVpc(ec2); const subnet = await findAvailableSubnet(ec2, vpcId); const securityGroupId = await findPlatformSecurityGroup(ec2, vpcId); return { vpcId, ...subnet, securityGroupId }; }
