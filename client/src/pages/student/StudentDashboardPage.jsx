import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../../components/ErrorState'
import LectureCard from '../../components/LectureCard'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/StatCard'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../services/api'

function StudentDashboardPage() {
  const { token, user } = useAuth()
  const [data, setData] = useState({ lectures: [], courses: [], bookmarks: [] })
  const [state, setState] = useState({ loading: true, error: '' })

  useEffect(() => {
    Promise.all([apiRequest('/lectures', { token }), apiRequest('/courses', { token }), apiRequest('/bookmarks', { token })])
      .then(([lectures, courses, bookmarks]) => setData({ lectures: lectures.lectures, courses: courses.courses, bookmarks: bookmarks.bookmarks }))
      .catch((error) => setState({ loading: false, error: error.message }))
      .finally(() => setState((current) => ({ ...current, loading: false })))
  }, [token])

  return <div><PageHeader eyebrow="Student dashboard" title={`Good to see you, ${user?.name?.split(' ')[0] || 'learner'}.`} description="Keep your learning rhythm going with your latest sessions and courses." action={<Link to="/student/recorded-sessions" className="button-primary">Browse sessions →</Link>} />{state.loading ? <LoadingState label="Loading your dashboard…" /> : state.error ? <ErrorState message={state.error} /> : <><div className="grid gap-4 sm:grid-cols-3"><StatCard label="Available courses" value={data.courses.length} /><StatCard label="Recorded sessions" value={data.lectures.length} tone="navy" /><StatCard label="Bookmarked lectures" value={data.bookmarks.length} /></div><div className="mt-10 flex items-center justify-between"><div><p className="eyebrow">Keep learning</p><h2 className="mt-2 text-2xl font-black text-ink">Latest recorded sessions</h2></div><Link to="/student/recorded-sessions" className="text-sm font-bold text-teal hover:text-navy">View all →</Link></div><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{data.lectures.slice(0, 3).map((lecture) => <LectureCard key={lecture._id} lecture={lecture} />)}</div>{!data.lectures.length && <div className="mt-5 rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No published sessions yet. Your teacher can add one from the teacher portal.</div>}</>}</div>
}

export default StudentDashboardPage
