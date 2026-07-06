import { Navigate, Route, Routes } from "react-router-dom"

import { AccountPage } from "@/pages/auth/account.page"
import { ForgotPasswordPage } from "@/pages/auth/forgot-password.page"
import { LoginPage } from "@/pages/auth/login.page"
import { RegisterPage } from "@/pages/auth/register.page"
import { ResetPasswordPage } from "@/pages/auth/reset-password.page"
import { CmsPage } from "@/pages/cms/cms.page"
import { ContactPage } from "@/pages/contact/contact.page"
import { ExperiencePage } from "@/pages/experience/experience.page"
import { HomePage } from "@/pages/home/home.page"
import { ProjectDetailPage } from "@/pages/projects/project-detail.page"
import { ProjectsPage } from "@/pages/projects/projects.page"
import { SearchPage } from "@/pages/search/search.page"
import { PublicLayout } from "@/routes/public-layout"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="p/:slug" element={<CmsPage />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
      <Route path="experiencia" element={<ExperiencePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
