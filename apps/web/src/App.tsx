import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { HomePage } from "./pages/HomePage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

// The whole /admin dashboard (react-hook-form-heavy CRUD pages, none of it
// needed by public site visitors) lives in its own chunk, fetched only when
// someone actually navigates there.
const AdminLayout = lazy(() => import("./layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const LoginPage = lazy(() => import("./pages/admin/LoginPage").then((m) => ({ default: m.LoginPage })));
const DashboardHome = lazy(() => import("./pages/admin/DashboardHome").then((m) => ({ default: m.DashboardHome })));
const LeadsPage = lazy(() => import("./pages/admin/LeadsPage").then((m) => ({ default: m.LeadsPage })));
const LeadDetailPage = lazy(() => import("./pages/admin/LeadDetailPage").then((m) => ({ default: m.LeadDetailPage })));
const ServicesPage = lazy(() => import("./pages/admin/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const GalleryPage = lazy(() => import("./pages/admin/GalleryPage").then((m) => ({ default: m.GalleryPage })));
const TestimonialsPage = lazy(() =>
  import("./pages/admin/TestimonialsPage").then((m) => ({ default: m.TestimonialsPage })),
);
const ServiceAreasPage = lazy(() =>
  import("./pages/admin/ServiceAreasPage").then((m) => ({ default: m.ServiceAreasPage })),
);
const BlogPage = lazy(() => import("./pages/admin/BlogPage").then((m) => ({ default: m.BlogPage })));
const BlogEditorPage = lazy(() =>
  import("./pages/admin/BlogEditorPage").then((m) => ({ default: m.BlogEditorPage })),
);
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage").then((m) => ({ default: m.SettingsPage })));

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={null}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <Suspense fallback={null}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route path="/admin" element={<DashboardHome />} />
          <Route path="/admin/leads" element={<LeadsPage />} />
          <Route path="/admin/leads/:id" element={<LeadDetailPage />} />
          <Route path="/admin/services" element={<ServicesPage />} />
          <Route path="/admin/gallery" element={<GalleryPage />} />
          <Route path="/admin/testimonials" element={<TestimonialsPage />} />
          <Route path="/admin/service-areas" element={<ServiceAreasPage />} />
          <Route path="/admin/blog" element={<BlogPage />} />
          <Route path="/admin/blog/:id" element={<BlogEditorPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
