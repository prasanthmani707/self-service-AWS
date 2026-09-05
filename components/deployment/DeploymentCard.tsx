import type { Deployment } from "@/types/deployment";
export function DeploymentCard({ deployment }: { deployment: Deployment }) { return <article className="rounded-lg border border-[#d8e5df] bg-white p-5"><h3 className="font-semibold">{deployment.environment}</h3><p className="mt-2 text-sm text-[#71837c]">{deployment.deploymentId} · {deployment.instances.length} instances</p></article>; }
