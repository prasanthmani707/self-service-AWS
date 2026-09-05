import { NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({ deploymentId: z.string().min(1), automatic: z.literal(true) });
export async function POST(request: Request) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Automatic configuration requires a deployment ID and explicit confirmation." }, { status: 400 }); return NextResponse.json({ deploymentId: parsed.data.deploymentId, status: "queued", message: "Ansible configuration queued." }, { status: 202 }); }
