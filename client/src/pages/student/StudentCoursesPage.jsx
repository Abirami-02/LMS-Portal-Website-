import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import LoadingState from '../../components/LoadingState'
import ErrorState from '../../components/ErrorState'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../services/api'

function StudentCoursesPage() {
  const { token } = useAuth()
  const [courses, setCourses] = useState([])
  const [enrolled, setEnrolled] = useState([])
  const [state, setState] = useState({ loading: true, error: '' })
  useEffect(() => { Promise.all([apiRequest('/courses', { token }), apiRequest('/enrollments', { token })]).then(([courseResponse, enrollmentResponse]) => { setCourses(courseResponse.courses); setEnrolled(enrollmentResponse.enrollments.map((item) => item.course?._id)) }).catch((error) => setState({ loading: false, error: error.message })).finally(() => setState((current) => ({ ...current, loading: false }))) }, [token])
  const enroll = async (courseId) => { try { await apiRequest(`/enrollments/${courseId}`, { method: 'POST', token }); setEnrolled((current) => [...current, courseId]) } catch (error) { setState((current) => ({ ...current, error: error.message })) } }

  return <div><PageHeader eyebrow="Your curriculum" title="My courses" description="Explore published courses and enrol in the ones that match your goals." />{state.loading ? <LoadingState /> : state.error ? <ErrorState message={state.error} /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => { const isEnrolled = enrolled.includes(course._id); return <article key={course._id} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber/20 text-xl text-navy">▣</span><span className="text-xs font-semibold text-teal">Published</span></div><h2 className="mt-6 text-xl font-bold text-ink">{course.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{course.description || 'A focused course space for your next learning goal.'}</p><p className="mt-5 text-xs text-slate-400">Teacher: {course.teacher?.name || 'Teacher'}</p><button type="button" disabled={isEnrolled} onClick={() => enroll(course._id)} className="button-primary mt-5 w-full disabled:cursor-default disabled:bg-teal">{isEnrolled ? 'Enrolled' : 'Enroll now'}</button></article> })}</div>}</div>
}

export default StudentCoursesPage
