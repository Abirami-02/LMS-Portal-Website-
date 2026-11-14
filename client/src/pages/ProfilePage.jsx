import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../services/api'

function ProfilePage() {
  const { user, token, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' })
  const [status, setStatus] = useState({ error: '', success: '' })
  useEffect(() => setForm({ name: user?.name || '', bio: user?.bio || '' }), [user])
  const submit = async (event) => { event.preventDefault(); setStatus({ error: '', success: '' }); try { const response = await apiRequest('/auth/me', { method: 'PATCH', token, body: form }); setUser(response.user); localStorage.setItem('slp_user', JSON.stringify(response.user)); setStatus({ error: '', success: 'Profile updated successfully.' }) } catch (error) { setStatus({ error: error.message, success: '' }) } }
  return <div><PageHeader eyebrow="Your account" title="Profile" description="Keep your learner or teacher profile up to date." /><div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><div className="flex items-center gap-4 border-b border-slate-100 pb-6"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-xl font-black text-amber">{user?.name?.[0]}</span><div><h2 className="font-bold text-ink">{user?.name}</h2><p className="text-sm capitalize text-teal">{user?.role}</p></div></div><form className="mt-7 space-y-5" onSubmit={submit}><label className="block"><span className="mb-2 block text-sm font-semibold text-ink">Full name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-teal" required /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-ink">Email address</span><input value={user?.email || ''} disabled className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-500" /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-ink">Bio</span><textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} rows="4" placeholder="Tell your learning community a little about yourself" className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-teal" /></label>{status.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{status.error}</p>}{status.success && <p className="rounded-xl bg-teal/10 p-3 text-sm text-teal">{status.success}</p>}<div className="flex flex-wrap gap-3"><button className="button-primary" type="submit">Save changes</button><button className="button-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button></div></form></div></div>
}

export default ProfilePage
