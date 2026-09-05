import Link from "next/link";
import { DeploymentDetailsLive } from "@/components/deployment/DeploymentDetailsLive";

export default async function DeploymentDetailsPage({ params }: { params: Promise<{ deploymentId: string }> }) {
  const { deploymentId } = await params;
  return <main className="min-h-screen bg-[#f4f7f5] p-6 text-[#173b42] md:p-12"><div className="mx-auto max-w-6xl"><Link href="/dashboard" className="text-sm text-[#438276]">← Back to dashboard</Link><DeploymentDetailsLive deploymentId={deploymentId} /></div></main>;
}
