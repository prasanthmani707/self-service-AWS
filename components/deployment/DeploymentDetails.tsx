import type { Deployment } from "@/types/deployment";
export function DeploymentDetails({ deployment }: { deployment: Deployment }) { return <div><h1 className="text-2xl font-semibold">{deployment.deploymentId}</h1><p>{deployment.region} · {deployment.environment}</p></div>; }
