import { useState, useRef, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Newspaper,
  Loader2,
} from "lucide-react";
import type { News } from "@/core/types";
import { formatDate } from "@/core/utils/helpers";
import toast from "react-hot-toast";
import { newsApi, getImageUrl } from "@/core/services/api";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
  imagePreview: string;
};

const EMPTY: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  isPublished: true,
  imagePreview: "",
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imgTab, setImgTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileObj = useRef<File | null>(null);

  const loadNews = () => {
    setLoading(true);
    newsApi
      .getAllAdmin()
      .then((r) => setNews(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNews();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setEditing(null);
    setUrlInput("");
    fileObj.current = null;
    setModal("add");
  };

  const openEdit = (n: News) => {
    setForm({
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt || "",
      content: n.content || "",
      isPublished: n.isPublished,
      imagePreview: n.image || "",
    });
    setUrlInput(n.image?.startsWith("http") ? n.image : "");
    fileObj.current = null;
    setEditing(n);
    setModal("edit");
  };

  const setField =
    (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setForm((f) => ({
        ...f,
        [k]: val,
        ...(k === "title" && !editing ? { slug: slugify(val) } : {}),
      }));
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh tối đa 5MB");
      return;
    }
    fileObj.current = file;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((f) => ({ ...f, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const applyUrl = () => {
    if (!urlInput.trim()) return;
    fileObj.current = null;
    setForm((f) => ({ ...f, imagePreview: urlInput.trim() }));
    toast.success("Đã áp dụng URL ảnh");
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!form.slug) {
      toast.error("Vui lòng nhập slug");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.content) fd.append("content", form.content);
      fd.append("isPublished", form.isPublished ? "true" : "false");
      if (fileObj.current) {
        fd.append("image", fileObj.current);
      } else if (imgTab === "url" && urlInput.trim()) {
        fd.set("image", urlInput.trim());
      }
      if (modal === "edit" && editing) {
        await newsApi.update(editing.id, fd);
        toast.success("Đã cập nhật bài viết");
      } else {
        await newsApi.create(fd);
        toast.success("Đã đăng bài viết");
      }
      setModal(null);
      loadNews();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await newsApi.remove(id);
      toast.success("Đã xóa bài viết");
      setDeleting(null);
      loadNews();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleTogglePublish = async (n: News) => {
    try {
      const fd = new FormData();
      fd.append("isPublished", (!n.isPublished).toString());
      await newsApi.update(n.id, fd);
      loadNews();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm transition-colors duration-300";
  const inputClasses =
    "w-full text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Newspaper className="text-amber-600 dark:text-brand-gold" />
            Quản lý Tin tức
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm mt-1 font-medium">
            {news.length} bài viết ·{" "}
            <span className="text-green-600 dark:text-green-400 font-bold">
              {news.filter((n) => n.isPublished).length} bài công khai
            </span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} /> Thêm bài viết mới
        </button>
      </div>

      <div className={`${cardClasses} overflow-hidden`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                <th className="text-left px-5 py-4 w-16 text-center">Ảnh</th>
                <th className="text-left px-5 py-4">Nội dung bài viết</th>
                <th className="text-left px-5 py-4 hidden md:table-cell">
                  Slug (URL)
                </th>
                <th className="text-left px-5 py-4 hidden sm:table-cell">
                  Ngày tạo
                </th>
                <th className="text-left px-5 py-4">Trạng thái</th>
                <th className="text-right px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-8 text-center">
                      <Loader2 className="animate-spin inline-block text-amber-500" />
                    </td>
                  </tr>
                ))
              ) : news.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-20 text-center text-slate-400 font-medium italic"
                  >
                    Hệ thống chưa có bài viết nào
                  </td>
                </tr>
              ) : (
                news.map((n) => (
                  <tr
                    key={n.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-brand-dark border border-slate-200 dark:border-white/5 flex-shrink-0 shadow-sm">
                        {n.image ? (
                          <img
                            src={getImageUrl(n.image)}
                            alt=""
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-brand-muted">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors">
                        {n.title}
                      </p>
                      {n.excerpt && (
                        <p className="text-slate-400 dark:text-brand-muted text-[11px] font-medium line-clamp-1 mt-0.5 italic">
                          "{n.excerpt}"
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <code className="text-[10px] font-bold text-amber-700 dark:text-brand-gold bg-amber-50 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/30 px-2 py-1 rounded-md uppercase tracking-tighter">
                        /{n.slug}
                      </code>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="text-slate-500 dark:text-brand-muted text-xs font-medium">
                        {formatDate(n.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleTogglePublish(n)}
                        className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full border font-black uppercase tracking-widest transition-all ${
                          n.isPublished
                            ? "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
                            : "text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {n.isPublished ? (
                          <>
                            <Eye size={12} /> Công khai
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> Đang ẩn
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(n)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleting(n.id)}
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

      {/* ── Modal Thêm / Sửa ── */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 shrink-0 bg-white dark:bg-brand-card">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Newspaper className="text-amber-600" />
                {modal === "add" ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Image Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Hình ảnh bài viết
                </p>
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/40 group">
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-brand-muted gap-2">
                      <ImageIcon size={40} className="opacity-20" />
                      <p className="text-xs font-medium">Chưa chọn hình ảnh</p>
                    </div>
                  )}
                  {form.imagePreview && (
                    <button
                      onClick={() => {
                        setForm((f) => ({ ...f, imagePreview: "" }));
                        setUrlInput("");
                        fileObj.current = null;
                      }}
                      className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setImgTab("upload")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${imgTab === "upload" ? "bg-slate-900 text-white border-slate-900 dark:bg-brand-gold dark:text-amber-900 dark:border-brand-gold" : "bg-white dark:bg-black/20 text-slate-500 border-slate-200 dark:border-white/5"}`}
                  >
                    TẢI TỪ MÁY
                  </button>
                  <button
                    onClick={() => setImgTab("url")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${imgTab === "url" ? "bg-slate-900 text-white border-slate-900 dark:bg-brand-gold dark:text-amber-900 dark:border-brand-gold" : "bg-white dark:bg-black/20 text-slate-500 border-slate-200 dark:border-white/5"}`}
                  >
                    DÙNG LINK URL
                  </button>
                </div>

                {imgTab === "upload" ? (
                  <label className="w-full border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-brand-gold/40 rounded-2xl py-6 flex flex-col items-center gap-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer">
                    <Upload size={24} />{" "}
                    <span className="text-sm font-bold">
                      Chọn tệp hình ảnh (.jpg, .png, .webp)
                    </span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className={`${inputClasses} h-11`}
                      placeholder="Dán link ảnh từ Unsplash, Google..."
                    />
                    <button
                      onClick={applyUrl}
                      className="bg-slate-900 dark:bg-brand-gold text-white dark:text-amber-900 px-5 rounded-xl font-bold text-sm"
                    >
                      Lấy ảnh
                    </button>
                  </div>
                )}
              </div>

              {/* Form Content */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Tiêu đề bài viết *
                  </label>
                  <input
                    value={form.title}
                    onChange={setField("title")}
                    className={`${inputClasses} h-12`}
                    placeholder="VD: Chính sách visa Úc mới năm 2026"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Đường dẫn URL (Slug) *
                  </label>
                  <input
                    value={form.slug}
                    onChange={setField("slug")}
                    className={`${inputClasses} h-12 font-mono`}
                    placeholder="chinh-sach-visa-uc-2026"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Tóm tắt ngắn
                  </label>
                  <textarea
                    value={form.excerpt}
                    onChange={setField("excerpt")}
                    className={`${inputClasses} py-3 h-24 resize-none`}
                    placeholder="Mô tả sơ lược về bài viết hiển thị tại trang danh sách..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Nội dung chi tiết
                  </label>
                  <textarea
                    value={form.content}
                    onChange={setField("content")}
                    className={`${inputClasses} py-3 h-48 resize-none`}
                    placeholder="Viết nội dung bài viết tại đây..."
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group py-2">
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors ${form.isPublished ? "bg-green-500" : "bg-slate-200 dark:bg-white/10"}`}
                  >
                    <div
                      className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.isPublished ? "left-6" : "left-1"}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isPublished: e.target.checked }))
                    }
                    className="hidden"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-tighter">
                    Hiển thị công khai
                  </span>
                </label>
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
                className="flex-[2] h-12 btn-primary font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {saving
                  ? "Đang xử lý..."
                  : modal === "add"
                    ? "Đăng bài ngay"
                    : "Cập nhật bài viết"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Bài viết này sẽ bị xóa vĩnh viễn khỏi hệ thống."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
