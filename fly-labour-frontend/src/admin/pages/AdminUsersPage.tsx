import { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Search,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  X,
  CheckCircle,
  User as UserIcon,
  ShieldCheck,
  Building2,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/core/utils/helpers";
import toast from "react-hot-toast";
import type { User } from "@/core/types";
import { usersApi } from "@/core/services/api";

type EditForm = {
  fullName: string;
  phone: string;
  role: string;
  isActive: boolean;
};

const EMPTY_EDIT: EditForm = {
  fullName: "",
  phone: "",
  role: "user",
  isActive: true,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_EDIT);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    usersApi
      .getAll({ search, limit: 100 })
      .then((r) => setUsers(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const openEdit = (u: User) => {
    setEditForm({
      fullName: u.fullName,
      phone: u.phone || "",
      role: u.role,
      isActive: u.isActive,
    });
    setEditModal(u);
  };

  const handleSaveEdit = async () => {
    if (!editModal) return;
    if (!editForm.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    setSaving(true);
    try {
      await usersApi.updateAdmin(editModal.id, editForm);
      toast.success("Đã cập nhật tài khoản");
      setEditModal(null);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.remove(id);
      toast.success("Đã xóa tài khoản");
      setDeleting(null);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Xóa thất bại");
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await usersApi.toggleActive(id);
      setUsers((us) =>
        us.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
      );
      toast.success("Đã cập nhật trạng thái tài khoản");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const setEF =
    (k: keyof EditForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setEditForm((f) => ({ ...f, [k]: e.target.value }));

  // Dynamic CSS classes
  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm transition-colors duration-300";
  const inputClasses =
    "w-full h-10 pl-10 pr-4 text-sm rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Quản lý Người dùng
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm mt-1 font-medium">
            {users.length} tài khoản hệ thống ·{" "}
            <span className="text-green-600 dark:text-green-400 font-bold">
              {users.filter((u) => u.isActive).length} đang hoạt động
            </span>
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className={`${cardClasses} p-4`}>
        <div className="relative max-w-sm">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClasses}
            placeholder="Tìm theo tên, email người dùng..."
          />
        </div>
      </div>

      {/* Main Table */}
      <div className={`${cardClasses} overflow-hidden`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                <th className="text-left px-5 py-4">Người dùng</th>
                <th className="text-left px-5 py-4 hidden md:table-cell">
                  Số điện thoại
                </th>
                <th className="text-left px-5 py-4 hidden sm:table-cell">
                  Vai trò
                </th>
                <th className="text-left px-5 py-4 hidden lg:table-cell">
                  Ngày tham gia
                </th>
                <th className="text-left px-5 py-4">Trạng thái</th>
                <th className="text-right px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-6 text-center">
                      <Loader2 className="animate-spin inline-block text-amber-500" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-20 text-center text-slate-400 font-medium italic"
                  >
                    Không tìm thấy người dùng nào phù hợp
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shadow-sm shrink-0"
                          style={{
                            background:
                              user.role === "admin"
                                ? "linear-gradient(135deg,#e4a808,#fdd52f)"
                                : user.role === "employer"
                                  ? "linear-gradient(135deg,#3B82F6,#8B5CF6)"
                                  : "linear-gradient(135deg,#94a3b8,#64748b)",
                          }}
                        >
                          {user.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-900 dark:text-white font-bold text-sm truncate group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors">
                            {user.fullName}
                          </p>
                          <p className="text-slate-500 dark:text-brand-muted text-[11px] font-medium truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-slate-600 dark:text-gray-300 text-sm font-medium">
                      {user.phone || "—"}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                          user.role === "admin"
                            ? "text-amber-600 bg-amber-50 border-amber-200 dark:text-brand-gold dark:bg-brand-gold/10 dark:border-brand-gold/20"
                            : user.role === "employer"
                              ? "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20"
                              : "text-slate-500 bg-slate-50 border-slate-200 dark:text-gray-400 dark:bg-white/5 dark:border-white/10"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck size={10} />
                        ) : user.role === "employer" ? (
                          <Building2 size={10} />
                        ) : (
                          <UserIcon size={10} />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-slate-400 dark:text-brand-muted text-xs font-medium">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest ${
                          user.isActive
                            ? "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20"
                            : "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          title="Chỉnh sửa"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => toggleActive(user.id)}
                            title={user.isActive ? "Khóa tài khoản" : "Mở khóa"}
                            className={`p-2 rounded-xl bg-slate-100 dark:bg-white/5 transition-all ${
                              user.isActive
                                ? "text-slate-500 hover:text-red-500"
                                : "text-slate-500 hover:text-green-500"
                            }`}
                          >
                            {user.isActive ? (
                              <Lock size={16} />
                            ) : (
                              <Unlock size={16} />
                            )}
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => setDeleting(user.id)}
                            title="Xóa vĩnh viễn"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-600 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Pencil size={18} className="text-amber-600" />
                Chỉnh sửa tài khoản
              </h2>
              <button
                onClick={() => setEditModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-brand-gold/5 border border-slate-100 dark:border-brand-gold/10 rounded-2xl">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-amber-900 font-black text-xl shadow-md shrink-0"
                  style={{
                    background:
                      editModal.role === "admin"
                        ? "linear-gradient(135deg,#e4a808,#fdd52f)"
                        : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                  }}
                >
                  {editModal.fullName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-slate-900 dark:text-white font-bold text-base truncate">
                    {editModal.fullName}
                  </p>
                  <p className="text-slate-500 dark:text-brand-muted text-xs truncate font-medium">
                    {editModal.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Họ và tên *
                  </label>
                  <input
                    value={editForm.fullName}
                    onChange={setEF("fullName")}
                    className={`${inputClasses} h-12`}
                    placeholder="Nhập họ tên đầy đủ"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Số điện thoại
                  </label>
                  <input
                    value={editForm.phone}
                    onChange={setEF("phone")}
                    className={`${inputClasses} h-12`}
                    placeholder="09xx xxx xxx"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Phân quyền vai trò
                  </label>
                  <select
                    value={editForm.role}
                    onChange={setEF("role")}
                    className={`${inputClasses} h-12 appearance-none font-bold`}
                  >
                    <option value="user" className="font-bold">
                      👤 User (Ứng viên)
                    </option>
                    <option value="employer" className="font-bold">
                      🏢 Employer (Nhà tuyển dụng)
                    </option>
                    <option value="admin" className="font-bold">
                      🛡️ Admin (Quản trị viên)
                    </option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5 w-full">
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${editForm.isActive ? "bg-green-500" : "bg-slate-200 dark:bg-white/10"}`}
                    >
                      <div
                        className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${editForm.isActive ? "left-6" : "left-1"}`}
                      />
                    </div>
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          isActive: e.target.checked,
                        }))
                      }
                      className="hidden"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-tighter">
                      Trạng thái hoạt động
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex gap-3">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 h-11 rounded-xl font-bold border border-slate-200 dark:border-brand-border text-slate-600 dark:text-white hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-[2] h-11 btn-primary font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Cập nhật tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Hành động này sẽ xóa vĩnh viễn tài khoản người dùng và toàn bộ dữ liệu lịch sử liên quan. Bạn chắc chắn chứ?"
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
