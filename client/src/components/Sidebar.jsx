import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const studentLinks = [
  ['dashboard', 'Overview', '⌂'],
  ['courses', 'My courses', '▣'],
  ['recorded-sessions', 'Recorded sessions', '▶'],
  ['assignments', 'Assignments', '✓'],
  ['materials', 'Study materials', '▤'],
  ['bookmarks', 'Bookmarks', '★'],
  ['profile', 'Profile', '◉'],
]
const teacherLinks = [
  ['dashboard', 'Overview', '⌂'],
  ['courses', 'Manage courses', '▣'],
  ['modules', 'Manage modules', '▤'],
  ['lectures', 'Upload sessions', '▶'],
  ['assignments', 'Manage assignments', '✓'],
  ['materials', 'Study materials', '▤'],
  ['profile', 'Profile', '◉'],
]

function Sidebar({ role, open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = role === 'student' ? studentLinks : teacherLinks
  const handleLogout = () => { logout(); navigate('/') }

  return <>
    {open && <button aria-label="Close navigation" type="button" className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={onClose} />}
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-navy px-6 py-7 text-white transition-transform lg:translate-x-0`}>
      <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber text-lg font-black text-navy">S</span><span className="font-bold tracking-tight">Smart Learning Portal</span><button type="button" className="ml-auto text-2xl text-white/60 lg:hidden" onClick={onClose} aria-label="Close">×</button></div>
      <div className="mt-12 rounded-2xl bg-white/10 p-4"><p className="text-xs uppercase tracking-[0.18em] text-white/50">Signed in as</p><p className="mt-2 truncate font-semibold">{user?.name}</p><p className="mt-1 text-sm capitalize text-white/60">{role}</p></div>
      <nav className="mt-8 flex-1 space-y-1">{links.map(([path, label, icon]) => <NavLink key={path} to={`/${role}/${path}`} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-white text-navy' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}><span className="w-5 text-center">{icon}</span>{label}</NavLink>)}</nav>
      <button type="button" onClick={handleLogout} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"><span className="w-5 text-center">↪</span>Log out</button>
    </aside>
  </>
}

export default Sidebar
