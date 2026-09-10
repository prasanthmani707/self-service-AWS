export interface AwsRoleConnection {
  roleArn?: string;
  externalId?: string;
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
}
export interface AwsIdentity { accountId: string; arn: string; userId: string; }
export interface AwsResourceContext { vpcId: string; subnetId: string; availabilityZone: string; securityGroupId: string; }
