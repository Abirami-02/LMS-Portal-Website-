import { useEffect, useState } from 'react'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { API_URL, apiRequest } from '../../services/api'

function TeacherMaterialsPage() {
  const { token } = useAuth()
  const [lectures, setLectures] = useState([])
  const [materials, setMaterials] = useState([])
  const [form, setForm] = useState({ title: '', lecture: '', file: null })
  const [state, setState] = useState({ loading: true, error: '', saving: false })

  useEffect(() => {
    Promise.all([apiRequest('/lectures', { token }), apiRequest('/study-materials', { token })]).then(([lectureResponse, materialResponse]) => {
      setLectures(lectureResponse.lectures)
      setMaterials(materialResponse.materials)
      if (lectureResponse.lectures[0]) setForm((current) => ({ ...current, lecture: lectureResponse.lectures[0]._id }))
    }).catch((error) => setState((current) => ({ ...current, error: error.message }))).finally(() => setState((current) => ({ ...current, loading: false })))
  }, [token])

  const submit = async (event) => {
    event.preventDefault()
    if (!form.file) return setState((current) => ({ ...current, error: 'Choose a PDF file first' }))
    setState((current) => ({ ...current, error: '', saving: true }))
    try {
      const body = new FormData()
      body.append('title', form.title)
      body.append('lecture', form.lecture)
      body.append('file', form.file)
      const { material } = await apiRequest('/study-materials', { method: 'POST', token, body })
      setMaterials((current) => [material, ...current])
      setForm((current) => ({ ...current, title: '', file: null }))
      event.target.reset()
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }))
    } finally {
      setState((current) => ({ ...current, saving: false }))
    }
  }

  const remove = async (id) => {
    try {
      await apiRequest(`/study-materials/${id}`, { method: 'DELETE', token })
      setMaterials((current) => current.filter((item) => item._id !== id))
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }))
    }
  }

  const rootUrl = API_URL.replace(/\/api\/?$/, '')
  return (
    <div>
      <PageHeader eyebrow="Resources for learners" title="Study materials" description="Upload PDF notes to support your published or draft lectures." />
      {state.loading ? <LoadingState /> : (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {materials.map((material) => <div key={material._id} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-xs font-black text-red-500">PDF</span><div className="min-w-0 flex-1"><a href={`${rootUrl}${material.fileUrl}`} target="_blank" rel="noreferrer" className="truncate text-sm font-bold text-ink hover:text-teal">{material.title}</a><p className="mt-1 text-xs text-slate-500">{material.lecture?.title || 'Lecture'}</p></div><button type="button" onClick={() => remove(material._id)} className="text-sm font-semibold text-red-500">Delete</button></div>)}
            {!materials.length && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No PDF resources uploaded yet.</div>}
          </div>
          <form onSubmit={submit} className="h-fit rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold text-ink">Upload a PDF</h2><div className="mt-5 space-y-4"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Resource title" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal" /><select required value={form.lecture} onChange={(event) => setForm({ ...form, lecture: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal"><option value="">Choose lecture</option>{lectures.map((lecture) => <option key={lecture._id} value={lecture._id}>{lecture.title}</option>)}</select><input required type="file" accept="application/pdf,.pdf" onChange={(event) => setForm({ ...form, file: event.target.files[0] })} className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500" />{state.error && <ErrorState message={state.error} />}<button disabled={state.saving} type="submit" className="button-primary w-full">{state.saving ? 'Uploading…' : 'Upload PDF'}</button></div></form>
        </div>
      )}
    </div>
  )
}

export default TeacherMaterialsPage
