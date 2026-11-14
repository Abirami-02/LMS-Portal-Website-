function PageHeader({ eyebrow, title, description, action }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">{eyebrow}</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}</div>{action}</div>
}

export default PageHeader
