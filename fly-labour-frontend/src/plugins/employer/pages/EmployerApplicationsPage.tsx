import { useState, useEffect } from 'react'
import { FileText, Search, ExternalLink, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react'
import { employerApi, applicationsApi, getImageUrl } from '@/core/services/api'
import { APP_STATUS_LABELS, formatDate } from '@/core/utils/helpers'
import toast from 'react-hot-toast'
import type { Application } from '@/core/types'

const EMPLOYER_STATUS_OPTIONS = [
  { value: 'reviewing', label: 'Đang xem xét', icon: Clock, color: 'text-blue-400 border-blue-400/30 bg-blue-400/5' },
  { value: 'approved', label: 'Phê duyệt', icon: CheckCircle, color: 'text-green-400 border-green-400/30 bg-green-400/5' },
  { value: 'rejected', label: 'Từ chối', icon: XCircle, color: 'text-red-400 border-red-400/30 bg-red-400/5' },
]

export default function EmployerApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    employerApi.getApplications()
      .then(r => setApps(r.data || []))
      .catch(() => toast.error('Không tải được hồ sơ'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (appId: string, status: string) => {
    setUpdatingId(appId)
    try {
      const res = await applicationsApi.employerUpdateStatus(appId, status)
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: res.data.status } : a))
      toast.success('Đã cập nhật trạng thái')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = apps.filter(a =>
    !search ||
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.job?.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-theme-text-base">Hồ sơ ứng viên</h1>
        <p className="text-theme-text-tertiary text-sm">{apps.length} hồ sơ đã nhận</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-text-tertiary" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên, email hoặc tên vị trí..."
          className="input-dark pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-theme-surface rounded-2xl animate-pulse border border-theme-border-default" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <p className="text-4xl mb-3">📂</p>
          <p className="text-theme-text-base font-semibold mb-1">
            {search ? 'Không tìm thấy kết quả' : 'Chưa có hồ sơ nào'}
          </p>
          <p className="text-theme-text-tertiary text-sm">
            Hồ sơ sẽ xuất hiện tại đây khi ứng viên nộp vào các tin tuyển dụng của bạn.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(app => {
            const status = APP_STATUS_LABELS[app.status]
            const isOpen = expanded === app.id
            return (
              <div key={app.id} className="card-dark border border-theme-border-default rounded-2xl overflow-hidden">
                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-theme-surfaceSecondary transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs shrink-0"
                    style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}
                  >
                    {app.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-theme-text-base font-medium text-sm">{app.fullName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${status?.color}`}>{status?.label}</span>
                    </div>
                    <p className="text-theme-text-tertiary text-xs truncate">
                      {app.email} · {app.job?.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-theme-text-tertiary text-xs hidden sm:block">{formatDate(app.createdAt)}</p>
                    {isOpen
                      ? <ChevronUp size={15} className="text-theme-text-tertiary" />
                      : <ChevronDown size={15} className="text-theme-text-tertiary" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-theme-border-default p-4 space-y-3 bg-theme-background/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {[
                        { label: 'Điện thoại', value: app.phone },
                        { label: 'Ngày sinh', value: app.dateOfBirth ? formatDate(app.dateOfBirth) : '—' },
                        { label: 'Địa chỉ', value: app.address || '—' },
                        { label: 'Học vấn', value: app.education || '—' },
                        { label: 'Kinh nghiệm', value: app.experience || '—' },
                        { label: 'Tiếng Anh', value: app.languageLevel || '—' },
                      ].map(f => (
                        <div key={f.label} className="p-3 bg-theme-surface border border-theme-border-default rounded-xl">
                          <p className="text-theme-text-tertiary text-xs mb-0.5">{f.label}</p>
                          <p className="text-theme-text-base text-sm">{f.value}</p>
                        </div>
                      ))}
                    </div>

                    {app.coverLetter && (
                      <div className="p-3 bg-theme-surface border border-theme-border-default rounded-xl">
                        <p className="text-theme-text-tertiary text-xs mb-1">Thư xin việc</p>
                        <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    {app.cvUrl && (
                      <div>
                        <p className="text-theme-text-tertiary text-xs mb-1">CV / Hồ sơ</p>
                        <a
                          href={getImageUrl(app.cvUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-brand-gold-primary hover:text-brand-orange-primary text-sm transition-colors"
                        >
                          <FileText size={14} /> Xem CV <ExternalLink size={12} />
                        </a>
                      </div>
                    )}

                    {/* Status actions */}
                    {app.status !== 'withdrawn' && (
                      <div>
                        <p className="text-theme-text-tertiary text-xs mb-2">Cập nhật trạng thái</p>
                        <div className="flex flex-wrap gap-2">
                          {EMPLOYER_STATUS_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              disabled={app.status === opt.value || updatingId === app.id}
                              onClick={() => handleStatusChange(app.id, opt.value)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                app.status === opt.value
                                  ? opt.color
                                  : 'border-theme-border-default text-theme-text-tertiary hover:border-brand-gold-primary/40 hover:text-theme-text-base bg-theme-surface'
                              }`}
                            >
                              <opt.icon size={12} /> {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
