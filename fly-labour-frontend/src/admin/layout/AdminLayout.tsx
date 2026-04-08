import { useState, useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Bell, X, Menu } from "lucide-react";
import AdminSidebar from "@/admin/layout/AdminSidebar";
import { useAuthStore } from "@/core/store/authStore";
import { applicationsApi } from "@/core/services/api";
import { APP_STATUS_LABELS, formatDate } from "@/core/utils/helpers";
import type { Application } from "@/core/types";

export default function AdminLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Application[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const loadNotifs = () => {
    setLoading(true);
    applicationsApi
      .getAll({ status: "pending", limit: 10 })
      .then((r) => {
        setNotifications(r.data.data);
        setUnread(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setNotifOpen((o) => !o);
    if (!notifOpen) setUnread(0);
  };

  // Class dùng chung để đồng bộ màu sắc Light/Dark
  const panelClasses =
    "bg-white dark:bg-brand-card border-slate-200 dark:border-brand-border transition-colors duration-300";
  const textPrimary = "text-slate-900 dark:text-white";
  const textMuted = "text-slate-500 dark:text-brand-muted";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0d1117] overflow-hidden transition-colors duration-300">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar modal */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] md:hidden flex">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex-none h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className={`flex items-center justify-between px-6 py-4 border-b bg-white/80 dark:bg-brand-card/80 backdrop-blur-md shrink-0 transition-colors duration-300 border-slate-200 dark:border-brand-border`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <p
                className={`text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-brand-muted`}
              >
                Fly Labour — Hệ quản trị Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Bell button & Dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={handleOpen}
                className={`relative w-10 h-10 rounded-xl bg-white dark:bg-brand-card border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:border-amber-400 dark:hover:border-brand-gold hover:text-amber-600 dark:hover:text-brand-gold transition-all shadow-sm`}
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-bounce">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <Bell
                        size={15}
                        className="text-amber-500 dark:text-brand-gold"
                      />
                      <span className={`font-bold ${textPrimary} text-sm`}>
                        Thông báo mới
                      </span>
                    </div>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* List Container */}
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {loading ? (
                      <div className="p-4 space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-4xl mb-3 opacity-50">📭</p>
                        <p className={`${textMuted} text-sm font-medium`}>
                          Tất cả đã được xử lý!
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {notifications.map((app) => (
                          <div
                            key={app.id}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group"
                          >
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-900 font-bold text-xs shrink-0 shadow-sm"
                              style={{
                                background:
                                  "linear-gradient(135deg,#e4a808,#fdd52f)",
                              }}
                            >
                              {app.fullName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[13px] leading-snug ${textPrimary} font-medium`}
                              >
                                <span className="text-amber-600 dark:text-brand-gold font-bold">
                                  {app.fullName}
                                </span>{" "}
                                ứng tuyển vị trí mới
                              </p>
                              <p
                                className={`text-[11px] truncate mt-1 font-medium ${textMuted}`}
                              >
                                Job: {app.job?.title}
                              </p>
                              <p className="text-[10px] mt-1.5 text-slate-400 font-medium">
                                {formatDate(app.createdAt)}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 text-[10px] px-2 py-1 rounded-md border font-bold uppercase tracking-wider ${APP_STATUS_LABELS[app.status]?.color} bg-white dark:bg-black/20`}
                            >
                              {APP_STATUS_LABELS[app.status]?.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 bg-slate-50 dark:bg-black/10 border-t border-slate-100 dark:border-white/5">
                    <a
                      href="/admin/applications"
                      className="flex items-center justify-center w-full py-2.5 rounded-xl text-xs text-amber-600 dark:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 transition-all font-bold uppercase tracking-widest"
                      onClick={() => setNotifOpen(false)}
                    >
                      Xem tất cả đơn tuyển
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p className={`text-xs font-bold ${textPrimary}`}>
                  {user?.fullName}
                </p>
                <p className="text-[10px] text-amber-600 dark:text-brand-gold font-bold uppercase tracking-tighter">
                  Super Admin
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shadow-md"
                style={{
                  background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                }}
              >
                {user?.fullName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50 dark:bg-transparent">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
