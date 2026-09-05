import { DescribeKeyPairsCommand, type EC2Client } from "@aws-sdk/client-ec2";
export async function keyPairExists(ec2: EC2Client, keyName: string) { const result = await ec2.send(new DescribeKeyPairsCommand({ KeyNames: [keyName] })); return Boolean(result.KeyPairs?.some((key) => key.KeyName === keyName)); }
