import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/analytics/page';
import ChallengesPage from './pages/my-challenges/page';
import ChatsPage from './pages/chats/page';
import WalletPage from './pages/wallet/page';
import ProfilePage from './pages/profile/page';
import './styles/globals.css'
import AlertPage from './pages/alert/Page';

function DashboardRouting() {
  return (
    <div className='dashbg'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="my-challenges" element={<ChallengesPage />} />
        <Route path="chats" element={<ChatsPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="alerts" element={<AlertPage />} />

      </Routes>
    </div>
  );
}

export default DashboardRouting;
