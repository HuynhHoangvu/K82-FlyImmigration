import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import BackgroundMusic from "@/themes/fly-labour/parts/widgets/BackgroundMusic";
import { useT } from "@/core/hooks/useT";
import { contactApi } from "@/core/services/api";
import { useThemeStore } from "@/core/store/themeStore";

// Layouts
import Header from "@/themes/fly-labour/parts/Header";
import ScrollToTop from "@/themes/fly-labour/parts/widgets/ScrollToTop";
import Footer from "@/themes/fly-labour/parts/Footer";
import FloatingContact from "@/themes/fly-labour/parts/widgets/FloatingContact";
import AdminLayout from "@/admin/layout/AdminLayout";
import { AdminEditBar } from "@/admin/components/AdminEditBar";
import { useContentStore } from "@/core/hooks/usePageContent";

// User pages
import HomePage from "@/plugins/home/pages/HomePage";
import JobsPage from "@/plugins/jobs/pages/JobsPage";
import JobDetailPage from "@/plugins/jobs/pages/JobDetailPage";
import NewsPage from "@/plugins/news/pages/NewsPage";
import NewsDetailPage from "@/plugins/news/pages/NewsDetailPage";
import LoginPage from "@/plugins/auth/pages/LoginPage";
import RegisterPage from "@/plugins/auth/pages/RegisterPage";
import ProfilePage from "@/plugins/profile/pages/ProfilePage";
import AboutPage from "@/plugins/static-pages/pages/AboutPage";
import ProcessPage from "@/plugins/static-pages/pages/ProcessPage";
import FaqPage from "@/plugins/static-pages/pages/FaqPage";
import PrivacyPage from "@/plugins/static-pages/pages/PrivacyPage";
import PolicyPage from "@/plugins/static-pages/pages/PolicyPage";

// Admin pages
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminJobsPage from "@/admin/pages/AdminJobsPage";
import AdminApplicationsPage from "@/admin/pages/AdminApplicationsPage";
import AdminUsersPage from "@/admin/pages/AdminUsersPage";
import AdminCategoriesPage from "@/admin/pages/AdminCategoriesPage";
import AdminNewsPage from "@/admin/pages/AdminNewsPage";
import AdminSettingsPage from "@/admin/pages/AdminSettingsPage";
import AdminChoresPage from "@/admin/pages/AdminChoresPage";
import AdminContactsPage from "@/admin/pages/AdminContactsPage";
import AdminPoliciesPage from "@/admin/pages/AdminPoliciesPage";

// Employer pages
import EmployerLayout from "@/plugins/employer/pages/EmployerLayout";
import EmployerDashboard from "@/plugins/employer/pages/EmployerDashboard";
import EmployerJobsPage from "@/plugins/employer/pages/EmployerJobsPage";
import EmployerApplicationsPage from "@/plugins/employer/pages/EmployerApplicationsPage";
import EmployerProfilePage from "@/plugins/employer/pages/EmployerProfilePage";

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Header />
      {children}
      <Footer />
      <FloatingContact />
      <BackgroundMusic autoPlay={true} />
    </div>
  );
}

function ContactPage() {
  const { t } = useT();
  const c = t("contact");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await contactApi.send(form);
      toast.success("�� g?i li�n h? th�nh c�ng! Ch�ng t�i s? ph?n h?i s?m.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("G?i th?t b?i, vui l�ng th? l?i");
    } finally {
      setSending(false);
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen pt-28 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="section-title mb-4">
            {c.title} <span className="gradient-text">{c.titleGradient}</span>
          </h1>
          <p className="text-brand-muted mb-8">{c.subtitle}</p>
          <div className="card-dark p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                {
                  label: c.name,
                  key: "name",
                  type: "text",
                  placeholder: c.namePlaceholder,
                },
                {
                  label: c.email,
                  key: "email",
                  type: "email",
                  placeholder: "email@example.com",
                },
                {
                  label: c.phone,
                  key: "phone",
                  type: "tel",
                  placeholder: c.phonePlaceholder,
                },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((fm) => ({ ...fm, [f.key]: e.target.value }))
                    }
                    className="input-dark"
                    placeholder={f.placeholder}
                    required={f.key !== "phone"}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  {c.message}
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((fm) => ({ ...fm, message: e.target.value }))
                  }
                  className="input-dark h-28 resize-none"
                  placeholder={c.messagePlaceholder}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                    �ang g?i...
                  </>
                ) : (
                  c.send
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

function NotFound() {
  const { t } = useT();
  const nf = t("notFound");
  return (
    <UserLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-9xl gradient-text">404</p>
          <p className="text-theme-text-base font-semibold text-xl mt-2">{nf.title}</p>
          <a href="/" className="btn-primary inline-block mt-6 px-6 py-3">
            {nf.back}
          </a>
        </div>
      </div>
    </UserLayout>
  );
}

function ContentLoader() {
  const load = useContentStore((s) => s.load);
  useEffect(() => {
    load();
  }, [load]);
  return null;
}

function ThemeInitializer() {
  useEffect(() => {
    const { hydrate } = useThemeStore.getState();
    hydrate();
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <ContentLoader />
      <AdminEditBar />
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#141414",
            color: "#fff",
            border: "1px solid #2A2A2A",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#fdd52f", secondary: "#000" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />
      <Routes>
        {/* User routes */}
        <Route
          path="/"
          element={
            <UserLayout>
              <HomePage />
            </UserLayout>
          }
        />
        <Route
          path="/jobs"
          element={
            <UserLayout>
              <JobsPage />
            </UserLayout>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <UserLayout>
              <JobDetailPage />
            </UserLayout>
          }
        />
        <Route
          path="/news"
          element={
            <UserLayout>
              <NewsPage />
            </UserLayout>
          }
        />
        <Route
          path="/news/:slug"
          element={
            <UserLayout>
              <NewsDetailPage />
            </UserLayout>
          }
        />
        <Route
          path="/about"
          element={
            <UserLayout>
              <AboutPage />
            </UserLayout>
          }
        />
        <Route
          path="/process"
          element={
            <UserLayout>
              <ProcessPage />
            </UserLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <UserLayout>
              <FaqPage />
            </UserLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <UserLayout>
              <PrivacyPage />
            </UserLayout>
          }
        />
        <Route
          path="/policy/:slug"
          element={
            <UserLayout>
              <PolicyPage />
            </UserLayout>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <UserLayout>
              <ProfilePage />
            </UserLayout>
          }
        />

        {/* Employer routes */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<EmployerDashboard />} />
          <Route path="jobs" element={<EmployerJobsPage />} />
          <Route path="applications" element={<EmployerApplicationsPage />} />
          <Route path="profile" element={<EmployerProfilePage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="policies" element={<AdminPoliciesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="chores" element={<AdminChoresPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
