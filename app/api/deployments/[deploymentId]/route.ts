import { NextResponse } from "next/server";
import { getStoredDeployment } from "@/lib/deployment/store";
export async function GET(_: Request, { params }: { params: Promise<{ deploymentId: string }> }) { const deploymentId = (await params).deploymentId; const stored = getStoredDeployment(deploymentId); if (!stored) return NextResponse.json({ error: "Deployment was not found in this server session." }, { status: 404 }); return NextResponse.json({ deployment: stored.deployment }); }
