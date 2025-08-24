import './index.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.jsx'
import Footer from './components/Footer.jsx'
import About from './About.jsx'
import Services from './Services.jsx';
import Contact from './Contact.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardRouting from './dashboard/Innovator/DashboardRouting';
import ProblemSolverRouting from './dashboard/ProblemSolver/ProblemSolverRouting';
import AdvisorRouting from './dashboard/Advisor/AdvisorRouting';
import ClientRouting from './dashboard/Client/ClientRouting';
import Forget from './Forget';
import {AppProvider} from './context/AppContext.jsx'

const root = createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <BrowserRouter>
            <AppProvider>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/services" element={<Services/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/forget" element={<Forget/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/dashboard/innovator/*" element={<DashboardRouting/>}/>
                    <Route path="/dashboard/ps/*" element={<ProblemSolverRouting/>}/>
                    <Route path="/dashboard/advisor/*" element={<AdvisorRouting/>}/>
                    <Route path="/dashboard/client/*" element={<ClientRouting/>}/>
                </Routes>
            </AppProvider>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000}/>
    </StrictMode>
);