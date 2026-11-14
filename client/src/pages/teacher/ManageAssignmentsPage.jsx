import { useEffect, useState } from 'react'
import DeadlineBadge from '../../components/DeadlineBadge'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { API_URL, apiRequest } from '../../services/api'

const emptyForm = { title: '', description: '', instructions: '', dueDate: '', course: '', module: '', published: false, file: null }

function ManageAssignmentsPage() {
  const { token } = useAuth()
  const [courses, setCourses] = useState([])
  const [modules, setModules] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState({})
  const [openAssignment, setOpenAssignment] = useState(null)
  const [submissionLoading, setSubmissionLoading] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [state, setState] = useState({ loading: true, error: '', saving: false })

  useEffect(() => {
    Promise.all([apiRequest('/courses', { token }), apiRequest('/assignments', { token })]).then(([courseResponse, assignmentResponse]) => {
      setCourses(courseResponse.courses)
      setAssignments(assignmentResponse.assignments)
      if (courseResponse.courses[0]) setForm((current) => ({ ...current, course: courseResponse.courses[0]._id }))
    }).catch((error) => setState((current) => ({ ...current, error: error.message }))).finally(() => setState((current) => ({ ...current, loading: false })))
  }, [token])

  useEffect(() => {
    if (form.course) apiRequest(`/modules/course/${form.course}`, { token }).then(({ modules: items }) => { setModules(items); setForm((current) => ({ ...current, module: current.module && items.some((item) => item._id === current.module) ? current.module : items[0]?._id || '' })) }).catch((error) => setState((current) => ({ ...current, error: error.message })))
  }, [form.course, token])

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    if (!form.file) return setState((current) => ({ ...current, error: 'Choose an assignment file to upload' }))
    setState((current) => ({ ...current, saving: true, error: '' }))
    try {
      const body = new FormData()
      Object.entries(form).forEach(([key, value]) => { if (key !== 'file' && value !== '') body.append(key, value) })
      body.append('file', form.file)
      const { assignment } = await apiRequest('/assignments', { method: 'POST', token, body })
      setAssignments((current) => [assignment, ...current])
      setForm((current) => ({ ...emptyForm, course: current.course }))
      event.target.reset()
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }))
    } finally {
      setState((current) => ({ ...current, saving: false }))
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this assignment and its submissions?')) return
    try {
      await apiRequest(`/assignments/${id}`, { method: 'DELETE', token })
      setAssignments((current) => current.filter((assignment) => assignment._id !== id))
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }))
    }
  }

  const toggleSubmissions = async (assignmentId) => {
    if (openAssignment === assignmentId) return setOpenAssignment(null)
    setOpenAssignment(assignmentId)
    setSubmissionLoading(assignmentId)
    try {
      const { submissions: items } = await apiRequest(`/assignments/${assignmentId}/submissions`, { token })
      setSubmissions((current) => ({ ...current, [assignmentId]: items }))
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }))
    } finally {
      setSubmissionLoading('')
    }
  }

  return <div><PageHeader eyebrow="Student work" title="Manage assignments" description="Upload a brief, set a clear deadline, and publish it to your students." />{state.loading ? <LoadingState /> : !courses.length ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">Create a course and module before adding assignments.</div> : <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]"><div className="space-y-4">{assignments.map((assignment) => <article key={assignment._id} className="rounded-3xl border border-slate-200 bg-white p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber/20 text-xl text-navy">✓</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-ink">{assignment.title}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${assignment.published ? 'bg-teal/10 text-teal' : 'bg-slate-100 text-slate-500'}`}>{assignment.published ? 'Published' : 'Draft'}</span></div><p className="mt-2 text-sm text-slate-500">{assignment.course?.title} · {assignment.module?.title}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{assignment.description || 'No description yet.'}</p></div><div className="flex flex-col items-start gap-3 sm:items-end"><DeadlineBadge dueDate={assignment.dueDate} /><button type="button" onClick={() => toggleSubmissions(assignment._id)} className="text-sm font-semibold text-teal hover:text-navy">{openAssignment === assignment._id ? 'Hide submissions' : 'View submissions'}</button><button type="button" onClick={() => remove(assignment._id)} className="text-sm font-semibold text-red-500">Delete</button></div></div>{openAssignment === assignment._id && <div className="mt-5 border-t border-slate-100 pt-5">{submissionLoading === assignment._id ? <p className="text-sm text-slate-500">Loading student submissions…</p> : !submissions[assignment._id]?.length ? <p className="text-sm text-slate-500">No students have submitted this assignment yet.</p> : <div className="space-y-3">{submissions[assignment._id].map((submission) => <div key={submission._id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-ink">{submission.student?.name || 'Unknown student'}</p><p className="mt-1 text-xs text-slate-500">{submission.student?.email} · Submitted {new Date(submission.submittedAt).toLocaleString()}</p>{submission.note && <p className="mt-2 text-sm text-slate-600">{submission.note}</p>}</div><a href={`${API_URL.replace('/api', '')}${submission.fileUrl}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal hover:text-navy">Download {submission.originalName || 'submission'}</a></div>)}</div>}</div>}</article>)}{!assignments.length && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No assignments yet. Add the first one from the form.</div>}</div><form onSubmit={submit} className="h-fit rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold text-ink">Upload an assignment</h2><div className="mt-5 space-y-4"><input required name="title" value={form.title} onChange={update} placeholder="Assignment title" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /><textarea required name="description" rows="3" value={form.description} onChange={update} placeholder="Short description" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /><textarea name="instructions" rows="4" value={form.instructions} onChange={update} placeholder="Instructions for students" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /><select required name="course" value={form.course} onChange={update} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal"><option value="">Choose course</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select><select required name="module" value={form.module} onChange={update} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal"><option value="">Choose module</option>{modules.map((module) => <option key={module._id} value={module._id}>{module.order}. {module.title}</option>)}</select><label className="block text-sm font-semibold text-ink">Deadline<input required name="dueDate" value={form.dueDate} onChange={update} type="datetime-local" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /></label><label className="block text-sm font-semibold text-ink">Assignment file<input required name="file" type="file" onChange={(event) => setForm({ ...form, file: event.target.files[0] })} className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500" /></label><label className="flex items-center gap-3 text-sm font-semibold text-ink"><input type="checkbox" name="published" checked={form.published} onChange={update} className="h-4 w-4 accent-teal" /> Publish for students now</label>{state.error && <ErrorState message={state.error} />}<button disabled={state.saving || !modules.length} type="submit" className="button-primary w-full disabled:opacity-60">{state.saving ? 'Uploading…' : 'Upload assignment'}</button></div></form></div>}</div>
}

export default ManageAssignmentsPage
