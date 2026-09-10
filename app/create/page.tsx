"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type CheckState = { kind: "idle" | "checking" | "success" | "error"; message: string; accountId?: string };

export default function CreatePage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [check, setCheck] = useState<CheckState>({ kind: "idle", message: "AWS has not been checked yet." });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const roleArn = localStorage.getItem("fieldline.roleArn");
    const externalId = localStorage.getItem("fieldline.externalId");
    const region = localStorage.getItem("fieldline.region");
    const keyName = localStorage.getItem("fieldline.keyName");
    if (roleArn) (document.querySelector('[name="roleArn"]') as HTMLInputElement).value = roleArn;
    if (externalId) (document.querySelector('[name="externalId"]') as HTMLInputElement).value = externalId;
    if (region) (document.querySelector('[name="region"]') as HTMLSelectElement).value = region;
    if (keyName) (document.querySelector('[name="keyName"]') as HTMLInputElement).value = keyName;
    setSaved(Boolean(roleArn));
  }, []);

  function valuesFromForm(form: HTMLFormElement) {
    const values = Object.fromEntries(new FormData(form));
    if (!String(values.externalId ?? "").trim()) delete values.externalId;
    if (!String(values.sessionToken ?? "").trim()) delete values.sessionToken;
    return values;
  }

  function rememberConnection(values: Record<string, FormDataEntryValue>) {
    localStorage.setItem("fieldline.roleArn", String(values.roleArn));
    localStorage.setItem("fieldline.externalId", String(values.externalId ?? ""));
    localStorage.setItem("fieldline.region", String(values.region));
    localStorage.setItem("fieldline.keyName", String(values.keyName));
    localStorage.setItem("fieldline.accessKeyId", String(values.accessKeyId ?? ""));
    localStorage.setItem("fieldline.secretAccessKey", String(values.secretAccessKey ?? ""));
    localStorage.setItem("fieldline.sessionToken", String(values.sessionToken ?? ""));
    setSaved(true);
  }

  async function checkAws(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = valuesFromForm(event.currentTarget);
    setCheck({ kind: "checking", message: "Validating AWS credentials and checking AWS resources..." });
    try {
      const response = await fetch("/api/aws/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "AWS validation failed.");
      rememberConnection(values);
      setCheck({ kind: "success", accountId: result.accountId, message: `AWS access is valid. Account ${result.accountId} has a usable VPC, subnet, security group, and key pair.` });
    } catch (validationError) {
      setCheck({ kind: "error", message: validationError instanceof Error ? validationError.message : "AWS validation failed." });
    }
  }

  async function createDeployment(values: Record<string, FormDataEntryValue>) {
    setBusy(true);
    setError("");
    const response = await fetch("/api/deployments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "Deployment creation failed."); setBusy(false); return; }
    window.location.assign(`/deployments/${result.deployment.deploymentId}`);
  }

  return <main className="min-h-screen bg-[#f4f7f5] p-6 text-[#173b42] md:p-12"><div className="mx-auto max-w-2xl"><Link href="/dashboard" className="text-sm text-[#438276]">← Back to dashboard</Link><h1 className="mt-8 font-[family-name:var(--font-space)] text-4xl font-semibold">Create deployment</h1><p className="mt-3 text-[#71837c]">Check AWS first. Enter your AWS access key pair to validate account access.</p><form onSubmit={checkAws} className="mt-8 space-y-6 rounded-lg border border-[#d8e5df] bg-white p-6"><label className="block text-sm font-medium">AWS access key ID<input required name="accessKeyId" className="mt-2 w-full rounded border border-[#cadbd4] p-3 font-mono text-sm" placeholder="AKIA..." /></label><label className="block text-sm font-medium">AWS secret access key<input required type="password" name="secretAccessKey" className="mt-2 w-full rounded border border-[#cadbd4] p-3 font-mono text-sm" placeholder="your-secret-key" /></label><label className="block text-sm font-medium">AWS session token <span className="font-normal text-[#8ba099]">(optional)</span><input name="sessionToken" className="mt-2 w-full rounded border border-[#cadbd4] p-3 font-mono text-sm" placeholder="if using temporary credentials" /></label><label className="block text-sm font-medium">Environment<select name="environment" className="mt-2 w-full rounded border border-[#cadbd4] p-3"><option value="standalone">Splunk Standalone · 1 server</option><option value="cluster">Splunk Cluster · 5 servers</option></select></label><label className="block text-sm font-medium">AWS region<select name="region" className="mt-2 w-full rounded border border-[#cadbd4] p-3"><option value="us-east-1">us-east-1 · N. Virginia</option><option value="us-west-2">us-west-2 · Oregon</option></select></label><label className="block text-sm font-medium">Existing SSH key<input required name="keyName" className="mt-2 w-full rounded border border-[#cadbd4] p-3" placeholder="platform-prod" /></label><label className="block text-sm font-medium">Amazon Machine Image (AMI) ID<input required name="imageId" className="mt-2 w-full rounded border border-[#cadbd4] p-3 font-mono text-sm" placeholder="ami-xxxxxxxxxxxxxxxxx" /></label><div className={`rounded border p-4 text-sm ${check.kind === "success" ? "border-[#b9dfcf] bg-[#f2faf7] text-[#397b6c]" : check.kind === "error" ? "border-[#edc7c1] bg-[#fff2ef] text-[#b95548]" : "border-[#d7e8e1] bg-[#f2faf7] text-[#397b6c]"}`}><strong>{check.kind === "success" ? "AWS check passed" : check.kind === "error" ? "AWS check failed" : check.kind === "checking" ? "Checking AWS" : "AWS readiness check"}</strong><p className="mt-1">{check.message}</p>{saved && <p className="mt-2 text-xs opacity-80">Role ARN and region remembered in this browser. No AWS secret is stored.</p>}</div>{error && <p className="rounded border border-[#edc7c1] bg-[#fff2ef] p-3 text-sm text-[#b95548]">{error}</p>}<div className="grid gap-3 sm:grid-cols-2"><button type="submit" disabled={check.kind === "checking" || busy} className="rounded border border-[#0d766f] bg-white px-4 py-3 text-sm font-semibold text-[#0d766f] disabled:opacity-60">{check.kind === "checking" ? "Checking AWS..." : "Check AWS access"}</button><button type="button" disabled={busy || check.kind !== "success"} onClick={(event) => { const form = event.currentTarget.form; if (form) void createDeployment(valuesFromForm(form)); }} className="rounded bg-[#0d766f] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Creating servers..." : "Create servers"}</button></div></form></div></main>;
}
