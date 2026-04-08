import { useState, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Save,
  FileText,
  ListOrdered,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { settingsApi } from "@/core/services/api";

interface Policy {
  slug: string;
  title: string;
  displayInFooter: boolean;
  content: string;
  order: number;
}

const DEFAULT_POLICIES: Policy[] = [
  {
    slug: "terms-of-service",
    title: "Điều khoản sử dụng",
    displayInFooter: true,
    content: "Nội dung Điều khoản sử dụng...",
    order: 1,
  },
  {
    slug: "privacy-policy",
    title: "Chính sách bảo mật",
    displayInFooter: true,
    content: "Nội dung Chính sách bảo mật...",
    order: 2,
  },
  {
    slug: "return-policy",
    title: "Chính sách hoàn tiền",
    displayInFooter: true,
    content: "Nội dung Chính sách hoàn tiền...",
    order: 3,
  },
  {
    slug: "contact-policy",
    title: "Chính sách liên hệ",
    displayInFooter: false,
    content: "Nội dung Chính sách liên hệ...",
    order: 4,
  },
];

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [form, setForm] = useState<Policy>({
    slug: "",
    title: "",
    displayInFooter: true,
    content: "",
    order: 1,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const result = await settingsApi.getAll();
      const policiesData = result?.data?.policies
        ? JSON.parse(result.data.policies)
        : DEFAULT_POLICIES;
      setPolicies(policiesData);
    } catch {
      setPolicies(DEFAULT_POLICIES);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({
      slug: "",
      title: "",
      displayInFooter: true,
      content: "",
      order: policies.length + 1,
    });
    setEditing(null);
    setModal("add");
  };

  const openEditModal = (policy: Policy) => {
    setForm(policy);
    setEditing(policy);
    setModal("edit");
  };

  const handleSave = async () => {
    if (!form.slug.trim() || !form.title.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setSaving(true);
    try {
      let updated: Policy[];
      if (modal === "add") {
        updated = [...policies, form];
      } else {
        updated = policies.map((p) => (p.slug === editing?.slug ? form : p));
      }
      updated.sort((a, b) => a.order - b.order);

      await settingsApi.save({ policies: JSON.stringify(updated) });
      setPolicies(updated);
      setModal(null);
      toast.success(
        modal === "add" ? "Thêm chính sách thành công" : "Cập nhật thành công",
      );
    } catch (err) {
      toast.error("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    setDeleting(slug);
    try {
      const updated = policies.filter((p) => p.slug !== slug);
      await settingsApi.save({ policies: JSON.stringify(updated) });
      setPolicies(updated);
      toast.success("Xóa thành công");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleting(null);
      setConfirmDeleteSlug(null);
    }
  };

  const handleToggleVisibility = async (slug: string) => {
    try {
      const updated = policies.map((p) =>
        p.slug === slug ? { ...p, displayInFooter: !p.displayInFooter } : p,
      );
      await settingsApi.save({ policies: JSON.stringify(updated) });
      setPolicies(updated);
      toast.success("Cập nhật thành công");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm transition-colors duration-300";
  const inputClasses =
    "w-full h-12 text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <Loader2 size={32} className="animate-spin mb-4 text-amber-500" />
        <p className="font-medium animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="text-amber-600 dark:text-brand-gold" />
            Quản lý Điều khoản & Chính sách
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm mt-1">
            Chỉnh sửa nội dung pháp lý hiển thị tại Footer và các trang tĩnh
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} /> Thêm mới chính sách
        </button>
      </div>

      {/* Table */}
      <div className={`${cardClasses} overflow-hidden`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                <th className="text-left px-6 py-4">Tiêu đề chính sách</th>
                <th className="text-left px-6 py-4">Đường dẫn (Slug)</th>
                <th className="text-center px-6 py-4">Hiển thị Footer</th>
                <th className="text-center px-6 py-4 w-24">Thứ tự</th>
                <th className="text-right px-6 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {policies.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-slate-400 italic"
                  >
                    Chưa có dữ liệu chính sách nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr
                    key={p.slug}
                    className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors">
                        {p.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[10px] font-bold text-amber-700 dark:text-brand-gold bg-amber-50 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/30 px-2 py-1 rounded-md uppercase tracking-tighter">
                        /policy/{p.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleVisibility(p.slug)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          p.displayInFooter
                            ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-500/20"
                            : "bg-slate-50 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {p.displayInFooter ? (
                          <Eye size={12} />
                        ) : (
                          <EyeOff size={12} />
                        )}
                        {p.displayInFooter ? "Hiển thị" : "Ẩn"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5 font-mono text-xs font-bold text-slate-600 dark:text-white">
                        <ListOrdered size={12} className="opacity-40" />
                        {p.order}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteSlug(p.slug)}
                          disabled={deleting === p.slug}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 shrink-0 bg-white dark:bg-brand-card">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <FileText className="text-amber-600" />
                {modal === "add"
                  ? "Thêm chính sách mới"
                  : "Chỉnh sửa chính sách"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Tiêu đề chính sách *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      setForm({ ...form, title, slug: slug || "policy" });
                    }}
                    className={inputClasses}
                    placeholder="VD: Điều khoản sử dụng"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className={`${inputClasses} font-mono`}
                    placeholder="terms-of-service"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: parseInt(e.target.value) || 1 })
                    }
                    className={inputClasses}
                    min={1}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer group p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5 w-full">
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${form.displayInFooter ? "bg-amber-500" : "bg-slate-200 dark:bg-white/10"}`}
                    >
                      <div
                        className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.displayInFooter ? "left-6" : "left-1"}`}
                      />
                    </div>
                    <input
                      type="checkbox"
                      checked={form.displayInFooter}
                      onChange={(e) =>
                        setForm({ ...form, displayInFooter: e.target.checked })
                      }
                      className="hidden"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-tighter">
                      Hiện ở Footer
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Nội dung chi tiết *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className={`${inputClasses} py-3 h-64 resize-none leading-relaxed`}
                  placeholder="Nhập nội dung quy định, chính sách..."
                />
                <p className="text-[10px] text-slate-400 italic">
                  Hệ thống hỗ trợ định dạng văn bản Markdown.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 h-12 rounded-2xl font-bold border border-slate-200 dark:border-brand-border text-slate-600 dark:text-white hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] h-12 btn-primary font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {modal === "add" ? "Thêm chính sách" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteSlug && (
        <ConfirmDeleteModal
          message="Hành động này sẽ xóa vĩnh viễn chính sách khỏi hệ thống. Các liên kết footer liên quan cũng sẽ bị gỡ bỏ."
          onConfirm={() => handleDelete(confirmDeleteSlug)}
          onCancel={() => setConfirmDeleteSlug(null)}
        />
      )}
    </div>
  );
}
