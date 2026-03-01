import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { SubjectPage } from './pages/SubjectPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/mission-control" replace />} />
        <Route path="/mission-control" element={<DashboardPage />} />
        <Route path="/dashboards" element={<DashboardPage />} />
        <Route path="/subject/:slug" element={<SubjectPage />} />
        <Route path="/subject/:slug/:tabId" element={<SubjectPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/mission-control" replace />} />
    </Routes>
  )
}

export default App




