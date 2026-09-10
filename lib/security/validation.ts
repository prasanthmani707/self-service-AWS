import { z } from "zod";
export const environmentSchema = z.enum(["standalone", "cluster"]);
export const createDeploymentSchema = z.object({
  accessKeyId: z.string().min(1).max(128),
  secretAccessKey: z.string().min(1).max(256),
  sessionToken: z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().min(1).max(512).optional()),
  roleArn: z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().regex(/^arn:aws:iam::\d{12}:role\/.+/).optional()),
  externalId: z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().min(2).max(256).optional()),
  environment: environmentSchema,
  region: z.string().regex(/^[a-z]{2}(-gov)?-[a-z]+-\d$/),
  keyName: z.string().min(1).max(255),
  imageId: z.string().min(4),
});
