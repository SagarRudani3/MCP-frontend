import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CalendarDashboard from './components/CalendarDashboard';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarDashboard />} />
        <Route path="/callback" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<CalendarDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
