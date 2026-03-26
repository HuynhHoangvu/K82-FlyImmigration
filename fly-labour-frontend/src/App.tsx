import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BackgroundMusic from "@/components/ui/BackgroundMusic";
import { useT } from "@/hooks/useT";

// Layouts
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/ui/FloatingContact";
import AdminLayout from "@/components/admin/AdminLayout";

// User pages
import HomePage from "@/pages/user/HomePage";
import JobsPage from "@/pages/user/JobsPage";
import JobDetailPage from "@/pages/user/JobDetailPage";
import LoginPage from "@/pages/user/LoginPage";
import RegisterPage from "@/pages/user/RegisterPage";
import ProfilePage from "@/pages/user/ProfilePage";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminJobsPage from "@/pages/admin/AdminJobsPage";
import AdminApplicationsPage from "@/pages/admin/AdminApplicationsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminNewsPage from "@/pages/admin/AdminNewsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";

// Employer pages
import EmployerLayout from "@/pages/employer/EmployerLayout";
import EmployerDashboard from "@/pages/employer/EmployerDashboard";
import EmployerJobsPage from "@/pages/employer/EmployerJobsPage";
import EmployerApplicationsPage from "@/pages/employer/EmployerApplicationsPage";

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      {children}
      <Footer />
      <FloatingContact />
      <BackgroundMusic src="/music/background.mp3" autoPlay={true} />
    </div>
  );
}

function NewsPage() {
  const { t } = useT();
  const n = t('news');
  return (
    <UserLayout>
      <div className="min-h-screen pt-28 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title mb-8">
            {n.title} <span className="gradient-text">{n.titleGradient}</span>
          </h1>
          <p className="text-brand-muted">{n.comingSoon}</p>
        </div>
      </div>
    </UserLayout>
  );
}

function ContactPage() {
  const { t } = useT();
  const c = t('contact');
  return (
    <UserLayout>
      <div className="min-h-screen pt-28 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="section-title mb-4">
            {c.title} <span className="gradient-text">{c.titleGradient}</span>
          </h1>
          <p className="text-brand-muted mb-8">{c.subtitle}</p>
          <div className="card-dark p-8 space-y-4">
            {[
              { label: c.name, type: "text", placeholder: c.namePlaceholder },
              { label: c.email, type: "email", placeholder: "email@example.com" },
              { label: c.phone, type: "tel", placeholder: c.phonePlaceholder },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-xs text-brand-muted mb-1.5 block">{f.label}</label>
                <input type={f.type} className="input-dark" placeholder={f.placeholder} />
              </div>
            ))}
            <div>
              <label className="text-xs text-brand-muted mb-1.5 block">{c.message}</label>
              <textarea className="input-dark h-28 resize-none" placeholder={c.messagePlaceholder} />
            </div>
            <button className="btn-primary w-full py-3">{c.send}</button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

function NotFound() {
  const { t } = useT();
  const nf = t('notFound');
  return (
    <UserLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-9xl gradient-text">404</p>
          <p className="text-white font-semibold text-xl mt-2">{nf.title}</p>
          <a href="/" className="btn-primary inline-block mt-6 px-6 py-3">
            {nf.back}
          </a>
        </div>
      </div>
    </UserLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
        <Route path="/jobs" element={<UserLayout><JobsPage /></UserLayout>} />
        <Route path="/jobs/:id" element={<UserLayout><JobDetailPage /></UserLayout>} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<UserLayout><ProfilePage /></UserLayout>} />

        {/* Employer routes */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<EmployerDashboard />} />
          <Route path="jobs" element={<EmployerJobsPage />} />
          <Route path="applications" element={<EmployerApplicationsPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
