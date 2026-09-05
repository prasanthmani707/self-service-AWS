import { NextResponse } from "next/server";
import { requireRoleConnection } from "@/lib/auth/auth";
import { assumePlatformRole, getAwsIdentity } from "@/lib/aws/sts";
export async function POST(request: Request) { try { const connection = requireRoleConnection(await request.json()); const credentials = await assumePlatformRole(connection); const identity = await getAwsIdentity(connection.region, credentials); return NextResponse.json({ accountId: identity.accountId, arn: identity.arn, region: connection.region, expiresAt: credentials.expiration }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "AWS connection failed." }, { status: 400 }); } }
