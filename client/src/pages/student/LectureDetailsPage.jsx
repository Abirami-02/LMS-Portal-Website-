import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../components/ErrorState'
import LectureCard from '../../components/LectureCard'
import LoadingState from '../../components/LoadingState'
import VideoPlayer from '../../components/VideoPlayer'
import { useAuth } from '../../context/AuthContext'
import { API_URL, apiRequest } from '../../services/api'

function LectureDetailsPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [lecture, setLecture] = useState(null)
  const [related, setRelated] = useState([])
  const [materials, setMaterials] = useState([])
  const [doubts, setDoubts] = useState([])
  const [question, setQuestion] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [state, setState] = useState({ loading: true, error: '' })
  const load = async () => {
    try {
      const [{ lecture: current }, { lectures }, { materials: files }, { doubts: discussion }, { bookmarks }] = await Promise.all([apiRequest(`/lectures/${id}`, { token }), apiRequest('/lectures', { token }), apiRequest(`/study-materials?lecture=${id}`, { token }), apiRequest(`/doubts/lecture/${id}`, { token }), apiRequest('/bookmarks', { token })])
      setLecture(current); setRelated(lectures.filter((item) => item._id !== id).slice(0, 3)); setMaterials(files); setDoubts(discussion); setBookmarked(bookmarks.some((item) => item.lecture?._id === id))
    } catch (error) { setState({ loading: false, error: error.message }) } finally { setState((current) => ({ ...current, loading: false })) }
  }
  useEffect(() => { load() }, [id, token])
  const toggleBookmark = async () => { if (bookmarked) { await apiRequest(`/bookmarks/${id}`, { method: 'DELETE', token }); setBookmarked(false) } else { await apiRequest(`/bookmarks/${id}`, { method: 'POST', token }); setBookmarked(true) } }
  const ask = async (event) => { event.preventDefault(); if (!question.trim()) return; const { doubt } = await apiRequest(`/doubts/lecture/${id}`, { method: 'POST', token, body: { question } }); setDoubts((current) => [doubt, ...current]); setQuestion('') }
  const rootUrl = API_URL.replace(/\/api\/?$/, '')

  if (state.loading) return <LoadingState label="Loading lecture…" />
  if (state.error) return <ErrorState message={state.error} onRetry={load} />
  return <div>{lecture && <><button type="button" onClick={() => navigate(-1)} className="mb-6 text-sm font-semibold text-slate-500 hover:text-navy">← Back to sessions</button><div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]"><div><VideoPlayer url={lecture.videoUrl} title={lecture.title} /><div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="eyebrow">{lecture.course?.title} · {lecture.module?.title}</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink">{lecture.title}</h1></div><button type="button" onClick={toggleBookmark} className={`rounded-full px-4 py-2.5 text-sm font-bold ${bookmarked ? 'bg-amber text-navy' : 'border border-slate-200 bg-white text-slate-600'}`}>{bookmarked ? '★ Saved' : '☆ Save lecture'}</button></div><div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-navy font-bold text-amber">{lecture.teacher?.name?.[0] || 'T'}</span><div><p className="text-sm font-bold text-ink">{lecture.teacher?.name || 'Teacher'}</p><p className="text-xs text-slate-500">Course instructor</p></div></div><div className="mt-7 rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold text-ink">About this lecture</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{lecture.description || 'Your teacher has not added a description for this session yet.'}</p></div><div className="mt-7 rounded-3xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Doubt discussion</h2><span className="text-xs text-slate-400">{doubts.length} questions</span></div><form onSubmit={ask} className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about this lecture…" className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /><button className="button-primary" type="submit">Ask doubt</button></form><div className="mt-6 space-y-4">{doubts.map((doubt) => <div key={doubt._id} className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-semibold text-ink">{doubt.question}</p><p className="mt-1 text-xs text-slate-400">Asked by {doubt.student?.name || 'student'}</p>{doubt.answer && <div className="mt-3 rounded-xl border-l-2 border-teal bg-white p-3 text-sm text-slate-600"><span className="font-bold text-teal">Teacher reply: </span>{doubt.answer}</div>}</div>)}</div></div></div><aside className="space-y-5"><div className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="font-bold text-ink">PDF resources</h2><div className="mt-4 space-y-3">{materials.length ? materials.map((material) => <a key={material._id} href={`${rootUrl}${material.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-ink hover:bg-teal/10"><span className="text-red-500">PDF</span><span className="min-w-0 flex-1 truncate">{material.title}</span><span className="text-teal">↓</span></a>) : <p className="text-sm leading-6 text-slate-500">No PDF resources attached yet.</p>}</div></div><div><h2 className="mb-4 font-bold text-ink">Related sessions</h2><div className="space-y-4">{related.map((item) => <LectureCard key={item._id} lecture={item} />)}</div>{!related.length && <p className="text-sm text-slate-500">More sessions will appear here as your teacher publishes them.</p>}</div></aside></div></>}</div>
}

export default LectureDetailsPage
