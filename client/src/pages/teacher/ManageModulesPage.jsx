import { useEffect, useState } from 'react'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../services/api'

const emptyForm = { title: '', description: '', order: 1 }

function ManageModulesPage() {
  const { token } = useAuth()
  const [courses, setCourses] = useState([])
  const [modules, setModules] = useState([])
  const [courseId, setCourseId] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [state, setState] = useState({ loading: true, error: '', saving: false })

  useEffect(() => {
    apiRequest('/courses', { token }).then(({ courses: items }) => {
      setCourses(items)
      if (items[0]) setCourseId(items[0]._id)
    }).catch((error) => setState((current) => ({ ...current, error: error.message }))).finally(() => setState((current) => ({ ...current, loading: false })))
  }, [token])

  useEffect(() => {
    if (courseId) apiRequest(`/modules/course/${courseId}`, { token }).then(({ modules: items }) => setModules(items)).catch((error) => setState((current) => ({ ...current, error: error.message })))
  }, [courseId, token])

  const submit = async (event) => {
    event.preventDefault()
    setState((current) => ({ ...current, saving: true, error: '' }))
    try {
      const response = await apiRequest(editingId ? `/modules/${editingId}` : '/modules', { method: editingId ? 'PATCH' : 'POST', token, body: { ...form, course: courseId } })
      setModules((current) => editingId ? current.map((item) => item._id === editingId ? response.module : item) : [...current, response.module])
      setForm(emptyForm)
      setEditingId(null)
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }))
    } finally {
      setState((current) => ({ ...current, saving: false }))
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this module?')) return
    try {
      await apiRequest(`/modules/${id}`, { method: 'DELETE', token })
      setModules((current) => current.filter((item) => item._id !== id))
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }))
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Course structure" title="Manage modules" description="Break each course into clear, teachable modules." />
      {state.loading ? <LoadingState /> : !courses.length ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">Create a course before adding modules.</div> : (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <label className="mb-4 block"><span className="mb-2 block text-sm font-semibold text-ink">Choose course</span><select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal">{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select></label>
            <div className="space-y-4">
              {modules.map((module) => <article key={module._id} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal/10 font-black text-teal">{module.order}</span><div className="min-w-0 flex-1"><h2 className="font-bold text-ink">{module.title}</h2><p className="mt-1 truncate text-sm text-slate-500">{module.description || 'No description yet.'}</p></div><button type="button" onClick={() => { setEditingId(module._id); setForm({ title: module.title, description: module.description || '', order: module.order }) }} className="text-sm font-semibold text-teal">Edit</button><button type="button" onClick={() => remove(module._id)} className="text-sm font-semibold text-red-500">Delete</button></article>)}
              {!modules.length && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No modules in this course yet.</div>}
            </div>
          </div>
          <form onSubmit={submit} className="h-fit rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold text-ink">{editingId ? 'Edit module' : 'Add module'}</h2><div className="mt-5 space-y-4"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Module title" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /><textarea rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Module description" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /><label className="block text-sm font-semibold text-ink">Order<input type="number" min="1" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /></label>{state.error && <ErrorState message={state.error} />}<div className="flex gap-3"><button disabled={state.saving} type="submit" className="button-primary flex-1">{state.saving ? 'Saving…' : editingId ? 'Save module' : 'Add module'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }} className="button-secondary">Cancel</button>}</div></div></form>
        </div>
      )}
    </div>
  )
}

export default ManageModulesPage
