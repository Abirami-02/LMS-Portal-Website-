function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} Smart Learning Portal</p>
        <p>Learn with clarity. Grow with confidence.</p>
      </div>
    </footer>
  )
}

export default Footer
