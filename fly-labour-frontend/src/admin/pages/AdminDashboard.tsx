import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Users, Briefcase, ClipboardList, Eye, TrendingUp } from "lucide-react";
import { jobsApi, applicationsApi, usersApi } from "@/core/services/api";
import { APP_STATUS_LABELS, formatDate } from "@/core/utils/helpers";
import { useThemeStore } from "@/core/store/themeStore";
import type { Application } from "@/core/types";

const PIE_COLORS = ["#fdd52f", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6"];
const MONTHLY_DATA = [
  { month: "T8", apps: 28, users: 65 },
  { month: "T9", apps: 42, users: 80 },
  { month: "T10", apps: 35, users: 72 },
  { month: "T11", apps: 61, users: 95 },
  { month: "T12", apps: 78, users: 110 },
  { month: "T1", apps: 89, users: 143 },
];

export default function AdminDashboard() {
  const [jobStats, setJobStats] = useState<any>(null);
  const [appStats, setAppStats] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeStore();

  useEffect(() => {
    Promise.all([
      jobsApi.getStats(),
      applicationsApi.getStats(),
      usersApi.getStats(),
      applicationsApi.getAll({ limit: 5 }),
    ])
      .then(([jobs, apps, users, recent]) => {
        setJobStats(jobs.data);
        setAppStats(apps.data);
        setUserStats(users.data);
        setRecentApps(recent.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalApps = appStats.reduce((s, i) => s + parseInt(i.count), 0);
  const pendingCount = appStats.find((i) => i.status === "pending")?.count || 0;

  const STAT_CARDS = [
    {
      label: "Tổng người dùng",
      value: userStats?.total ?? "—",
      sub: `+${userStats?.thisMonth ?? 0} tháng này`,
      icon: Users,
      color: "#d97706", // Amber 600
    },
    {
      label: "Tổng bài đăng",
      value: jobStats?.totalJobs ?? "—",
      sub: `${jobStats?.activeJobs ?? 0} đang hoạt động`,
      icon: Briefcase,
      color: "#2563eb", // Blue 600
    },
    {
      label: "Đơn ứng tuyển",
      value: totalApps || "—",
      sub: `${pendingCount} chờ xét duyệt`,
      icon: ClipboardList,
      color: "#0891b2", // Cyan 600
    },
    {
      label: "Lượt xem tổng",
      value: jobStats?.totalViews ?? "—",
      sub: "Tất cả bài đăng",
      icon: Eye,
      color: "#7c3aed", // Violet 600
    },
  ];

  const byCountry = [
    {
      name: "🇦🇺 Úc",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "australia")
          ?.count || 0,
    },
    {
      name: "🇨🇦 Canada",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "canada")?.count ||
        0,
    },
    {
      name: "🇳🇿 NZ",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "new_zealand")
          ?.count || 0,
    },
  ];

  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none transition-all duration-300";
  const textMuted = "text-slate-400 dark:text-brand-muted";
  const chartTickColor = theme === "dark" ? "#94a3b8" : "#64748b";

  if (loading)
    return (
      <div className="space-y-7 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-white/10 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-brand-card rounded-2xl border border-slate-200 dark:border-brand-border"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-8 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-brand-muted text-sm mt-1">
          Hệ thống ghi nhận{" "}
          <span className="font-bold text-amber-600 dark:text-brand-gold">
            {totalApps}
          </span>{" "}
          đơn ứng tuyển mới
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className={`${cardClasses} p-5 group hover:border-amber-400/50`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: `${card.color}15` }}
              >
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <div className="p-1.5 bg-green-50 dark:bg-green-500/10 rounded-lg">
                <TrendingUp
                  size={14}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">
              {card.value}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-brand-muted">
              {card.label}
            </p>
            <p className="text-xs font-semibold text-amber-600 dark:text-brand-gold mt-2">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className={`${cardClasses} p-6 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Tăng trưởng ứng tuyển & Người dùng
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-slate-400">
              6 tháng gần nhất
            </span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MONTHLY_DATA}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={theme === "dark" ? "#334155" : "#e2e8f0"}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: chartTickColor, fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: chartTickColor, fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: theme === "dark" ? "#1e293b" : "#f8fafc" }}
                  contentStyle={{
                    background: theme === "dark" ? "#0f172a" : "#ffffff",
                    border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="apps"
                  name="Đơn ứng tuyển"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="users"
                  name="Người dùng"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className={`${cardClasses} p-6 flex flex-col`}>
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
            Thị trường chính
          </h3>
          <p className={`${textMuted} text-xs mb-6`}>
            Phân bổ việc làm theo quốc gia
          </p>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={byCountry}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {byCountry.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-6">
            {byCountry.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-black/20"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: PIE_COLORS[i] }}
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                    {c.name}
                  </span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Status */}
        <div className={`${cardClasses} p-6`}>
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-6">
            Quy trình tuyển dụng
          </h3>
          <div className="space-y-5">
            {appStats.map((item) => (
              <div key={item.status} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${APP_STATUS_LABELS[item.status as keyof typeof APP_STATUS_LABELS]?.color} bg-white dark:bg-black/20`}
                  >
                    {
                      APP_STATUS_LABELS[
                        item.status as keyof typeof APP_STATUS_LABELS
                      ]?.label
                    }
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {item.count}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${totalApps ? (parseInt(item.count) / totalApps) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className={`${cardClasses} p-6 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Đơn ứng tuyển mới nhất
            </h3>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-amber-600 dark:text-brand-gold hover:underline transition-colors"
            >
              Quản lý tất cả →
            </Link>
          </div>
          <div className="space-y-3">
            {recentApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl hover:border-amber-400/50 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shadow-sm"
                  style={{
                    background: "linear-gradient(135deg,#fdd52f,#e4a808)",
                  }}
                >
                  {app.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white font-bold text-sm truncate group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors">
                    {app.fullName}
                  </p>
                  <p className="text-slate-500 dark:text-brand-muted text-[11px] truncate mt-0.5">
                    Ứng tuyển:{" "}
                    <span className="font-semibold text-slate-700 dark:text-gray-300">
                      {app.job?.title}
                    </span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-1 rounded-md border ${APP_STATUS_LABELS[app.status]?.color} bg-white dark:bg-brand-card`}
                  >
                    {APP_STATUS_LABELS[app.status]?.label}
                  </span>
                  <p className="text-slate-400 dark:text-brand-muted text-[10px] mt-1.5 font-medium">
                    {formatDate(app.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {recentApps.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 dark:text-brand-muted text-sm italic">
                  Chưa có đơn ứng tuyển nào được ghi nhận
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
