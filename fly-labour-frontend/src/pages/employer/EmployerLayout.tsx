import { useState } from 'react'
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, ClipboardList, LogOut, X, Home, ChevronRight, UserCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const NAV = [
  { label: 'Tổng quan',       icon: LayoutDashboard, href: '/employer' },
  { label: 'Tin tuyển dụng',  icon: Briefcase,       href: '/employer/jobs' },
  { label: 'Hồ sơ ứng viên',  icon: ClipboardList,   href: '/employer/applications' },
  { label: 'Hồ sơ công ty',   icon: UserCircle,      href: '/employer/profile' },
]

function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { pathname } = useLocation()
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full bg-brand-card border-r border-brand-border w-60">
      <div className="flex items-center justify-between p-5 border-b border-brand-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}>
            <span className="font-display text-sm text-black font-black">FL</span>
          </div>
          <div>
            <p className="font-display text-sm text-white tracking-wider">FLY <span style={{ color: '#fdd52f' }}>LABOUR</span></p>
            <p className="text-xs text-brand-muted -mt-0.5">Cổng Nhà tuyển dụng</p>
          </div>
        </Link>
        {mobile && (
          <button onClick={onClose} className="text-brand-muted hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="px-4 py-4 border-b border-brand-border">
        <div className="flex items-center gap-3 p-3 bg-brand-yellow/5 rounded-xl">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-xs" style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}>
            {user?.fullName?.charAt(0) || 'E'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.companyName || user?.fullName}</p>
            <p className="text-brand-yellow text-xs">Nhà tuyển dụng</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const isActive = pathname === item.href || (item.href !== '/employer' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={16} className={isActive ? 'text-brand-yellow' : 'text-brand-muted group-hover:text-white'} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={13} className="text-brand-yellow" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-brand-border">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={16} /> Đăng xuất
        </button>
        <Link to="/" className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-colors">
          <Home size={16} /> Về trang chính
        </Link>
      </div>
    </div>
  )
}

export default function EmployerLayout() {
  const { isAuthenticated, user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated || (user?.role !== 'employer' && user?.role !== 'admin')) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      <div className="hidden md:flex flex-col">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex-none">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-5 py-3 border-b border-brand-border bg-brand-card/80 backdrop-blur shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white">☰</button>
          <p className="text-xs text-brand-muted hidden md:block">Fly Labour · Cổng Nhà tuyển dụng</p>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-bold text-xs" style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}>
            {user?.fullName?.charAt(0)}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
