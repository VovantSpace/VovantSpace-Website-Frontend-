import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaGoogle, FaGithub, FaLock, FaEnvelope } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import Loginimg from './assets/login.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

const Login = () => {
    const { login, isLoading } = useAppContext();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isOauthLoading, setIsOauthLoading] = useState(false);
    const [oauthProvider, setOauthProvider] = useState(null); // New state for tracking provider

    const getDashboardRoute = (role) => {
        switch (role?.toLowerCase()) {
            case 'innovator':
                return '/dashboard/innovator';
            case 'problem solver':
            case 'problemsolver':
            case 'ps':
                return '/dashboard/ps';
            case 'advisor/mentor':
                return '/dashboard/advisor';
            case 'client/mentee':
                return '/dashboard/client';
            default:
                console.warn('Unknown user role:', role);
                return '/dashboard';
        }
    };

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email Required'),
            password: Yup.string().required('Password Required'),
        }),
        onSubmit: async (values) => {
            setErrorMessage('');
            try {
                const result = await login(values.email, values.password);
                if (result.success && result.user) {
                    const userRole = result.user.role;
                    if (userRole) {
                        const dashboardRoute = getDashboardRoute(userRole);
                        console.log('Redirecting to:', dashboardRoute, 'for role:', userRole);
                        navigate(dashboardRoute, { replace: true });
                    } else {
                        setErrorMessage('User role not found. Please contact support.');
                    }
                } else {
                    setErrorMessage(result.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                setErrorMessage('An unexpected error occurred. Please try again.');
                console.error('Login error:', error);
            }
        },
    });

    const handleOauthLogin = async (provider) => {
        setErrorMessage('');
        setIsOauthLoading(true);
        setOauthProvider(provider); // Set the provider
        try {
            const clientId =
                provider === 'google'
                    ? import.meta.env.VITE_GOOGLE_CLIENT_ID
                    : import.meta.env.VITE_GITHUB_CLIENT_ID;

            if (!clientId) {
                throw new Error(
                    `${provider === 'google' ? 'Google' : 'GitHub'} authentication is not configured.`,
                );
            }

            // initiateOauthFlow(provider);
        } catch (error) {
            console.error(`${provider} OAuth login error:`, error);
            setErrorMessage(
                `Failed to initiate ${provider === 'google' ? 'Google' : 'GitHub'} login. Please try again.`,
            );
            setIsOauthLoading(false);
            setOauthProvider(null); // Reset provider on error
        }
    };

    return (
        <div className="themebg">
            <div className="bg-[#f8f9fa] flex items-center justify-center min-h-[80vh] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl">
                    {/* Left Portion: Image (hidden on mobile) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hidden md:flex items-center justify-center bg-white border"
                    >
                        <img
                            src={Loginimg}
                            alt="Login illustration"
                            className="h-full object-cover object-center"
                        />
                    </motion.div>

                    {/* Right Portion: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-8"
                    >
                        <h2 className="text-3xl font-bold themetext mb-8 text-center">Welcome Back!</h2>

                        {errorMessage && (
                            <div className="w-full mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-4 w-full">
                            <button
                                onClick={() => handleOauthLogin('google')}
                                disabled={isLoading || isOauthLoading}
                                className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isOauthLoading && oauthProvider === 'google' ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                                        Connecting to Google...
                                    </>
                                ) : (
                                    <>
                                        <FaGoogle className="text-xl" /> Continue with Google
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleOauthLogin('github')}
                                disabled={isLoading || isOauthLoading}
                                className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isOauthLoading && oauthProvider === 'github' ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                                        Connecting to GitHub...
                                    </>
                                ) : (
                                    <>
                                        <FaGithub className="text-xl" /> Continue with GitHub
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="my-8 flex items-center w-full">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-gray-500">Or</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-3 w-full">
                            <div>
                                <label className="block text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        disabled={isLoading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] ${
                                            formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        {...formik.getFieldProps('email')}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        disabled={isLoading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] ${
                                            formik.touched.password && formik.errors.password
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        {...formik.getFieldProps('password')}
                                    />
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formik.isValid || !formik.dirty}
                                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                                    isLoading || !formik.isValid || !formik.dirty
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'themebg text-white hover:bg-[#005741]'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        Login <BsArrowRight />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600">
                                Don&apos;t have an account?{' '}
                                <Link to="/signup" className="themetext hover:underline">
                                    Signup
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;