function FeatureCard({ icon, title, description }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-teal/10 text-xl">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3>
      <p className="text-sm leading-6 text-slate-500">{description}</p>
    </article>
  )
}

export default FeatureCard
