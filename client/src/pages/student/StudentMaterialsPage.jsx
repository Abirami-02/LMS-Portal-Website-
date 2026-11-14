import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import LoadingState from '../../components/LoadingState'
import ErrorState from '../../components/ErrorState'
import { useAuth } from '../../context/AuthContext'
import { API_URL, apiRequest } from '../../services/api'

function StudentMaterialsPage() {
  const { token } = useAuth()
  const [materials, setMaterials] = useState([])
  const [state, setState] = useState({ loading: true, error: '' })
  useEffect(() => { apiRequest('/study-materials', { token }).then(({ materials: items }) => setMaterials(items)).catch((error) => setState({ loading: false, error: error.message })).finally(() => setState((current) => ({ ...current, loading: false }))) }, [token])
  const rootUrl = API_URL.replace(/\/api\/?$/, '')
  return <div><PageHeader eyebrow="Resources" title="Study materials" description="Download PDF notes shared alongside your published lectures." />{state.loading ? <LoadingState /> : state.error ? <ErrorState message={state.error} /> : materials.length ? <div className="grid gap-4 md:grid-cols-2">{materials.map((material) => <a key={material._id} href={`${rootUrl}${material.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition hover:border-teal/40 hover:shadow-soft"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-500">PDF</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-ink">{material.title}</strong><span className="mt-1 block text-xs text-slate-500">{material.lecture?.title || 'Lecture'} · Download file</span></span><span className="text-xl text-teal">↓</span></a>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No study materials have been uploaded yet.</div>}</div>
}

export default StudentMaterialsPage
