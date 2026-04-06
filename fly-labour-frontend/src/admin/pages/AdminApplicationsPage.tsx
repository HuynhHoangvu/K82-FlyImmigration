import { useEffect, useState } from "react";
import { Search, Eye, X, ChevronDown } from "lucide-react";
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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-theme-text-base">
          Đơn ứng tuyển
        </h1>
        <p className="text-theme-text-tertiary text-sm">
          {total} đơn · {statusCounts["pending"] || 0} chờ xét duyệt
        </p>
      </div>

      <div className="card-dark p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-tertiary"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-9 py-2 text-sm h-10"
            placeholder="Tìm tên, email..."
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterStatus("")}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${!filterStatus ? "bg-brand-gold-primary/10 border-brand-gold-primary/30 text-brand-gold-primary" : "border-theme-border-default text-theme-text-tertiary hover:text-theme-text-base bg-theme-surface"}`}
          >
            Tất cả ({totalAll})
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filterStatus === s ? APP_STATUS_LABELS[s].color : "border-theme-border-default text-theme-text-tertiary hover:text-theme-text-base bg-theme-surface"}`}
            >
              {APP_STATUS_LABELS[s].label} ({statusCounts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme-border-default bg-theme-surfaceSecondary/50">
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Ứng viên
                </th>
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold hidden sm:table-cell">
                  Vị trí ứng tuyển
                </th>
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold hidden md:table-cell">
                  Ngày nộp
                </th>
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Trạng thái
                </th>
                <th className="text-right px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-theme-border-default/40"
                    >
                      <td className="px-4 py-3">
                        <div className="h-8 bg-theme-surfaceSecondary rounded-lg animate-pulse w-40" />
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="h-4 bg-theme-surfaceSecondary rounded animate-pulse w-32" />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="h-4 bg-theme-surfaceSecondary rounded animate-pulse w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-6 bg-theme-surfaceSecondary rounded-lg animate-pulse w-20" />
                      </td>
                      <td className="px-4 py-3" />
                    </tr>
                  ))
                : filtered.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-theme-border-default/40 hover:bg-theme-surfaceSecondary transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-900 text-xs font-bold shrink-0 shadow-sm"
                            style={{
                              background:
                                "linear-gradient(135deg,#e4a808,#fdd52f)",
                            }}
                          >
                            {app.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-theme-text-base text-sm font-medium">
                              {app.fullName}
                            </p>
                            <p className="text-theme-text-tertiary text-xs">
                              {app.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-theme-text-base text-sm line-clamp-1">
                          {app.job?.title}
                        </p>
                        <p className="text-theme-text-tertiary text-xs">
                          {app.job?.company}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-theme-text-tertiary text-xs">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateStatus(app.id, e.target.value as AppStatus)
                            }
                            disabled={updatingId === app.id}
                            className={`text-xs px-2 py-1 rounded-lg border font-medium bg-theme-background cursor-pointer appearance-none pr-6 ${APP_STATUS_LABELS[app.status].color}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {APP_STATUS_LABELS[s].label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={10}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => { setSelected(app); setAdminNote(""); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-theme-text-tertiary hover:text-theme-text-base hover:bg-theme-surfaceSecondary transition-colors"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="py-12 text-center text-theme-text-tertiary text-sm">
              Không có đơn nào
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md bg-theme-surface border-l border-theme-border-default overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-theme-border-default sticky top-0 bg-theme-surface">
              <h2 className="font-semibold text-theme-text-base">
                Chi tiết đơn ứng tuyển
              </h2>
              <button onClick={() => setSelected(null)}>
                <X
                  size={18}
                  className="text-theme-text-tertiary hover:text-theme-text-base"
                />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3 p-4 bg-brand-gold-primary/5 border border-brand-gold-primary/20 rounded-xl">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-900 font-bold shadow-sm"
                  style={{
                    background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                  }}
                >
                  {selected.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-theme-text-base font-semibold">
                    {selected.fullName}
                  </p>
                  <p className="text-theme-text-tertiary text-sm">
                    {selected.email}
                  </p>
                  <p className="text-theme-text-tertiary text-sm">
                    {selected.phone}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-theme-background border border-theme-border-default rounded-xl">
                <p className="text-xs text-theme-text-tertiary mb-1">
                  Vị trí ứng tuyển
                </p>
                <p className="text-theme-text-base font-medium">
                  {selected.job?.title}
                </p>
                <p className="text-theme-text-tertiary text-sm">
                  {selected.job?.company}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    className="p-3 bg-theme-background border border-theme-border-default rounded-xl"
                  >
                    <p className="text-xs text-theme-text-tertiary">
                      {item.label}
                    </p>
                    <p className="text-theme-text-base text-sm mt-0.5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {selected.experience && (
                <div className="p-4 bg-theme-background border border-theme-border-default rounded-xl">
                  <p className="text-xs text-theme-text-tertiary mb-1">
                    Kinh nghiệm
                  </p>
                  <p className="text-theme-text-base text-sm">
                    {selected.experience}
                  </p>
                </div>
              )}

              {selected.coverLetter && (
                <div className="p-4 bg-theme-background border border-theme-border-default rounded-xl">
                  <p className="text-xs text-theme-text-tertiary mb-1">
                    Thư xin việc
                  </p>
                  <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.coverLetter}
                  </p>
                </div>
              )}

              <div className="p-4 bg-theme-background border border-theme-border-default rounded-xl space-y-3">
                <p className="text-xs text-theme-text-tertiary">
                  Ghi chú nội bộ (admin note)
                </p>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="input-dark w-full text-sm resize-none"
                  placeholder="Ghi chú lý do thay đổi trạng thái..."
                />
                <p className="text-xs text-theme-text-tertiary">
                  Cập nhật trạng thái
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s, adminNote || undefined)}
                      disabled={updatingId === selected.id}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                        selected.status === s
                          ? APP_STATUS_LABELS[s].color
                          : "border-theme-border-default text-theme-text-tertiary hover:text-theme-text-base bg-theme-surface"
                      }`}
                    >
                      {APP_STATUS_LABELS[s].label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-theme-text-tertiary text-center">
                Ngày nộp: {formatDate(selected.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
