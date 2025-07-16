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
import { toast } from "react-toastify";

const Forget = () =>
{
    const formik = useFormik( {
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object( {
            email: Yup.string().email( 'Invalid email address' ).required( 'Email Required' ),

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
                            Forgot Password?
                        </h2>

        
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
                                <div className='h-2 my-1 text-sm'>
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                    ) : null}
                                </div>
                            </div>


                            <button
                                type="submit"
                                className="w-full themebg text-white py-3 mt-2 rounded-lg font-semibold hover:bg-[#005741] transition-all flex items-center justify-center gap-2" onClick={() => toast.success("Link Sent to Email!")}
                            >
                                Reset Password <BsArrowRight />
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

export default Forget;
