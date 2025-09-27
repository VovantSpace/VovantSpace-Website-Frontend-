import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatsPage from './pages/chats/page';
import WalletPage from './pages/wallet/page';
import ProfilePage from '@/dashboard/component/Profile';
import AlertPage from './pages/alert/Page';
import Mentors from './pages/mentor/page';
import MySessions from './pages/sessions/page';
import './styles/globals.css'

function ProblemSolverRouting() {
  return (
    <div className='dashbg'>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="find-a-mentor" element={<Mentors />} />
        <Route path="chats" element={<ChatsPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="my-sessions" element={<MySessions />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="alerts" element={<AlertPage />} />

      </Routes>
    </div>
  );
}

export default ProblemSolverRouting;
