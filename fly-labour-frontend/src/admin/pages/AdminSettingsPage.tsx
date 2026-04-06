import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, Bell, Globe, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { settingsApi, usersApi } from "@/core/services/api";
import { useAuthStore } from "@/core/store/authStore";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "general" | "contact" | "security" | "notification"
  >("general");
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [general, setGeneral] = useState({
    siteName: "Fly Labour",
    tagline: "Kết nối lao động Việt Nam với thế giới",
    hotline: "0901 234 567",
    email: "info@flylabour.com",
    address: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
    facebookUrl: "https://facebook.com/flylabour",
    zaloNumber: "0901234567",
    messengerUrl: "https://m.me/flylabour",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifs, setNotifs] = useState({
    newApplication: "true",
    newUser: "true",
    jobExpiring: "true",
    emailNotif: "false",
  });

  useEffect(() => {
    settingsApi
      .getAll()
      .then((r) => {
        const s = r.data;
        if (Object.keys(s).length > 0) {
          setGeneral(
            (prev) =>
              ({
                ...prev,
                ...Object.fromEntries(
                  Object.entries(s).filter(([k]) =>
                    Object.keys(prev).includes(k),
                  ),
                ),
              }) as typeof general,
          );
          setNotifs(
            (prev) =>
              ({
                ...prev,
                ...Object.fromEntries(
                  Object.entries(s).filter(([k]) =>
                    Object.keys(prev).includes(k),
                  ),
                ),
              }) as typeof notifs,
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (activeTab === "security") {
      if (
        !security.currentPassword ||
        !security.newPassword ||
        !security.confirmPassword
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setSaving(true);
      try {
        await usersApi.changePassword(security);
        toast.success("Đổi mật khẩu thành công");
        setSecurity({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
      } finally {
        setSaving(false);
      }
      return;
    }

    setSaving(true);
    try {
      const allSettings: Record<string, string> = {
        ...general,
        ...notifs,
      };
      await settingsApi.save(allSettings);
      toast.success("Đã lưu cài đặt");
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: "general", label: "Tổng quan", icon: Globe },
    { id: "contact", label: "Liên hệ", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "notification", label: "Thông báo", icon: Bell },
  ] as const;

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-theme-text-base">
          Cài đặt hệ thống
        </h1>
        <p className="text-theme-text-tertiary text-sm">
          Quản lý thông tin và cấu hình website
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-colors font-medium ${
              activeTab === t.id
                ? "bg-brand-gold-primary/10 text-brand-gold-primary border border-brand-gold-primary/30"
                : "text-theme-text-secondary hover:text-theme-text-base bg-theme-surface border border-theme-border-default hover:bg-theme-surfaceSecondary"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="bg-theme-surface border border-theme-border-default rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-theme-text-base flex items-center gap-2">
            <Globe size={16} className="text-brand-gold-primary" /> Thông tin
            website
          </h3>
          {[
            {
              label: "Tên website",
              key: "siteName",
              placeholder: "Fly Labour",
            },
            {
              label: "Slogan",
              key: "tagline",
              placeholder: "Kết nối lao động Việt Nam...",
            },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-theme-text-tertiary mb-1.5 block font-medium">
                {f.label}
              </label>
              <input
                value={general[f.key as keyof typeof general]}
                onChange={(e) =>
                  setGeneral((g) => ({ ...g, [f.key]: e.target.value }))
                }
                className="input-dark"
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === "contact" && (
        <div className="bg-theme-surface border border-theme-border-default rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-theme-text-base flex items-center gap-2">
            <Bell size={16} className="text-brand-gold-primary" /> Thông tin
            liên hệ
          </h3>
          {[
            { label: "Hotline", key: "hotline", placeholder: "0901 234 567" },
            {
              label: "Email liên hệ",
              key: "email",
              placeholder: "info@flylabour.com",
            },
            {
              label: "Địa chỉ văn phòng",
              key: "address",
              placeholder: "123 Nguyễn Văn Linh...",
            },
            {
              label: "Facebook Page URL",
              key: "facebookUrl",
              placeholder: "https://facebook.com/...",
            },
            {
              label: "Zalo (số điện thoại)",
              key: "zaloNumber",
              placeholder: "0901234567",
            },
            {
              label: "Messenger URL",
              key: "messengerUrl",
              placeholder: "https://m.me/...",
            },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-theme-text-tertiary mb-1.5 block font-medium">
                {f.label}
              </label>
              <input
                value={general[f.key as keyof typeof general]}
                onChange={(e) =>
                  setGeneral((g) => ({ ...g, [f.key]: e.target.value }))
                }
                className="input-dark"
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-theme-surface border border-theme-border-default rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-theme-text-base flex items-center gap-2">
            <Shield size={16} className="text-brand-gold-primary" /> Đổi mật
            khẩu
          </h3>
          {[
            { label: "Mật khẩu hiện tại", key: "currentPassword" },
            { label: "Mật khẩu mới", key: "newPassword" },
            { label: "Xác nhận mật khẩu mới", key: "confirmPassword" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-theme-text-tertiary mb-1.5 block font-medium">
                {f.label}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={security[f.key as keyof typeof security]}
                  onChange={(e) =>
                    setSecurity((s) => ({ ...s, [f.key]: e.target.value }))
                  }
                  className="input-dark pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-tertiary hover:text-theme-text-base"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
          <div className="p-4 bg-brand-gold-primary/5 border border-brand-gold-primary/20 rounded-xl text-xs text-theme-text-secondary">
            💡 Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và
            số.
          </div>
        </div>
      )}

      {activeTab === "notification" && (
        <div className="bg-theme-surface border border-theme-border-default rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-theme-text-base flex items-center gap-2">
            <Bell size={16} className="text-brand-gold-primary" /> Cài đặt thông
            báo
          </h3>
          {[
            {
              key: "newApplication",
              label: "Đơn ứng tuyển mới",
              desc: "Nhận thông báo khi có người nộp đơn mới",
            },
            {
              key: "newUser",
              label: "Người dùng đăng ký mới",
              desc: "Thông báo khi có tài khoản mới",
            },
            {
              key: "jobExpiring",
              label: "Bài đăng sắp hết hạn",
              desc: "Nhắc nhở 3 ngày trước khi bài đăng hết hạn",
            },
            {
              key: "emailNotif",
              label: "Thông báo qua Email",
              desc: "Gửi tổng hợp qua email hàng ngày",
            },
          ].map((item) => {
            const isOn = notifs[item.key as keyof typeof notifs] === "true";
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-theme-background border border-theme-border-default rounded-xl"
              >
                <div>
                  <p className="text-theme-text-base text-sm font-medium">
                    {item.label}
                  </p>
                  <p className="text-theme-text-tertiary text-xs mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifs((n) => ({
                      ...n,
                      [item.key]: isOn ? "false" : "true",
                    }))
                  }
                  className={`w-11 h-6 rounded-full transition-all duration-300 relative ${isOn ? "bg-brand-gold-primary" : "bg-theme-border-strong"}`}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: isOn ? "22px" : "2px" }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto"
      >
        {saving ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
            Đang lưu...
          </>
        ) : (
          <>
            <Save size={16} /> Lưu cài đặt
          </>
        )}
      </button>
    </div>
  );
}
