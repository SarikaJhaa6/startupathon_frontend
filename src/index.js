import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminLogin from './pages/AdminLogin';
import ChallengesManagement from './pages/ChallengesManagement';
import CompletersManagement from './pages/CompletersManagement';
import FounderManagement from './pages/FounderManagement';
import SubscriberManagement from './pages/SubscriberManagement';
import HowToWin from './pages/HowtoWin';
import NotFound from './pages/NotFound';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/challenges" element={<ChallengesManagement />} />
      <Route path="/admin/completers" element={<CompletersManagement />} />
      <Route path="/admin/founders" element={<FounderManagement />} />
      <Route path="/admin/subscribers" element={<SubscriberManagement />} />
      <Route path="/how-to-win" element={<HowToWin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);
