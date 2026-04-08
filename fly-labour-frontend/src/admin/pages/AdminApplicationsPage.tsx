import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  ChevronDown,
  User,
  Briefcase,
  FileText,
} from "lucide-react";
import type { Application, AppStatus } from "@/core/types";
import { APP_STATUS_LABELS, formatDate } from "@/core/utils/helpers";
import toast from "react-hot-toast";
import { applicationsApi } from "@/core/services/api";

const STATUS_OPTIONS: AppStatus[] = [
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "withdrawn",
];

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AppStatus | "">("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [adminNote, setAdminNote] = useState("");

  const loadApps = () => {
    setLoading(true);
    applicationsApi
      .getAll({ status: filterStatus || undefined, limit: 50 })
      .then((r) => {
        setApps(r.data.data);
        setTotal(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    applicationsApi
      .getStats()
      .then((r) => {
        const counts: Record<string, number> = {};
        r.data.forEach((i: any) => {
          counts[i.status] = parseInt(i.count);
        });
        setStatusCounts(counts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadApps();
  }, [filterStatus]);

  const filtered = apps.filter(
    (a) =>
      !search ||
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  );

  const updateStatus = async (id: string, status: AppStatus, note?: string) => {
    setUpdatingId(id);
    try {
      await applicationsApi.updateStatus(id, status, note);
      setApps((as) => as.map((a) => (a.id === id ? { ...a, status } : a)));
      if (selected?.id === id)
        setSelected((s) => (s ? { ...s, status } : null));
      toast.success("Đã cập nhật trạng thái");
      applicationsApi.getStats().then((r) => {
        const counts: Record<string, number> = {};
        r.data.forEach((i: any) => {
          counts[i.status] = parseInt(i.count);
        });
        setStatusCounts(counts);
      });
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalAll = Object.values(statusCounts).reduce((s, v) => s + v, 0);

  // Helper classes
  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none transition-colors";
  const inputClasses =
    "w-full h-10 pl-10 pr-4 text-sm rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Đơn ứng tuyển
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm mt-1">
            Tổng {total} đơn hồ sơ ·{" "}
            <span className="text-amber-600 dark:text-brand-gold font-bold">
              {statusCounts["pending"] || 0} đang chờ duyệt
            </span>
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className={`${cardClasses} p-4 flex flex-wrap items-center gap-4`}>
        <div className="relative flex-1 min-w-[280px] max-w-sm">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClasses}
            placeholder="Tìm theo tên ứng viên, email..."
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setFilterStatus("")}
            className={`text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl border transition-all ${!filterStatus ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20" : "bg-white dark:bg-brand-card border-slate-200 dark:border-white/10 text-slate-500 dark:text-brand-muted hover:border-amber-400"}`}
          >
            Tất cả ({totalAll})
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl border transition-all ${filterStatus === s ? `${APP_STATUS_LABELS[s].color} border-current ring-1 ring-current/30` : "bg-white dark:bg-brand-card border-slate-200 dark:border-white/10 text-slate-500 dark:text-brand-muted hover:border-amber-400"}`}
            >
              {APP_STATUS_LABELS[s].label} ({statusCounts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className={`${cardClasses} overflow-hidden`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                  Ứng viên
                </th>
                <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest hidden sm:table-cell">
                  Vị trí ứng tuyển
                </th>
                <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest hidden md:table-cell">
                  Ngày nộp
                </th>
                <th className="text-left px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="text-right px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading
                ? [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-4">
                        <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                      </td>
                    </tr>
                  ))
                : filtered.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shadow-sm shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg,#e4a808,#fdd52f)",
                            }}
                          >
                            {app.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-900 dark:text-white font-bold text-sm truncate">
                              {app.fullName}
                            </p>
                            <p className="text-slate-500 dark:text-brand-muted text-xs truncate">
                              {app.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="text-slate-900 dark:text-white font-semibold text-sm line-clamp-1">
                          {app.job?.title}
                        </p>
                        <p className="text-slate-400 dark:text-brand-muted text-[11px] truncate">
                          {app.job?.company}
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-slate-500 dark:text-brand-muted text-xs font-medium">
                          {formatDate(app.createdAt)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateStatus(app.id, e.target.value as AppStatus)
                            }
                            disabled={updatingId === app.id}
                            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border appearance-none pr-8 cursor-pointer transition-all bg-white dark:bg-black/20 ${APP_STATUS_LABELS[app.status].color}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {APP_STATUS_LABELS[s].label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSelected(app);
                              setAdminNote("");
                            }}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 transition-all"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <span className="text-4xl mb-3 opacity-30">🔍</span>
              <p className="text-slate-500 dark:text-brand-muted text-sm font-medium">
                Không tìm thấy đơn ứng tuyển nào phù hợp
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Side Detail Panel (Drawer) */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-brand-card border-l border-slate-200 dark:border-brand-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 shrink-0 bg-white dark:bg-brand-card">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <FileText
                  size={20}
                  className="text-amber-600 dark:text-brand-gold"
                />
                Chi tiết đơn tuyển
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Profile Card */}
              <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-brand-gold/5 border border-slate-100 dark:border-brand-gold/10 rounded-2xl">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-amber-900 font-black text-2xl shadow-md shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                  }}
                >
                  {selected.fullName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-slate-900 dark:text-white font-bold text-lg">
                    {selected.fullName}
                  </p>
                  <p className="text-slate-500 dark:text-brand-muted text-sm flex items-center gap-1.5">
                    <User size={12} /> {selected.email}
                  </p>
                  <p className="text-slate-500 dark:text-brand-muted text-sm flex items-center gap-1.5 font-medium">
                    {selected.phone}
                  </p>
                </div>
              </div>

              {/* Job Info */}
              <div className="p-5 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-2">
                  Vị trí quan tâm
                </p>
                <p className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                  <Briefcase size={16} className="text-amber-600" />{" "}
                  {selected.job?.title}
                </p>
                <p className="text-slate-500 dark:text-brand-muted text-sm mt-1">
                  {selected.job?.company}
                </p>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Ngày sinh",
                    value: selected.dateOfBirth
                      ? formatDate(selected.dateOfBirth)
                      : "—",
                  },
                  { label: "Địa chỉ", value: selected.address || "—" },
                  { label: "Học vấn", value: selected.education || "—" },
                  { label: "Tiếng Anh", value: selected.languageLevel || "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl"
                  >
                    <p className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-slate-900 dark:text-white text-sm font-semibold">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {selected.experience && (
                <div className="p-5 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-2">
                    Kinh nghiệm
                  </p>
                  <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed">
                    {selected.experience}
                  </p>
                </div>
              )}

              {selected.coverLetter && (
                <div className="p-5 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-2">
                    Thư giới thiệu
                  </p>
                  <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.coverLetter}
                  </p>
                </div>
              )}

              {/* Admin Interaction Section */}
              <div className="p-5 bg-amber-50 dark:bg-brand-gold/5 border border-amber-200 dark:border-brand-gold/10 rounded-2xl space-y-4 shadow-inner">
                <div>
                  <p className="text-[10px] font-bold text-amber-700 dark:text-brand-gold uppercase tracking-widest mb-2">
                    Ghi chú nội bộ
                  </p>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    className="w-full text-sm rounded-xl px-4 py-3 bg-white dark:bg-black/40 border border-amber-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-amber-400 transition-all resize-none"
                    placeholder="Ghi chú đánh giá ứng viên..."
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-amber-700 dark:text-brand-gold uppercase tracking-widest mb-3">
                    Cập nhật trạng thái
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() =>
                          updateStatus(selected.id, s, adminNote || undefined)
                        }
                        disabled={updatingId === selected.id}
                        className={`text-[10px] px-3 py-2 rounded-xl border transition-all font-bold uppercase tracking-wider shadow-sm ${
                          selected.status === s
                            ? `${APP_STATUS_LABELS[s].color} border-current ring-1 ring-current/30`
                            : "bg-white dark:bg-brand-card border-slate-200 dark:border-white/10 text-slate-500 dark:text-brand-muted hover:border-amber-400"
                        }`}
                      >
                        {APP_STATUS_LABELS[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Nộp lúc: {formatDate(selected.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
