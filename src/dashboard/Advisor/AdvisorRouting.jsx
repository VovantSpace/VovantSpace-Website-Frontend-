import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AvailabilityPage from './pages/availability/page';
import RequestPage from './pages/requests/page';
import ChatsPage from './pages/chats/page';
import WalletPage from './pages/wallet/page';
import ProfilePage from './pages/profile/page';
import './styles/globals.css'
import AlertPage from './pages/alert/Page';
import {Toaster} from 'react-hot-toast'

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
                <Route path="/" element={<HomePage/>}/>
                <Route path="requests" element={<RequestPage/>}/>
                <Route path="chats" element={<ChatsPage/>}/>
                <Route path="wallet" element={<WalletPage/>}/>
                <Route path="availability" element={<AvailabilityPage/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="alerts" element={<AlertPage/>}/>
            </Routes>
        </div>
    )
}

export default ProblemSolverRouting;
