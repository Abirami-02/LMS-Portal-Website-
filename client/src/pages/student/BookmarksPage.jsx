import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import LoadingState from '../../components/LoadingState'
import ErrorState from '../../components/ErrorState'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../services/api'

function BookmarksPage() {
  const { token } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [state, setState] = useState({ loading: true, error: '' })
  useEffect(() => { apiRequest('/bookmarks', { token }).then(({ bookmarks: items }) => setBookmarks(items)).catch((error) => setState({ loading: false, error: error.message })).finally(() => setState((current) => ({ ...current, loading: false }))) }, [token])
  const remove = async (id) => { await apiRequest(`/bookmarks/${id}`, { method: 'DELETE', token }); setBookmarks((current) => current.filter((item) => item.lecture?._id !== id)) }
  return <div><PageHeader eyebrow="Saved for later" title="Bookmarks" description="Keep the lectures you want to revisit close at hand." />{state.loading ? <LoadingState /> : state.error ? <ErrorState message={state.error} /> : bookmarks.length ? <div className="space-y-4">{bookmarks.map((bookmark) => <div key={bookmark._id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber/20 text-xl text-navy">★</div><div className="min-w-0 flex-1"><Link to={`/student/recorded-sessions/${bookmark.lecture?._id}`} className="font-bold text-ink hover:text-teal">{bookmark.lecture?.title}</Link><p className="mt-1 text-sm text-slate-500">{bookmark.lecture?.course?.title} · {bookmark.lecture?.module?.title}</p></div><button type="button" onClick={() => remove(bookmark.lecture?._id)} className="text-sm font-semibold text-slate-500 hover:text-red-600">Remove</button></div>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">You have not bookmarked any lectures yet.</div>}</div>
}

export default BookmarksPage
