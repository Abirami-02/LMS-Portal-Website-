import { useCallback, useEffect, useState } from 'react'
import ErrorState from '../../components/ErrorState'
import LectureCard from '../../components/LectureCard'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../services/api'

function RecordedSessionsPage() {
  const { token } = useAuth()
  const [lectures, setLectures] = useState([])
  const [state, setState] = useState({ loading: true, error: '' })
  const load = useCallback(() => { setState({ loading: true, error: '' }); apiRequest('/lectures', { token }).then(({ lectures: items }) => setLectures(items)).catch((error) => setState({ loading: false, error: error.message })).finally(() => setState((current) => ({ ...current, loading: false }))) }, [token])
  useEffect(() => load(), [load])

  return <div><PageHeader eyebrow="Learn on demand" title="Recorded sessions" description="Revisit lessons, catch up on modules, and learn at the pace that works for you." />{state.loading ? <LoadingState label="Loading recorded sessions…" /> : state.error ? <ErrorState message={state.error} onRetry={load} /> : lectures.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{lectures.map((lecture) => <LectureCard key={lecture._id} lecture={lecture} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">Your teacher has not published any recorded sessions yet.</div>}</div>
}

export default RecordedSessionsPage
