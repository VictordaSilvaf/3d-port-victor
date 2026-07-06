import { Navigate, Route, Routes } from "react-router-dom"

import { LoginPage } from "@/pages/auth/login.page"
import { DashboardPage } from "@/pages/dashboard/dashboard.page"
import { PageFormPage } from "@/pages/pages/page-form.page"
import { PagesListPage } from "@/pages/pages/pages-list.page"
import { ProjectFormPage } from "@/pages/projects/project-form.page"
import { ProjectsListPage } from "@/pages/projects/projects-list.page"
import { RolesPage } from "@/pages/roles/roles.page"
import { SiteSettingsPage } from "@/pages/settings/site-settings.page"
import { UserDetailPage } from "@/pages/users/user-detail.page"
import { UsersListPage } from "@/pages/users/users-list.page"
import { AdminLayout } from "@/routes/admin-layout"
import { ProtectedRoute } from "@/routes/protected-route"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsListPage />} />
          <Route path="projects/new" element={<ProjectFormPage />} />
          <Route path="projects/:id" element={<ProjectFormPage />} />
          <Route path="pages" element={<PagesListPage />} />
          <Route path="pages/new" element={<PageFormPage />} />
          <Route path="pages/:id" element={<PageFormPage />} />
          <Route path="users" element={<UsersListPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="settings" element={<SiteSettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
