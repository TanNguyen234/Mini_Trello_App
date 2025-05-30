import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LoginPage from './pages/Login';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;