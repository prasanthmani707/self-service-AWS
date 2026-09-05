import { DescribeVpcsCommand, type EC2Client } from "@aws-sdk/client-ec2";
export async function findDefaultVpc(ec2: EC2Client) { const result = await ec2.send(new DescribeVpcsCommand({ Filters: [{ Name: "is-default", Values: ["true"] }] })); const vpc = result.Vpcs?.[0]; if (!vpc?.VpcId) throw new Error("No suitable VPC was found in the selected region."); return vpc.VpcId; }
