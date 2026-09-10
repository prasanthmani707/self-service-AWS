import { GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { createAwsClients } from "./client";
import type { AwsIdentity, AwsRoleConnection } from "@/types/aws";

export async function assumePlatformRole(connection: AwsRoleConnection) {
  const sourceCredentials = connection.accessKeyId && connection.secretAccessKey
    ? {
        accessKeyId: connection.accessKeyId,
        secretAccessKey: connection.secretAccessKey,
        sessionToken: connection.sessionToken,
      }
    : undefined;

  if (!sourceCredentials) {
    throw new Error("AWS access key ID and secret key are required.");
  }

  const { sts } = createAwsClients(connection.region, sourceCredentials);
  const result = await sts.send(new GetCallerIdentityCommand({}));

  if (!result.Account || !result.Arn || !result.UserId) {
    throw new Error("Unable to verify AWS account identity.");
  }

  return {
    accessKeyId: sourceCredentials.accessKeyId,
    secretAccessKey: sourceCredentials.secretAccessKey,
    sessionToken: sourceCredentials.sessionToken,
    expiration: new Date(Date.now() + 60 * 60 * 1000),
  };
}

export async function getAwsIdentity(region: string, credentials: { accessKeyId: string; secretAccessKey: string; sessionToken?: string }): Promise<AwsIdentity> {
  const { sts } = createAwsClients(region, credentials);
  const result = await sts.send(new GetCallerIdentityCommand({}));
  if (!result.Account || !result.Arn || !result.UserId) throw new Error("Unable to verify AWS account identity.");
  return { accountId: result.Account, arn: result.Arn, userId: result.UserId };
}
