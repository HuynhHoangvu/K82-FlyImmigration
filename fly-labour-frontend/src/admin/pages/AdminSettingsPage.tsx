import { useState, useEffect } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Shield,
  Settings,
  Loader2,
} from "lucide-react";
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
    hotline: "0333 318 882",
    email: "flyvisa@gmail.com",
    address: "219A, No Trang Long, Binh Thanh, Ho Chi Minh City",
    facebookUrl: "https://facebook.com/flylabour",
    zaloNumber: "0333318882",
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
    { id: "contact", label: "Thông tin liên hệ", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "notification", label: "Cấu hình thông báo", icon: Bell },
  ] as const;

  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl shadow-sm transition-colors duration-300";
  const inputClasses =
    "w-full h-12 text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <Loader2 size={32} className="animate-spin mb-4 text-amber-500" />
        <p className="font-medium animate-pulse">Đang tải cấu hình...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-100 dark:bg-brand-gold/10 rounded-2xl text-amber-600 dark:text-brand-gold">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Cài đặt hệ thống
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm">
            Quản lý thông tin và cấu hình vận hành website
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-x-auto custom-scrollbar whitespace-nowrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === t.id
                ? "bg-white dark:bg-brand-gold shadow-sm text-amber-700 dark:text-amber-900"
                : "text-slate-500 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <div className={`${cardClasses} p-6 sm:p-8`}>
        {activeTab === "general" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/5">
              <Globe
                size={18}
                className="text-amber-600 dark:text-brand-gold"
              />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Thông tin Website
              </h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Tên website",
                  key: "siteName",
                  placeholder: "Fly Labour",
                },
                {
                  label: "Slogan / Tagline",
                  key: "tagline",
                  placeholder: "Kết nối lao động Việt Nam...",
                },
              ].map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {f.label}
                  </label>
                  <input
                    value={general[f.key as keyof typeof general]}
                    onChange={(e) =>
                      setGeneral((g) => ({ ...g, [f.key]: e.target.value }))
                    }
                    className={inputClasses}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/5">
              <Bell size={18} className="text-amber-600 dark:text-brand-gold" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Thông tin liên hệ & Mạng xã hội
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  label: "Hotline hiển thị",
                  key: "hotline",
                  placeholder: "0901 234 567",
                },
                {
                  label: "Email hệ thống",
                  key: "email",
                  placeholder: "info@flylabour.com",
                },
                {
                  label: "Địa chỉ văn phòng",
                  key: "address",
                  placeholder: "123 Nguyễn Văn Linh...",
                  colSpan: true,
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
                  colSpan: true,
                },
              ].map((f) => (
                <div
                  key={f.key}
                  className={`space-y-1.5 ${f.colSpan ? "sm:col-span-2" : ""}`}
                >
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {f.label}
                  </label>
                  <input
                    value={general[f.key as keyof typeof general]}
                    onChange={(e) =>
                      setGeneral((g) => ({ ...g, [f.key]: e.target.value }))
                    }
                    className={inputClasses}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/5">
              <Shield
                size={18}
                className="text-amber-600 dark:text-brand-gold"
              />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Bảo mật tài khoản
              </h3>
            </div>
            <div className="space-y-5">
              {[
                { label: "Mật khẩu hiện tại", key: "currentPassword" },
                { label: "Mật khẩu mới", key: "newPassword" },
                { label: "Xác nhận mật khẩu mới", key: "confirmPassword" },
              ].map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={security[f.key as keyof typeof security]}
                      onChange={(e) =>
                        setSecurity((s) => ({ ...s, [f.key]: e.target.value }))
                      }
                      className={`${inputClasses} pr-12`}
                      placeholder="••••••••"
                    />
                    {f.key === "currentPassword" && (
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="p-4 bg-amber-50 dark:bg-brand-gold/5 border border-amber-200 dark:border-brand-gold/10 rounded-2xl text-[11px] text-amber-800 dark:text-brand-gold leading-relaxed">
                💡 <b>Mẹo:</b> Mật khẩu mạnh nên bao gồm ít nhất 8 ký tự, có cả
                chữ hoa, chữ thường và các ký số để bảo vệ tài khoản admin an
                toàn nhất.
              </div>
            </div>
          </div>
        )}

        {activeTab === "notification" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/5">
              <Bell size={18} className="text-amber-600 dark:text-brand-gold" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Cài đặt thông báo hệ thống
              </h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  key: "newApplication",
                  label: "Đơn ứng tuyển mới",
                  desc: "Nhận thông báo Real-time khi có người nộp hồ sơ",
                },
                {
                  key: "newUser",
                  label: "Tài khoản đăng ký mới",
                  desc: "Thông báo khi có ứng viên hoặc nhà tuyển dụng mới",
                },
                {
                  key: "jobExpiring",
                  label: "Tin tuyển dụng sắp hết hạn",
                  desc: "Nhắc nhở 72 giờ trước khi tin đăng tự động đóng",
                },
                {
                  key: "emailNotif",
                  label: "Thông báo qua Email",
                  desc: "Gửi báo cáo tổng hợp các hoạt động về email Admin",
                },
              ].map((item) => {
                const isOn = notifs[item.key as keyof typeof notifs] === "true";
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl group transition-all"
                  >
                    <div>
                      <p className="text-slate-900 dark:text-white text-sm font-bold">
                        {item.label}
                      </p>
                      <p className="text-slate-500 dark:text-brand-muted text-[11px] mt-0.5">
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
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isOn ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "bg-slate-200 dark:bg-white/10"}`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${isOn ? "left-7" : "left-1"}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex-1 flex items-center justify-center gap-2 h-12 font-bold shadow-lg shadow-amber-500/20"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang lưu dữ liệu...
              </>
            ) : (
              <>
                <Save size={18} /> Lưu tất cả thay đổi
              </>
            )}
          </button>
          <div className="flex-1 hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
