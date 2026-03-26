import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, ClipboardList, Eye, TrendingUp, ArrowRight } from 'lucide-react'
import { employerApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { formatDate, getCountryLabels } from '@/utils/helpers'
import type { Job, Application } from '@/types'

export default function EmployerDashboard() {
  const { user } = useAuthStore()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      employerApi.getMyJobs(),
      employerApi.getApplications(),
    ]).then(([jobsRes, appsRes]) => {
      setJobs(jobsRes.data.data || [])
      setApplications(appsRes.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const totalViews = jobs.reduce((sum, j) => sum + (j.viewCount || 0), 0)
  const recentApps = applications.slice(0, 5)

  const STATUS_COLOR: Record<string, string> = {
    active: 'text-green-400',
    draft:  'text-yellow-400',
    paused: 'text-gray-400',
    closed: 'text-red-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.companyName || user?.fullName}</h1>
        <p className="text-brand-muted text-sm mt-1">Here's an overview of your recruitment activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Job Listings',   value: loading ? '—' : jobs.length,         icon: Briefcase,     color: '#fdd52f' },
          { label: 'Applications',   value: loading ? '—' : applications.length,  icon: ClipboardList, color: '#3B82F6' },
          { label: 'Total Views',    value: loading ? '—' : totalViews,            icon: Eye,           color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="card-dark p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-brand-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Jobs */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">My Job Listings</h2>
            <Link to="/employer/jobs" className="text-xs text-brand-yellow hover:text-brand-orange flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-brand-dark rounded-xl animate-pulse" />)}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brand-muted text-sm mb-3">No job listings yet</p>
              <Link to="/employer/jobs" className="btn-primary text-sm px-4 py-2">Post First Job</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.slice(0, 5).map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-brand-dark rounded-xl">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{job.title}</p>
                    <p className="text-brand-muted text-xs">{getCountryLabels()[job.country]} · {job.slots || 0} slots</p>
                  </div>
                  <span className={`text-xs font-medium capitalize ${STATUS_COLOR[job.status] || 'text-gray-400'}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Applications</h2>
            <Link to="/employer/applications" className="text-xs text-brand-yellow hover:text-brand-orange flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-brand-dark rounded-xl animate-pulse" />)}</div>
          ) : recentApps.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-8">No applications received yet</p>
          ) : (
            <div className="space-y-2">
              {recentApps.map(app => (
                <div key={app.id} className="flex items-center gap-3 p-3 bg-brand-dark rounded-xl">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-xs shrink-0" style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}>
                    {app.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{app.fullName}</p>
                    <p className="text-brand-muted text-xs truncate">{app.job?.title}</p>
                  </div>
                  <p className="text-brand-muted text-xs shrink-0">{formatDate(app.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick tip */}
      <div className="card-dark p-5 border border-brand-yellow/20 bg-brand-yellow/5">
        <div className="flex items-start gap-3">
          <TrendingUp size={20} className="text-brand-yellow shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold text-sm">Tip: Complete your profile</p>
            <p className="text-brand-muted text-xs mt-1">Add your company description and website to attract more qualified candidates to your job listings.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
