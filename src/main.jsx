import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import About from './About.jsx'
import Services from './Services.jsx'
import Contact from './Contact.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import Forget from './Forget'
import OAuthCallback from './auth/OAuthCallback.jsx'

import DashboardRouting from './dashboard/Innovator/DashboardRouting'
import ProblemSolverRouting from './dashboard/ProblemSolver/ProblemSolverRouting'
import AdvisorRouting from './dashboard/Advisor/AdvisorRouting'
import ClientRouting from './dashboard/Client/ClientRouting'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'   // ✅ NEW
import { ProtectedRoute } from '@/dashboard/component/ProtectedRoute'

const root = createRoot(document.getElementById('root'))

root.render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>   {/* ✅ SINGLE AUTH SOURCE */}
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forget" element={<Forget />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* OAuth */}
                    <Route path="/auth/:provider/callback" element={<OAuthCallback />} />

                    {/* PROTECTED DASHBOARDS */}
                    <Route
                        path="/dashboard/innovator/*"
                        element={
                            <ProtectedRoute>
                                <DashboardRouting />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard/ps/*"
                        element={
                            <ProtectedRoute>
                                <ProblemSolverRouting />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard/advisor/*"
                        element={
                            <ProtectedRoute>
                                <AdvisorRouting />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard/client/*"
                        element={
                            <ProtectedRoute>
                                <ClientRouting />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>

        <ToastContainer position="top-right" autoClose={3000} />
    </StrictMode>
)
