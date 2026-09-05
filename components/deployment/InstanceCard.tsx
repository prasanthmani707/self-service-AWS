import type { DeploymentInstance } from "@/types/deployment";
export function InstanceCard({ instance }: { instance: DeploymentInstance }) { return <div className="rounded border border-[#d8e5df] p-4"><strong>{instance.name}</strong><p className="text-sm text-[#71837c]">{instance.role} · {instance.privateIp ?? "No private IP"}</p></div>; }
