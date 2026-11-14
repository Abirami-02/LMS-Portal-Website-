import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function PortalLayout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/70 bg-[#f5f7fb]/90 px-5 backdrop-blur lg:px-10">
          <button type="button" className="rounded-xl border border-slate-200 bg-white p-2.5 text-navy lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">☰</button>
          <div className="ml-auto flex items-center gap-3 text-sm text-slate-500"><span className="hidden sm:inline">Smart Learning Portal</span><span className="h-2 w-2 rounded-full bg-teal" /></div>
        </header>
        <main className="px-5 py-8 lg:px-10 lg:py-10"><Outlet /></main>
      </div>
    </div>
  )
}

export default PortalLayout
