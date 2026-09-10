import type { AwsRoleConnection } from "@/types/aws";
export function requireRoleConnection(input: unknown): AwsRoleConnection {
  if (!input || typeof input !== "object") throw new Error("AWS connection details are required.");
  const value = input as Record<string, unknown>;
  if (typeof value.region !== "string" || !/^[a-z]{2}(-gov)?-[a-z]+-\d$/.test(value.region)) throw new Error("Enter a valid AWS region.");
  if (typeof value.accessKeyId !== "string" || !value.accessKeyId.trim()) throw new Error("Enter your AWS access key ID.");
  if (typeof value.secretAccessKey !== "string" || !value.secretAccessKey.trim()) throw new Error("Enter your AWS secret access key.");
  return {
    roleArn: typeof value.roleArn === "string" && value.roleArn.trim() ? value.roleArn.trim() : undefined,
    region: value.region,
    externalId: typeof value.externalId === "string" ? value.externalId : undefined,
    accessKeyId: value.accessKeyId.trim(),
    secretAccessKey: value.secretAccessKey.trim(),
    sessionToken: typeof value.sessionToken === "string" && value.sessionToken.trim() ? value.sessionToken.trim() : undefined,
  };
}
