// Login.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaGoogle, FaGithub, FaLock, FaEnvelope } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import Navbar from './components/Navbar';
import Loginimg from './assets/login.jpeg';
import { Link } from 'react-router-dom';

const Login = () =>
{
    const formik = useFormik( {
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object( {
            email: Yup.string().email( 'Invalid email address' ).required( 'Email Required' ),
            password: Yup.string().required( 'Password Required' )
        } ),
        onSubmit: values =>
        {
            // Handle login
        }
    } );

    return (
        <div className='themebg'>

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
                            alt="User img"
                            className="h-full object-cover object-center"
                        />
                    </motion.div>

                    {/* Right Portion: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-8"
                    >
                        <h2 className="text-3xl font-bold themetext mb-8 text-center">
                            Welcome Back!
                        </h2>

                        <div className="space-y-4 w-full">
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg transition-all">
                                <FaGoogle className="text-xl" /> Continue with Google
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg transition-all">
                                <FaGithub className="text-xl" /> Continue with GitHub
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
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                                        {...formik.getFieldProps( 'email' )}
                                    />
                                </div>
                                <div className='h-2 text-sm'>
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='mb-4'>
                                <div className='flex justify-between items-center'>
                                    <label className="block text-gray-700 mb-2">Password</label>
                                    {/* <div className=" ">
                                    <a href="#" className="themetext hover:underline">Forgot password?</a>
                                </div> */}
                                </div>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                                        {...formik.getFieldProps( 'password' )}
                                    />
                                </div>
                                <div className=' h-5 text-sm'>
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                    ) : null}


                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full themebg text-white py-3 rounded-lg font-semibold hover:bg-[#005741] transition-all flex items-center justify-center gap-2"
                            >
                                Login <BsArrowRight />
                            </button>
                        </form>


                        <div className="mt-4">
                            <p className="text-gray-600">
                                Don't have an account?
                                <Link to="/signup" className="themetext hover:underline ml-2">Signup</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
