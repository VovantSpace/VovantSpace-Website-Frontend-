import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatsPage from './pages/chats/page';
import WalletPage from './pages/wallet/page';
import ProfilePage from '@/dashboard/Client/Profile';
import AlertPage from './pages/alert/Page';
import Mentors from './pages/mentor/page';
import MySessions from './pages/sessions/page';
import './styles/globals.css'
import {Toaster} from 'react-hot-toast'

function ClientRouting() {

    return (
        <div className='dashbg'>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        backgroundColor: '#333',
                        color: 'white',
                    },
                }}
            />
            <Routes>
                <Route index element={<HomePage/>}/>
                <Route path="find-a-mentor" element={<Mentors/>}/>
                <Route path="chats" element={<ChatsPage/>}/>
                <Route path="wallet" element={<WalletPage/>}/>
                <Route path="my-sessions" element={<MySessions/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="alerts" element={<AlertPage/>}/>

            </Routes>
        </div>
    );
}

export default ClientRouting;
