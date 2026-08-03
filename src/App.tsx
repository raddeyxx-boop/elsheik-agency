import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminRequestsPage from './pages/AdminRequestsPage'
import AdminCollegesPage from './pages/AdminCollegesPage'
import AdminConnectionPage from './pages/AdminConnectionPage'
import AdminSetupCheckPage from './pages/AdminSetupCheckPage'
import AdminRoute from './components/auth/AdminRoute'
import AdminLayout from './layouts/AdminLayout'
import { AuthProvider } from './context/AuthContext'
import EnglishTestStartPage from './pages/EnglishTestStartPage'
import EnglishTestExamPage from './pages/EnglishTestExamPage'
import EnglishTestResultPage from './pages/EnglishTestResultPage'
import AdminEnglishTestPage from './pages/AdminEnglishTestPage'
import EnglishTestErrorBoundary from './components/errors/EnglishTestErrorBoundary'
import PreferenceControls from './components/PreferenceControls'

function GlobalPreferences(){ const {pathname}=useLocation(); return pathname==='/'?null:<div className="global-preferences"><PreferenceControls /></div> }

export default function App() {
  return <BrowserRouter><AuthProvider><GlobalPreferences/><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/english-test" element={<EnglishTestErrorBoundary><EnglishTestStartPage /></EnglishTestErrorBoundary>} />
    <Route path="/english-test/exam" element={<EnglishTestErrorBoundary><EnglishTestExamPage /></EnglishTestErrorBoundary>} />
    <Route path="/english-test/result/:attemptId" element={<EnglishTestErrorBoundary><EnglishTestResultPage /></EnglishTestErrorBoundary>} />
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin/setup-check" element={<AdminSetupCheckPage />} />
    <Route element={<AdminRoute />}><Route element={<AdminLayout />}>
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/requests" element={<AdminRequestsPage />} />
      <Route path="/admin/requests/pending" element={<AdminRequestsPage />} />
      <Route path="/admin/colleges" element={<AdminCollegesPage />} />
      <Route path="/admin/settings/connection" element={<AdminConnectionPage />} />
      <Route path="/admin/english-test" element={<AdminEnglishTestPage view="overview" />} />
      <Route path="/admin/english-test/questions" element={<AdminEnglishTestPage view="questions" />} />
      <Route path="/admin/english-test/writing" element={<AdminEnglishTestPage view="writing" />} />
      <Route path="/admin/english-test/results" element={<AdminEnglishTestPage view="results" />} />
      <Route path="/admin/english-test/settings" element={<AdminEnglishTestPage view="settings" />} />
    </Route></Route>
    <Route path="*" element={<HomePage />} />
  </Routes></AuthProvider></BrowserRouter>
}
