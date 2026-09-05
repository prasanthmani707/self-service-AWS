import { EC2Client } from "@aws-sdk/client-ec2";
import { STSClient } from "@aws-sdk/client-sts";
import type { AwsCredentialIdentity } from "@aws-sdk/types";
export function createAwsClients(region: string, credentials?: AwsCredentialIdentity) { return { ec2: new EC2Client({ region, credentials }), sts: new STSClient({ region, credentials }) }; }
