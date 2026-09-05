import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ regions: ["us-east-1", "us-west-2", "eu-west-1"], note: "Resource discovery requires an authenticated role session." }); }
