export interface AwsRoleConnection { roleArn: string; externalId?: string; region: string; }
export interface AwsIdentity { accountId: string; arn: string; userId: string; }
export interface AwsResourceContext { vpcId: string; subnetId: string; availabilityZone: string; securityGroupId: string; }
