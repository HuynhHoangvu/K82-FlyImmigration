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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-theme-text-base">
            Quản lý Người dùng
          </h1>
          <p className="text-theme-text-tertiary text-sm">
            {users.length} tài khoản · {users.filter((u) => u.isActive).length}{" "}
            đang hoạt động
          </p>
        </div>
      </div>

      <div className="card-dark p-4">
        <div className="relative max-w-sm">
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
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme-border-default bg-theme-surfaceSecondary/50">
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Người dùng
                </th>
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold hidden md:table-cell">
                  SĐT
                </th>
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold hidden sm:table-cell">
                  Vai trò
                </th>
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold hidden lg:table-cell">
                  Ngày đăng ký
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
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-theme-text-tertiary text-sm"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-theme-text-tertiary text-sm"
                  >
                    Không tìm thấy người dùng
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-theme-border-default/40 hover:bg-theme-surfaceSecondary transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-900 text-xs font-bold shrink-0 shadow-sm"
                          style={{
                            background:
                              user.role === "admin"
                                ? "linear-gradient(135deg,#e4a808,#fdd52f)"
                                : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                          }}
                        >
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-theme-text-base text-sm font-medium">
                            {user.fullName}
                          </p>
                          <p className="text-theme-text-tertiary text-xs">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-theme-text-secondary text-sm">
                      {user.phone || "—"}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${user.role === "admin" ? "text-brand-gold-primary bg-brand-gold-primary/10 border-brand-gold-primary/20" : "text-theme-text-secondary bg-theme-background border-theme-border-default"}`}
                      >
                        {user.role === "admin"
                          ? "🛡️ Admin"
                          : user.role === "employer"
                            ? "🏢 Employer"
                            : "👤 User"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-theme-text-tertiary text-xs">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${user.isActive ? "text-green-500 bg-green-500/10 border-green-500/20" : "text-red-500 bg-red-500/10 border-red-500/20"}`}
                      >
                        {user.isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-theme-text-tertiary hover:text-brand-gold-primary hover:bg-theme-surfaceSecondary transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => toggleActive(user.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${user.isActive ? "text-theme-text-tertiary hover:text-red-500 hover:bg-red-500/10" : "text-theme-text-tertiary hover:text-green-500 hover:bg-green-500/10"}`}
                          >
                            {user.isActive ? (
                              <Lock size={13} />
                            ) : (
                              <Unlock size={13} />
                            )}
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => setDeleting(user.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-theme-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={13} />
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

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditModal(null)}
          />
          <div className="relative bg-theme-surface border border-theme-border-default rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-theme-border-default">
              <h2 className="font-semibold text-theme-text-base">
                ✏️ Chỉnh sửa tài khoản
              </h2>
              <button onClick={() => setEditModal(null)}>
                <X
                  size={18}
                  className="text-theme-text-tertiary hover:text-theme-text-base"
                />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-theme-background border border-theme-border-default rounded-xl">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 text-sm font-bold shrink-0 shadow-sm"
                  style={{
                    background:
                      editModal.role === "admin"
                        ? "linear-gradient(135deg,#e4a808,#fdd52f)"
                        : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                  }}
                >
                  {editModal.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-theme-text-base text-sm font-medium">
                    {editModal.fullName}
                  </p>
                  <p className="text-theme-text-tertiary text-xs">
                    {editModal.email}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs text-theme-text-tertiary mb-1.5 block">
                  Họ tên *
                </label>
                <input
                  value={editForm.fullName}
                  onChange={setEF("fullName")}
                  className="input-dark"
                  placeholder="Họ và tên"
                />
              </div>
              <div>
                <label className="text-xs text-theme-text-tertiary mb-1.5 block">
                  Số điện thoại
                </label>
                <input
                  value={editForm.phone}
                  onChange={setEF("phone")}
                  className="input-dark"
                  placeholder="0901234567"
                />
              </div>
              <div>
                <label className="text-xs text-theme-text-tertiary mb-1.5 block">
                  Vai trò
                </label>
                <select
                  value={editForm.role}
                  onChange={setEF("role")}
                  className="input-dark"
                >
                  <option value="user">👤 User</option>
                  <option value="employer">🏢 Employer</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 accent-brand-gold-primary"
                />
                <span className="text-sm text-theme-text-base">
                  Tài khoản đang hoạt động
                </span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60"
                >
                  <CheckCircle size={15} />{" "}
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  onClick={() => setEditModal(null)}
                  className="btn-outline px-6"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Tài khoản và toàn bộ dữ liệu liên quan sẽ bị xóa vĩnh viễn."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
