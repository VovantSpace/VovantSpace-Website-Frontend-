import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/analytics/page';
import ChallengesPage from './pages/my-challenges/page';
import ChatsPage from './pages/chats/page';
import WalletPage from './pages/wallet/page';
import ProfilePage from '@/dashboard/ProblemSolver/Profile';
import './styles/globals.css'
import AlertPage from './pages/alert/Page';
import {Toaster} from "react-hot-toast";

function ProblemSolverRouting() {
    return (
        <div className='dashbg'>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        backgroundColor: '#333', color: 'white'
                    }
                }}
            />

            <Routes>
                <Route index element={<HomePage/>}/>
                <Route path="my-challenges" element={<ChallengesPage/>}/>
                <Route path="chats" element={<ChatsPage/>}/>
                <Route path="wallet" element={<WalletPage/>}/>
                <Route path="analytics" element={<AnalyticsPage/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="alerts" element={<AlertPage/>}/>

            </Routes>
        </div>
    );
}

export default ProblemSolverRouting;
