import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarView />} />
        <Route path="/callback" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<CalendarView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
