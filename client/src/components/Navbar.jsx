import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Home', to: '/' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-slate-200/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-navy text-lg font-black text-amber">S</span>
          <span className="text-sm font-bold tracking-tight text-ink sm:text-base">Smart Learning Portal</span>
        </Link>

        <button
          className="rounded-xl border border-slate-200 p-2 text-navy md:hidden"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
        </button>

        <div className={`${isOpen ? 'flex' : 'hidden'} absolute inset-x-5 top-[76px] z-10 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <nav className="flex flex-col gap-3 md:flex-row md:items-center md:gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-teal' : 'text-slate-600 hover:text-navy'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 border-t border-slate-100 pt-4 md:border-0 md:pt-0">
            {user ? <button type="button" onClick={() => { logout(); setIsOpen(false) }} className="text-sm font-semibold text-slate-600 hover:text-navy">Log out</button> : <><Link to="/login" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-navy">Log in</Link><Link to="/register" onClick={() => setIsOpen(false)} className="button-primary px-4 py-2.5">Get started</Link></>}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
