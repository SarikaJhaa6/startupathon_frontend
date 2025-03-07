import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainDashboard from './pages/MainDashboard';
import AdminLogin from './pages/AdminLogin';
import ChallengesManagement from './pages/ChallengesManagement';
import CompletersManagement from './pages/CompletersManagement';
import FounderManagement from './pages/FounderManagement';
import SubscriberManagement from './pages/SubscriberManagement';
import HowToWin from './pages/HowtoWin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainDashboard />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/challenges" element={<ChallengesManagement />} />
      <Route path="/admin/completers" element={<CompletersManagement />} />
      <Route path="/admin/founders" element={<FounderManagement />} />
      <Route path="/admin/subscribers" element={<SubscriberManagement />} />
      <Route path="/how-to-win" element={<HowToWin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
