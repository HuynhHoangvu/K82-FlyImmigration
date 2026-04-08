import { useState, useRef, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  Image as ImageIcon,
  Clock,
  Briefcase,
  Search,
  Filter,
  DollarSign,
} from "lucide-react";
import type { Category, Job } from "@/core/types";
import {
  getCountryLabels,
  JOBTYPE_LABELS,
  formatSalary,
  formatDate,
} from "@/core/utils/helpers";
import toast from "react-hot-toast";
import { categoriesApi, jobsApi, getImageUrl } from "@/core/services/api";

const STATUS_COLORS = {
  active: "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20",
  paused: "text-amber-600 bg-amber-50 border-amber-200 dark:text-yellow-400 dark:bg-yellow-400/10 dark:border-yellow-400/20",
  closed: "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20",
  draft: "text-slate-500 bg-slate-100 border-slate-200 dark:text-gray-400 dark:bg-gray-400/10 dark:border-gray-400/20",
  pending_review: "text-orange-600 bg-orange-50 border-orange-200 dark:text-amber-400 dark:bg-orange-400/10 dark:border-amber-400/20",
};

const STATUS_LABELS = {
  active: "Hoạt động",
  paused: "Tạm dừng",
  closed: "Đã đóng",
  draft: "Nháp",
  pending_review: "Chờ duyệt",
};

const PRESET_COUNTRIES = [
  { value: "australia", label: "🇦🇺 Úc (Australia)" },
  { value: "canada", label: "🇨🇦 Canada" },
  { value: "new_zealand", label: "🇳🇿 New Zealand" },
  { value: "uk", label: "🇬🇧 Anh Quốc (UK)" },
  { value: "germany", label: "🇩🇪 Đức (Germany)" },
  { value: "japan", label: "🇯🇵 Nhật Bản (Japan)" },
  { value: "norway", label: "🇳🇴 Na Uy (Norway)" },
  { value: "portugal", label: "🇵🇹 Bồ Đào Nha (Portugal)" },
  { value: "czech", label: "🇨🇿 Séc (Czech Republic)" },
  { value: "us", label: "🇺🇸 Mỹ (USA)" },
  { value: "singapore", label: "🇸🇬 Singapore" },
  { value: "south_korea", label: "🇰🇷 Hàn Quốc (Korea)" },
  { value: "taiwan", label: "🇹🇼 Đài Loan (Taiwan)" },
  { value: "uae", label: "🇦🇪 UAE" },
  { value: "__other__", label: "✏️ Khác (nhập tay)..." },
];

type FormData = {
  title: string;
  company: string;
  location: string;
  country: string;
  countryCustom: string;
  jobType: string;
  status: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  slots: string;
  deadline: string;
  isHot: boolean;
  isFeatured: boolean;
  categoryId: string;
  description: string;
  requirements: string;
  benefits: string;
  imagePreview: string;
};

const EMPTY_FORM: FormData = {
  title: "",
  company: "",
  location: "",
  country: "australia",
  countryCustom: "",
  jobType: "full_time",
  status: "active",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "AUD",
  slots: "",
  deadline: "",
  isHot: false,
  isFeatured: false,
  categoryId: "",
  description: "",
  requirements: "",
  benefits: "",
  imagePreview: "",
};

const SUGGESTED_IMAGES: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=75",
  "2": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=75",
  "3": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=75",
  "4": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=75",
  "5": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=75",
  "6": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=75",
  "7": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=75",
  "8": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=75",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imgTab, setImgTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState<"hourly" | "weekly" | "monthly" | "yearly">("monthly");
  const [tableSalaryPeriod, setTableSalaryPeriod] = useState<"hourly" | "weekly" | "monthly" | "yearly">("monthly");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileObjRef = useRef<File | null>(null);

  const pendingJobs = jobs.filter((j) => j.status === "pending_review");
  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getSalaryEstimates = (value: number, period: string) => {
    let monthly: number;
    switch (period) {
      case "hourly": monthly = (value * 40 * 52) / 12; break;
      case "weekly": monthly = (value * 52) / 12; break;
      case "yearly": monthly = value / 12; break;
      default: monthly = value;
    }
    const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(0);
    return {
      hourly: fmt(monthly / ((40 * 52) / 12)),
      weekly: fmt((monthly * 12) / 52),
      monthly: fmt(monthly),
      yearly: fmt(monthly * 12),
    };
  };

  const openAdd = () => {
    const lastCurrency = localStorage.getItem("lastSalaryCurrency") || "AUD";
    setForm({ ...EMPTY_FORM, salaryCurrency: lastCurrency });
    setEditing(null);
    setUrlInput("");
    fileObjRef.current = null;
    setSalaryPeriod("monthly");
    setModal("add");
  };

  const openEdit = (job: Job) => {
    const isPreset = PRESET_COUNTRIES.some((c) => c.value === job.country && c.value !== "__other__");
    setForm({
      ...EMPTY_FORM,
      title: job.title,
      company: job.company || "",
      location: job.location || "",
      country: isPreset ? job.country : "__other__",
      countryCustom: isPreset ? "" : job.country || "",
      jobType: job.jobType,
      status: job.status,
      salaryMin: job.salaryMin?.toString() || "",
      salaryMax: job.salaryMax?.toString() || "",
      salaryCurrency: job.salaryCurrency || "AUD",
      slots: job.slots?.toString() || "",
      deadline: job.deadline?.slice(0, 10) || "",
      isHot: job.isHot,
      isFeatured: job.isFeatured,
      categoryId: job.categoryId || "",
      description: job.description,
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      imagePreview: job.image || "",
    });
    setUrlInput(job.image || "");
    fileObjRef.current = null;
    setEditing(job);
    setModal("edit");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Ảnh tối đa 10MB"); return; }
    fileObjRef.current = file;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const applyUrlInput = () => {
    if (!urlInput.trim()) return;
    setForm((f) => ({ ...f, imagePreview: urlInput.trim() }));
    toast.success("Đã áp dụng URL ảnh");
  };

  const useSuggestedImage = (catId: string) => {
    const url = SUGGESTED_IMAGES[catId];
    if (url) {
      setForm((f) => ({ ...f, imagePreview: url }));
      setUrlInput(url);
    }
  };

  const loadJobs = () => {
    setLoading(true);
    jobsApi.getAllAdmin({ search, limit: 50 })
      .then((r) => { setJobs(r.data.data); setTotal(r.data.meta.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    categoriesApi.getAllAdmin().then((r) => setCats(r.data)).catch(() => {});
    loadJobs();
  }, [search]);

  const handleSave = async () => {
    if (!form.title) { toast.error("Vui lòng nhập tiêu đề"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      const skipKeys = ["imagePreview", "countryCustom"];
      Object.entries(form).forEach(([k, v]) => {
        if (skipKeys.includes(k)) return;
        if (v === "" || v === undefined || v === null) return;
        fd.append(k, String(v));
      });
      if (form.country === "__other__") {
        if (!form.countryCustom.trim()) { toast.error("Vui lòng nhập tên quốc gia"); setSaving(false); return; }
        fd.set("country", form.countryCustom.trim());
      }
      if (imgTab === "upload" && fileObjRef.current) fd.append("image", fileObjRef.current);
      else if (imgTab === "url" && urlInput.trim()) fd.set("image", urlInput.trim());

      if (!form.categoryId || form.categoryId.length < 10) fd.delete("categoryId");

      if (modal === "edit" && editing) {
        await jobsApi.update(editing.id, fd);
        toast.success("Đã cập nhật bài đăng");
      } else {
        await jobsApi.create(fd);
        toast.success("Đã thêm bài đăng mới");
      }
      setModal(null);
      loadJobs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu bài đăng");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await jobsApi.remove(id);
      toast.success("Đã xóa bài đăng");
      setDeleting(null);
      loadJobs();
    } catch { toast.error("Xóa thất bại"); }
  };

  const handleApprove = async (id: string) => {
    try {
      await jobsApi.approveJob(id);
      toast.success("Đã duyệt bài đăng");
      loadJobs();
    } catch { toast.error("Duyệt thất bại"); }
  };

  const handleReject = async (id: string) => {
    try {
      await jobsApi.rejectJob(id);
      toast.success("Đã từ chối bài đăng");
      loadJobs();
    } catch { toast.error("Từ chối thất bại"); }
  };

  const setField = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value;
    localStorage.setItem("lastSalaryCurrency", currency);
    setForm((f) => ({ ...f, salaryCurrency: currency }));
  };

  // UI Helpers
  const cardClasses = "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm transition-colors";
  const inputClasses = "w-full text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 transition-colors duration-300">
      {/* Header Area */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Quản lý Việc làm
            {pendingJobs.length > 0 && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-400/30 font-black uppercase tracking-widest animate-pulse">
                {pendingJobs.length} đơn chờ duyệt
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm mt-1">Tổng cộng {total} tin tuyển dụng trên hệ thống</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-amber-500/20">
          <Plus size={18} /> Đăng bài mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: "Tất cả", count: jobs.length },
          { value: "pending_review", label: "⌛ Chờ duyệt", count: pendingJobs.length },
          { value: "active", label: "✅ Hoạt động", count: jobs.filter(j => j.status === 'active').length },
          { value: "paused", label: "⏸ Tạm dừng", count: jobs.filter(j => j.status === 'paused').length },
          { value: "closed", label: "❌ Đã đóng", count: jobs.filter(j => j.status === 'closed').length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
              statusFilter === tab.value
                ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20"
                : "bg-white dark:bg-brand-card border-slate-200 dark:border-white/10 text-slate-500 dark:text-brand-muted hover:border-amber-400"
            }`}
          >
            {tab.label} <span className="ml-1 opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Toolbar Area */}
      <div className={`${cardClasses} p-4 flex flex-wrap gap-4 items-center`}>
        <div className="relative flex-1 min-w-[280px] max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClasses}
            placeholder="Tìm theo tên công việc, công ty..."
          />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đổi đơn vị lương:</span>
          <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
            {(["hourly", "weekly", "monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setTableSalaryPeriod(p)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  tableSalaryPeriod === p ? "bg-white dark:bg-brand-gold shadow-sm text-amber-700 dark:text-amber-900" : "text-slate-500 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {{ hourly: "Giờ", weekly: "Tuần", monthly: "Tháng", yearly: "Năm" }[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={`${cardClasses} overflow-hidden`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                <th className="text-left px-5 py-4 w-16 text-center">Ảnh</th>
                <th className="text-left px-5 py-4">Công việc</th>
                <th className="text-left px-5 py-4 hidden sm:table-cell">Quốc gia</th>
                <th className="text-left px-5 py-4 hidden md:table-cell">Lương ({tableSalaryPeriod})</th>
                <th className="text-left px-5 py-4 hidden lg:table-cell">Nguồn</th>
                <th className="text-left px-5 py-4">Trạng thái</th>
                <th className="text-right px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                [...Array(6)].map((_, i) => <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-12 bg-slate-50 dark:bg-white/5 rounded-xl animate-pulse" /></td></tr>)
              ) : filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-brand-dark border border-slate-200 dark:border-white/5 flex-shrink-0 shadow-sm">
                      {job.image ? (
                        <img src={getImageUrl(job.image)} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-brand-muted"><ImageIcon size={18} /></div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors">{job.title}</p>
                      <p className="text-slate-500 dark:text-brand-muted text-[11px] font-medium">{job.company}</p>
                      <div className="flex gap-1.5 mt-1">
                        {job.isHot && <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase shadow-sm shadow-red-500/20">Hot</span>}
                        {job.isFeatured && <span className="bg-amber-100 dark:bg-brand-gold/20 text-amber-700 dark:text-brand-gold text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-200 dark:border-brand-gold/30 uppercase">Nổi bật</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="badge-country border-slate-200 dark:border-transparent text-[10px]">{getCountryLabels()[job.country]}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-amber-700 dark:text-brand-gold font-bold text-xs">
                      {job.salaryMin || job.salaryMax ? (() => {
                        const cur = job.salaryCurrency || "";
                        if (tableSalaryPeriod === "monthly") return formatSalary(job.salaryMin, job.salaryMax, cur);
                        const minE = job.salaryMin ? getSalaryEstimates(job.salaryMin, "monthly")[tableSalaryPeriod] : null;
                        const maxE = job.salaryMax ? getSalaryEstimates(job.salaryMax, "monthly")[tableSalaryPeriod] : null;
                        return [minE, maxE].filter(Boolean).join(" – ") + " " + cur;
                      })() : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-slate-700 dark:text-gray-300 text-[11px] font-bold truncate max-w-[140px]">{job.createdBy?.companyName || job.createdBy?.fullName || "Hệ thống"}</p>
                      <span className={`text-[9px] font-bold uppercase tracking-tighter ${job.createdBy ? "text-blue-500" : "text-amber-500"}`}>{job.createdBy ? "Đối tác" : "Nội bộ"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wider ${STATUS_COLORS[job.status] || ""}`}>
                      {STATUS_LABELS[job.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {job.status === "pending_review" && (
                        <>
                          <button onClick={() => handleApprove(job.id)} title="Duyệt bài" className="p-2 rounded-xl bg-green-50 dark:bg-green-400/10 text-green-600 hover:bg-green-100 transition-all"><CheckCircle size={16} /></button>
                          <button onClick={() => handleReject(job.id)} title="Từ chối" className="p-2 rounded-xl bg-red-50 dark:bg-red-400/10 text-red-600 hover:bg-red-100 transition-all"><XCircle size={16} /></button>
                        </>
                      )}
                      <button onClick={() => openEdit(job)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold transition-all"><Pencil size={16} /></button>
                      <button onClick={() => setDeleting(job.id)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ Add/Edit Modal ══ */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 shrink-0">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Briefcase className="text-amber-600" />
                {modal === "add" ? "Đăng bài mới" : "Chỉnh sửa bài đăng"}
              </h2>
              <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Image Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hình ảnh đại diện</p>
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/40 group">
                  {form.imagePreview ? (
                    <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-brand-muted gap-2">
                      <ImageIcon size={40} className="opacity-20" />
                      <p className="text-xs font-medium">Chưa có hình ảnh</p>
                    </div>
                  )}
                  {form.imagePreview && (
                    <button onClick={() => { setForm((f) => ({ ...f, imagePreview: "" })); setUrlInput(""); fileObjRef.current = null; }}
                            className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setImgTab("upload")} className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${imgTab === "upload" ? "bg-slate-900 text-white border-slate-900 dark:bg-brand-gold dark:text-amber-900 dark:border-brand-gold" : "bg-white dark:bg-black/20 text-slate-500 border-slate-200 dark:border-white/5"}`}>UPLOAD FILE</button>
                  <button onClick={() => setImgTab("url")} className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${imgTab === "url" ? "bg-slate-900 text-white border-slate-900 dark:bg-brand-gold dark:text-amber-900 dark:border-brand-gold" : "bg-white dark:bg-black/20 text-slate-500 border-slate-200 dark:border-white/5"}`}>DÙNG LINK ẢNH</button>
                </div>

                {imgTab === "upload" ? (
                  <label className="w-full border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-brand-gold/40 rounded-2xl py-6 flex flex-col items-center gap-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer">
                    <Upload size={24} /> <span className="text-sm font-bold">Chọn tệp hình ảnh</span>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="flex gap-2">
                    <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className={`${inputClasses} h-11`} placeholder="Dán link ảnh từ Unsplash, Google..." />
                    <button onClick={applyUrlInput} className="bg-slate-900 dark:bg-brand-gold text-white dark:text-amber-900 px-4 rounded-xl font-bold text-sm">Lấy ảnh</button>
                  </div>
                )}
              </div>

              {/* Main Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiêu đề bài tuyển dụng *</label>
                  <input value={form.title} onChange={setField("title")} className={`${inputClasses} h-12`} placeholder="VD: Nam nhân viên kho lạnh tại Úc" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên doanh nghiệp</label>
                  <input value={form.company} onChange={setField("company")} className={`${inputClasses} h-12`} placeholder="VD: Harvest Australia Ltd" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Địa điểm cụ thể</label>
                  <input value={form.location} onChange={setField("location")} className={`${inputClasses} h-12`} placeholder="VD: Brisbane, QLD" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quốc gia mục tiêu *</label>
                  <select value={form.country} onChange={setField("country")} className={`${inputClasses} h-12 appearance-none`}>
                    {PRESET_COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  {form.country === "__other__" && <input value={form.countryCustom} onChange={e => setForm(f => ({ ...f, countryCustom: e.target.value }))} className={`${inputClasses} h-12 mt-2`} placeholder="Nhập tên quốc gia..." />}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại hình làm việc</label>
                  <select value={form.jobType} onChange={setField("jobType")} className={`${inputClasses} h-12 appearance-none`}>
                    {Object.entries(JOBTYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Salary Section */}
              <div className="p-5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-brand-gold font-bold text-xs uppercase tracking-widest">
                  <DollarSign size={14} /> Cấu hình mức lương
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400">Min</label>
                    <input type="number" value={form.salaryMin} onChange={setField("salaryMin")} className={`${inputClasses} h-11`} placeholder="3000" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400">Max</label>
                    <input type="number" value={form.salaryMax} onChange={setField("salaryMax")} className={`${inputClasses} h-11`} placeholder="4500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400">Tiền tệ</label>
                    <select value={form.salaryCurrency} onChange={handleCurrencyChange} className={`${inputClasses} h-11 appearance-none`}>
                      <option value="AUD">🇦🇺 AUD (Úc)</option>
                      <option value="CAD">🇨🇦 CAD (Canada)</option>
                      <option value="VND">🇻🇳 VND (Việt Nam)</option>
                      <option value="USD">🇺🇸 USD (Mỹ)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Đơn vị lương khi nhập liệu:</label>
                  <div className="flex gap-2">
                    {(["hourly", "weekly", "monthly", "yearly"] as const).map(p => (
                      <button key={p} onClick={() => setSalaryPeriod(p)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${salaryPeriod === p ? "bg-amber-600 border-amber-600 text-white" : "bg-white dark:bg-black/20 border-slate-200 dark:border-white/5 text-slate-500"}`}>
                        {{ hourly: "GIỜ", weekly: "TUẦN", monthly: "THÁNG", yearly: "NĂM" }[p]}
                      </button>
                    ))}
                  </div>
                </div>
                {(form.salaryMin || form.salaryMax) && (
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                      {["hourly", "weekly", "monthly", "yearly"].map(p => {
                         const estsMin = form.salaryMin ? getSalaryEstimates(Number(form.salaryMin), salaryPeriod) : null;
                         const estsMax = form.salaryMax ? getSalaryEstimates(Number(form.salaryMax), salaryPeriod) : null;
                         return (
                           <div key={p} className="p-2 text-center rounded-lg bg-white/50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                              <p className="text-[8px] font-bold text-slate-400 uppercase">{p}</p>
                              <p className="text-[10px] font-black text-slate-900 dark:text-white truncate">
                                {estsMin?.[p as keyof typeof estsMin] || "0"} - {estsMax?.[p as keyof typeof estsMax] || "0"}
                              </p>
                           </div>
                         )
                      })}
                   </div>
                )}
              </div>

              {/* Status & Categorization */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chỉ tiêu (Slot)</label>
                  <input type="number" value={form.slots} onChange={setField("slots")} className={`${inputClasses} h-12`} placeholder="Số lượng" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hạn nộp</label>
                  <input type="date" value={form.deadline} onChange={setField("deadline")} className={`${inputClasses} h-12 appearance-none`} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngành nghề</label>
                  <select value={form.categoryId} onChange={e => { setField("categoryId")(e); if (!form.imagePreview) useSuggestedImage(e.target.value); }} className={`${inputClasses} h-12 appearance-none`}>
                    <option value="">-- Chọn ngành --</option>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-2">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái tin đăng</label>
                    <select value={form.status} onChange={setField("status")} className={`${inputClasses} h-12 appearance-none font-bold`}>
                       {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                 </div>
                 <div className="flex gap-4 items-end pb-3">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" checked={form.isHot} onChange={e => setForm(f => ({ ...f, isHot: e.target.checked }))} className="w-5 h-5 accent-red-500 rounded-lg" />
                      <span className="text-sm font-bold text-slate-700 dark:text-white group-hover:text-red-500 transition-colors">🔥 HOT</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-5 h-5 accent-amber-500 rounded-lg" />
                      <span className="text-sm font-bold text-slate-700 dark:text-white group-hover:text-amber-500 transition-colors">⭐ NỔI BẬT</span>
                    </label>
                 </div>
              </div>

              <div className="space-y-5 pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mô tả công việc *</label>
                  <textarea value={form.description} onChange={setField("description")} className={`${inputClasses} h-32 py-3 resize-none`} placeholder="Nội dung công việc chính..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yêu cầu ứng tuyển</label>
                  <textarea value={form.requirements} onChange={setField("requirements")} className={`${inputClasses} h-24 py-3 resize-none`} placeholder="Kỹ năng, kinh nghiệm cần có..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quyền lợi đãi ngộ</label>
                  <textarea value={form.benefits} onChange={setField("benefits")} className={`${inputClasses} h-24 py-3 resize-none`} placeholder="Lương thưởng, bảo hiểm, hỗ trợ ăn ở..." />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 h-12 rounded-2xl font-bold border border-slate-200 dark:border-brand-border text-slate-600 dark:text-white hover:bg-white dark:hover:bg-white/5 transition-all">Hủy bỏ</button>
              <button onClick={handleSave} disabled={saving} className="flex-[2] h-12 btn-primary font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50">
                {saving ? "Đang xử lý..." : modal === "add" ? "Đăng bài tuyển dụng" : "Cập nhật bài viết"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Hành động này sẽ xóa vĩnh viễn tin tuyển dụng và toàn bộ hồ sơ ứng tuyển liên quan."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}