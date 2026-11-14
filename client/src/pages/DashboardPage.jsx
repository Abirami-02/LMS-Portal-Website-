function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><p className="eyebrow">Dashboard</p><div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="text-4xl font-black tracking-tight text-ink">A clear place to begin.</h1><p className="mt-3 max-w-xl text-slate-500">Your personalized learning dashboard will live here. Authentication and role-based experiences are next.</p></div><span className="rounded-full bg-amber/20 px-4 py-2 text-sm font-semibold text-navy">Setup in progress</span></div><div className="mt-10 grid gap-5 md:grid-cols-3"><div className="rounded-3xl bg-navy p-6 text-white md:col-span-2"><p className="text-sm text-white/60">Coming next</p><h2 className="mt-3 text-2xl font-bold">Your courses, in one calm view.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/70">This starter dashboard is ready to grow into separate student and teacher workspaces.</p></div><div className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">Portal status</p><p className="mt-3 text-3xl font-black text-teal">Ready</p><p className="mt-2 text-sm text-slate-500">Frontend shell connected.</p></div></div></section>
  )
}

export default DashboardPage
