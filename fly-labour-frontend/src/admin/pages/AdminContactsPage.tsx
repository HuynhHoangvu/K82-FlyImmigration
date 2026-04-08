import { useState, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Mail,
  Trash2,
  CheckCircle,
  Eye,
  X,
  Phone,
  User,
  Clock,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";
import { contactApi } from "@/core/services/api";
import { formatDate } from "@/core/utils/helpers";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const load = () => {
    setLoading(true);
    contactApi
      .getAll()
      .then((r) => setContacts(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await contactApi.markRead(id);
      setContacts((cs) =>
        cs.map((c) => (c.id === id ? { ...c, isRead: true } : c)),
      );
      if (selected?.id === id)
        setSelected((s) => (s ? { ...s, isRead: true } : s));
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contactApi.remove(id);
      toast.success("Đã xóa liên hệ");
      setContacts((cs) => cs.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
      setDeleting(null);
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const openDetail = (c: Contact) => {
    setSelected(c);
    if (!c.isRead) handleMarkRead(c.id);
  };

  const filtered = contacts.filter((c) => {
    if (filter === "unread") return !c.isRead;
    if (filter === "read") return c.isRead;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm transition-colors";

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="text-amber-600 dark:text-brand-gold" />
            Quản lý liên hệ
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm mt-1">
            Tổng {contacts.length} liên hệ khách hàng
            {unreadCount > 0 && (
              <span className="ml-2 text-amber-600 dark:text-brand-gold font-bold">
                · {unreadCount} chưa phản hồi
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-white dark:bg-brand-gold shadow-sm text-amber-700 dark:text-amber-900"
                  : "text-slate-500 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {f === "all" ? "Tất cả" : f === "unread" ? "Chưa đọc" : "Đã đọc"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Contact List */}
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-1 custom-scrollbar">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white dark:bg-brand-card rounded-2xl animate-pulse border border-slate-200 dark:border-brand-border"
              />
            ))
          ) : filtered.length === 0 ? (
            <div className={`${cardClasses} p-12 text-center`}>
              <p className="text-4xl mb-4 opacity-50">📭</p>
              <p className="text-slate-500 dark:text-brand-muted font-medium">
                Không tìm thấy liên hệ nào trong hộp thư
              </p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => openDetail(c)}
                className={`border-2 rounded-2xl p-4 cursor-pointer transition-all hover:border-amber-400 dark:hover:border-brand-gold/50 ${
                  selected?.id === c.id
                    ? "border-amber-500 bg-amber-50 dark:bg-brand-gold/10 dark:border-brand-gold shadow-md"
                    : c.isRead
                      ? "bg-white dark:bg-brand-card border-slate-100 dark:border-white/5 opacity-70"
                      : "bg-white dark:bg-brand-card border-amber-200 dark:border-brand-gold/20 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-black text-sm shrink-0 shadow-sm"
                      style={{
                        background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                      }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-slate-900 dark:text-white font-bold text-sm truncate">
                          {c.name}
                        </p>
                        {!c.isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-brand-muted text-[11px] font-medium truncate">
                        {c.email}
                      </p>
                      <p className="text-slate-600 dark:text-gray-400 text-xs mt-2 line-clamp-1 italic">
                        "{c.message}"
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-slate-400 dark:text-brand-muted text-[10px] font-bold uppercase tracking-tighter">
                      {formatDate(c.createdAt)}
                    </p>
                    <div className="mt-2">
                      {c.isRead ? (
                        <CheckCircle
                          size={14}
                          className="text-green-500 ml-auto"
                        />
                      ) : (
                        <Mail size={14} className="text-amber-500 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Contact Detail Content */}
        <div
          className={`${cardClasses} overflow-hidden flex flex-col min-h-[500px]`}
        >
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Mail
                  size={32}
                  className="text-slate-300 dark:text-brand-muted"
                />
              </div>
              <p className="text-slate-400 dark:text-brand-muted text-sm font-medium">
                Chọn một liên hệ từ danh sách bên trái
                <br />
                để xem nội dung tin nhắn chi tiết
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-brand-gold/10 text-amber-600 dark:text-brand-gold shadow-sm">
                    <Eye size={18} />
                  </div>
                  <div>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">
                      Nội dung liên hệ
                    </span>
                    {selected.isRead && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-500/20 font-bold uppercase tracking-widest">
                        Đã đọc
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-400 dark:text-brand-muted uppercase text-[10px] font-bold tracking-widest">
                      <User size={12} /> Họ và tên
                    </div>
                    <p className="text-slate-900 dark:text-white font-bold text-base">
                      {selected.name}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-400 dark:text-brand-muted uppercase text-[10px] font-bold tracking-widest">
                      <Mail size={12} /> Hộp thư Email
                    </div>
                    <p className="text-slate-900 dark:text-white font-bold text-base truncate">
                      {selected.email}
                    </p>
                  </div>
                  {selected.phone && (
                    <div className="p-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 dark:text-brand-muted uppercase text-[10px] font-bold tracking-widest">
                        <Phone size={12} /> Số điện thoại
                      </div>
                      <p className="text-slate-900 dark:text-white font-bold text-base">
                        {selected.phone}
                      </p>
                    </div>
                  )}
                  <div className="p-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-400 dark:text-brand-muted uppercase text-[10px] font-bold tracking-widest">
                      <Clock size={12} /> Ngày gửi
                    </div>
                    <p className="text-slate-900 dark:text-white font-bold text-base">
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-6 bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-2xl">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-brand-gold uppercase tracking-widest mb-4">
                    Nội dung tin nhắn:
                  </p>
                  <p className="text-slate-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex-1 btn-primary flex items-center justify-center gap-3 py-3.5 text-sm font-bold shadow-lg shadow-amber-500/20"
                  >
                    <Mail size={18} /> Phản hồi Email ngay
                  </a>
                  <button
                    onClick={() => setDeleting(selected.id)}
                    className="px-6 py-3.5 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Trash2 size={18} /> Xóa bỏ
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {deleting && (
        <ConfirmDeleteModal
          message="Hành động này sẽ xóa vĩnh viễn liên hệ khỏi hệ thống. Bạn chắc chắn chứ?"
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
