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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-theme-text-base">
            Quản lý liên hệ
          </h1>
          <p className="text-theme-text-tertiary text-sm mt-0.5">
            {contacts.length} liên hệ
            {unreadCount > 0 && (
              <span className="ml-2 text-brand-gold-primary font-medium">
                · {unreadCount} chưa đọc
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-theme-surface border border-theme-border-default rounded-xl p-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-brand-gold-primary text-slate-900"
                  : "text-theme-text-tertiary hover:text-theme-text-base hover:bg-theme-surfaceSecondary"
              }`}
            >
              {f === "all" ? "Tất cả" : f === "unread" ? "Chưa đọc" : "Đã đọc"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-theme-surface rounded-2xl animate-pulse border border-theme-border-default"
              />
            ))
          ) : filtered.length === 0 ? (
            <div className="bg-theme-surface border border-theme-border-default rounded-2xl p-10 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-theme-text-tertiary text-sm">
                Không có liên hệ nào
              </p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => openDetail(c)}
                className={`bg-theme-surface border rounded-2xl p-4 cursor-pointer transition-all hover:border-brand-gold-primary/30 ${
                  selected?.id === c.id
                    ? "border-brand-gold-primary/40 bg-brand-gold-primary/5"
                    : c.isRead
                      ? "border-theme-border-default"
                      : "border-brand-gold-primary/20 bg-brand-gold-primary/[0.02]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-900 font-bold text-sm shrink-0 shadow-sm"
                      style={{
                        background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                      }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-theme-text-base text-sm font-medium truncate">
                          {c.name}
                        </p>
                        {!c.isRead && (
                          <span className="w-2 h-2 rounded-full bg-brand-gold-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-theme-text-secondary text-xs truncate">
                        {c.email}
                      </p>
                      <p className="text-theme-text-tertiary text-xs mt-1 line-clamp-1">
                        {c.message}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-theme-text-tertiary text-[10px]">
                      {formatDate(c.createdAt)}
                    </p>
                    {c.isRead ? (
                      <CheckCircle
                        size={12}
                        className="text-green-500 ml-auto mt-1"
                      />
                    ) : (
                      <Mail
                        size={12}
                        className="text-brand-gold-primary ml-auto mt-1"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-theme-surface border border-theme-border-default rounded-2xl overflow-hidden">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
              <Mail size={32} className="text-theme-text-tertiary mb-3" />
              <p className="text-theme-text-tertiary text-sm">
                Chọn một liên hệ để xem chi tiết
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-theme-border-default bg-theme-surfaceSecondary/30">
                <div className="flex items-center gap-2">
                  <Eye size={15} className="text-brand-gold-primary" />
                  <span className="text-theme-text-base font-semibold text-sm">
                    Chi tiết liên hệ
                  </span>
                  {selected.isRead && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                      Đã đọc
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-theme-text-tertiary hover:text-theme-text-base"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-theme-background border border-theme-border-default rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <User size={11} className="text-theme-text-tertiary" />
                      <span className="text-[10px] text-theme-text-tertiary">
                        Họ tên
                      </span>
                    </div>
                    <p className="text-theme-text-base text-sm font-medium">
                      {selected.name}
                    </p>
                  </div>
                  <div className="bg-theme-background border border-theme-border-default rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Mail size={11} className="text-theme-text-tertiary" />
                      <span className="text-[10px] text-theme-text-tertiary">
                        Email
                      </span>
                    </div>
                    <p className="text-theme-text-base text-sm truncate">
                      {selected.email}
                    </p>
                  </div>
                  {selected.phone && (
                    <div className="bg-theme-background border border-theme-border-default rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Phone size={11} className="text-theme-text-tertiary" />
                        <span className="text-[10px] text-theme-text-tertiary">
                          Điện thoại
                        </span>
                      </div>
                      <p className="text-theme-text-base text-sm">
                        {selected.phone}
                      </p>
                    </div>
                  )}
                  <div className="bg-theme-background border border-theme-border-default rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={11} className="text-theme-text-tertiary" />
                      <span className="text-[10px] text-theme-text-tertiary">
                        Thời gian
                      </span>
                    </div>
                    <p className="text-theme-text-base text-sm">
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="bg-theme-background border border-theme-border-default rounded-xl p-4">
                  <p className="text-[10px] text-theme-text-tertiary mb-2">
                    Nội dung
                  </p>
                  <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
                  >
                    <Mail size={14} /> Trả lời email
                  </a>
                  <button
                    onClick={() => setDeleting(selected.id)}
                    className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {deleting && (
        <ConfirmDeleteModal
          message="Bạn chắc chắn muốn xóa liên hệ này?"
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
