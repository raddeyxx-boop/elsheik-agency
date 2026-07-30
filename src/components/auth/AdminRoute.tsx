import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminRoute() {
  const { loading, user, isAdmin } = useAuth()
  if (loading) return <div className="page-loader">جارٍ التحقق من صلاحية الدخول...</div>
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
