import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f7f5] px-6 py-10 text-[#173b42] md:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-[#d8e5df] pb-6">
          <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-[#8dd4be] font-bold">◒</span><span className="font-[family-name:var(--font-space)] text-xl font-semibold">Fieldline</span><span className="rounded border border-[#b8d5cc] px-2 py-1 text-[10px] uppercase tracking-widest text-[#438276]">AWS</span></div>
          <Link className="text-sm text-[#347f72] underline-offset-4 hover:underline" href="/dashboard">Open dashboard →</Link>
        </header>
        <section className="grid gap-12 py-24 md:grid-cols-[1.25fr_.75fr] md:items-center">
          <div><p className="mb-5 text-xs uppercase tracking-[.25em] text-[#438276]">Self-service cloud operations</p><h1 className="max-w-2xl font-[family-name:var(--font-space)] text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">The shortest path from AWS to Splunk.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#658078]">Deploy production-ready Splunk environments with opinionated infrastructure defaults, temporary credentials, and a clear handoff from servers to configuration.</p><div className="mt-9 flex flex-wrap gap-3"><Link className="rounded-md bg-[#0d766f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0d766f]/15" href="/create">Create deployment</Link><Link className="rounded-md border border-[#cbdcd5] bg-white px-5 py-3 text-sm font-semibold text-[#41645e]" href="/dashboard">View dashboard</Link></div></div>
          <div className="rounded-xl border border-[#cbded6] bg-white p-7 shadow-[0_20px_50px_rgba(38,88,76,.08)]"><div className="mb-7 flex items-center justify-between"><span className="text-sm font-semibold">Deployment flow</span><span className="rounded-full bg-[#e5f5ee] px-2 py-1 text-[10px] text-[#38836c]">READY</span></div>{["AWS access validated","EC2 servers created","Splunk configuration"].map((item, index) => <div className="flex items-center gap-4 border-t border-[#edf2ef] py-5" key={item}><span className={`grid size-8 place-items-center rounded-full text-sm ${index < 2 ? "bg-[#58b99c] text-white" : "bg-[#fff1d9] text-[#b0782c]"}`}>{index < 2 ? "✓" : "○"}</span><div><strong className="block text-sm">{item}</strong><span className="text-xs text-[#84958f]">{index < 2 ? "Complete and verified" : "Ready to start manually"}</span></div></div>)}</div>
        </section>
      </div>
    </main>
  );
}
