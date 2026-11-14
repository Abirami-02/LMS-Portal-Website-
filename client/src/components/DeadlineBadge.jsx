import { useEffect, useState } from 'react'

export function getDeadlineState(dueDate) {
  const remaining = new Date(dueDate).getTime() - Date.now()
  const hours = remaining / (1000 * 60 * 60)
  if (remaining <= 0) return { label: 'Deadline passed', tone: 'danger', overdue: true }
  if (hours <= 24) return { label: 'Deadline is near', tone: 'danger', overdue: false }
  if (hours <= 72) return { label: 'Due soon', tone: 'warning', overdue: false }
  return { label: `Due ${new Date(dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}`, tone: 'normal', overdue: false }
}

function DeadlineBadge({ dueDate }) {
  const [, refresh] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => refresh((value) => value + 1), 60000); return () => window.clearInterval(timer) }, [])
  const status = getDeadlineState(dueDate)
  const styles = { danger: 'border-red-200 bg-red-50 text-red-700', warning: 'border-amber-200 bg-amber-50 text-amber-700', normal: 'border-slate-200 bg-slate-50 text-slate-600' }
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${styles[status.tone]}`}><span className={`h-1.5 w-1.5 rounded-full ${status.tone === 'danger' ? 'bg-red-500' : status.tone === 'warning' ? 'bg-amber-500' : 'bg-teal'}`} />{status.label}</span>
}

export default DeadlineBadge
