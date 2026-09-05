import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoredDeployment } from "@/lib/deployment/store";
import { DeploymentInstanceControls } from "@/components/deployment/DeploymentInstanceControls";

export const dynamic = "force-dynamic";

export default async function DeploymentDetailsPage({ params }: { params: Promise<{ deploymentId: string }> }) {
  const deploymentId = (await params).deploymentId;
  const stored = getStoredDeployment(deploymentId);
  if (!stored) notFound();
  const { deployment } = stored;
  return <main className="min-h-screen bg-[#f4f7f5] p-6 text-[#173b42] md:p-12"><div className="mx-auto max-w-6xl"><Link href="/dashboard" className="text-sm text-[#438276]">← Back to dashboard</Link><div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-[#438276]">Deployment details</p><h1 className="mt-3 font-[family-name:var(--font-space)] text-4xl font-semibold">{deployment.environment === "cluster" ? "Splunk Cluster" : "Splunk Standalone"}</h1><p className="mt-2 font-mono text-xs text-[#71837c]">{deployment.deploymentId} · AWS account {deployment.accountId} · {deployment.region}</p></div><div className="flex gap-3"><button className="rounded border border-[#cadbd4] bg-white px-4 py-3 text-sm">Configure manually</button><button className="rounded bg-[#0d766f] px-4 py-3 text-sm font-semibold text-white">Configure automatically</button></div></div><section className="mt-8 rounded-lg border border-[#d8e5df] bg-white p-5"><h2 className="font-semibold">Infrastructure status</h2><div className="mt-5 grid gap-4 md:grid-cols-4">{[["AWS account", deployment.accountId],["VPC", deployment.vpcId ?? "Not returned"],["Subnet", deployment.subnetId ?? "Not returned"],["Stage", deployment.stage]].map(([label,value]) => <div className="rounded border border-[#edf2ef] p-4" key={label}><span className="block text-xs text-[#71837c]">{label}</span><strong className="mt-2 block text-sm">{value}</strong></div>)}</div></section><section className="mt-6 rounded-lg border border-[#d8e5df] bg-white p-5"><div><h2 className="font-semibold">EC2 instances</h2><p className="mt-1 text-xs text-[#71837c]">Live AWS status and server controls for this deployment.</p></div><DeploymentInstanceControls deploymentId={deploymentId} initialInstances={deployment.instances} /></section></div></main>;
}
