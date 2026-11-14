import { Link } from 'react-router-dom'

function LectureCard({ lecture }) {
  const date = lecture.scheduledAt ? new Date(lecture.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'On demand'
  return <Link to={`/student/recorded-sessions/${lecture._id}`} className="group block rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-teal/40 hover:shadow-soft"><div className="flex items-start justify-between gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal/10 text-xl text-teal">▶</div><span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">{lecture.published ? 'Published' : 'Draft'}</span></div><h3 className="mt-5 line-clamp-2 text-lg font-bold text-ink group-hover:text-teal">{lecture.title}</h3><p className="mt-2 text-sm text-slate-500">{lecture.course?.title || 'Course'} · {lecture.module?.title || 'Module'}</p><div className="mt-5 flex flex-wrap gap-2">{(lecture.tags?.length ? lecture.tags : ['Recorded session']).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">{tag}</span>)}</div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400"><span>{lecture.teacher?.name || 'Teacher'}</span><span>{date}</span></div></Link>
}

export default LectureCard
