import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(form)
      navigate(location.state?.from || `/${user.role}/dashboard`, { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto flex max-w-7xl justify-center px-5 py-16 lg:px-8 lg:py-24"><div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-soft sm:p-10"><p className="eyebrow">Welcome back</p><h1 className="mt-3 text-3xl font-black text-ink">Log in to continue.</h1><p className="mt-3 text-sm leading-6 text-slate-500">Your learning space is ready when you are.</p><form className="mt-8 space-y-5" onSubmit={submit}><FormField label="Email address" type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" /><FormField label="Password" type="password" name="password" value={form.password} onChange={update} placeholder="Enter your password" /><label className="block"><span className="mb-2 block text-sm font-semibold text-ink">I am a</span><select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-teal" name="role" value={form.role} onChange={update}><option value="student">Student</option><option value="teacher">Teacher</option></select></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={submitting} type="submit" className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Signing in…' : 'Log in'}</button></form><p className="mt-7 text-center text-sm text-slate-500">New here? <Link className="font-semibold text-teal hover:text-navy" to="/register">Create an account</Link></p></div></section>
  )
}

export default LoginPage
