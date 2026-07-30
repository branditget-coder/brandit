import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ScrollToTop from './components/common/ScrollToTop'
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'

// Pages
import LandingPage from './pages/Landing/LandingPage'
import AboutPage from './pages/About/AboutPage'
import ServicesPage from './pages/Services/ServicesPage'
import PricingPage from './pages/Pricing/PricingPage'
import ContactPage from './pages/Contact/ContactPage'
import BookPage from './pages/Book/BookPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import PrivacyPage from './pages/Legal/PrivacyPage'
import TermsPage from './pages/Legal/TermsPage'
import RefundPage from './pages/Legal/RefundPage'

// Dashboard
import UserDashboard from './pages/dashboard/UserDashboard'
import MyBookings from './pages/dashboard/MyBookings'
import MyInvoices from './pages/dashboard/MyInvoices'
import ProfilePage from './pages/dashboard/ProfilePage'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import NotFoundPage from './pages/NotFoundPage'

// Auth Guards
import ProtectedRoute, { PublicOnlyRoute } from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refund" element={<RefundPage />} />
          </Route>

          {/* Auth Routes (Public Only - Redirects if already logged in) */}
          <Route element={<PublicOnlyRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>
          </Route>

          {/* Protected Client Dashboard Routes (USER & ADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="invoices" element={<MyInvoices />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Strict Protected Admin Routes (ADMIN ONLY) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
