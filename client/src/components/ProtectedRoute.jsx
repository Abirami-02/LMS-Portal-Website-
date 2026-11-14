import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="grid min-h-screen place-items-center bg-cream text-sm font-semibold text-slate-500">Loading your learning space…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role && user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />
  return <Outlet />
}

export default ProtectedRoute
