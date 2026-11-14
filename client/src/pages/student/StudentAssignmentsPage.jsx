import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DeadlineBadge from '../../components/DeadlineBadge'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../services/api'

function StudentAssignmentsPage() {
  const { token } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [state, setState] = useState({ loading: true, error: '' })
  useEffect(() => { apiRequest('/assignments', { token }).then(({ assignments: items }) => setAssignments(items)).catch((error) => setState({ loading: false, error: error.message })).finally(() => setState((current) => ({ ...current, loading: false }))) }, [token])

  return <div><PageHeader eyebrow="Stay on track" title="Assignments" description="Submit your work before the deadline. Deadlines within 24 hours are highlighted in red." />{state.loading ? <LoadingState label="Loading assignments…" /> : state.error ? <ErrorState message={state.error} /> : assignments.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{assignments.map((assignment) => <Link key={assignment._id} to={`/student/assignments/${assignment._id}`} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-teal/40 hover:shadow-soft"><div className="flex items-start justify-between gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber/20 text-xl text-navy">✓</span><DeadlineBadge dueDate={assignment.dueDate} /></div><h2 className="mt-5 text-lg font-bold text-ink group-hover:text-teal">{assignment.title}</h2><p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">{assignment.description || 'Review the instructions and submit your work here.'}</p><div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400"><p>{assignment.course?.title} · {assignment.module?.title}</p><p className="mt-1">{assignment.submission ? `Submitted ${new Date(assignment.submission.submittedAt).toLocaleDateString()}` : 'Not submitted yet'}</p></div></Link>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No assignments have been published yet.</div>}</div>
}

export default StudentAssignmentsPage
