import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import
{
    FaGraduationCap, FaHandshake,FaLightbulb, FaUsers
} from 'react-icons/fa';
import Innovator from './components/signup/Innovator';
import ProblemSolver from './components/signup/ProblemSolver';
import Advisor from './components/signup/Advisor';
import Client from './components/signup/Client';

const Signup = () =>
{
    const [step, setStep] = useState( 1 );
    const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Other'];
    const EXPERIENCE = ['1-3 years', '4-6 years', '7-10 years', '10+ years'];

    const formik = useFormik( {
        initialValues: {
            userType: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            // Innovator
            organization: '',
            industry: '',
            bio: '',
            website: '',
            linkedin: '',
            // Problem Solver
            skills: [],
            experience: '',
            portfolio: '',
            // Advisor
            expertise: '',
            specialties: '',
            languages: '',
            // Mentee
            advisorType: '',
            reason: '',
            experienceLevel: '',
            // Common
            sendTips: false,
            agreeTerms: false
        },

        validationSchema: Yup.object().shape( {
            firstName: Yup.string().required( 'First Name Required' ),
            lastName: Yup.string().required( 'Last Name Required' ),
            email: Yup.string().email( 'Invalid email' ).required( 'Email Required' ),
            password: Yup.string()
                .min( 8, 'Minimum 8 characters' )
                .matches( /[A-Z]/, 'Requires uppercase letter' )
                .matches( /[a-z]/, 'Requires lowercase letter' )
                .matches( /[\W_]/, 'Requires symbol' )
                .required( 'Password Required' ),

            // Conditional validations
            industry: Yup.string().when( 'userType', {
                is: 'Innovator',
                then: Yup.string().required( 'Industry Required' )
            } ),
            expertise: Yup.string().when( 'userType', {
                is: 'Advisor/Mentor',
                then: Yup.string().required( 'Expertise Required' )
            } ),
            agreeTerms: Yup.boolean()
                .oneOf( [true], 'You must accept the terms' )
        } ),

        onSubmit: values =>
        {
            if ( step === 1 ) {
                setStep( 2 );
            } else {
                console.log( 'Submitting:', values );
                // Handle form submission
            }
        }
    } );

    const renderRoleSpecificFields = () =>
    {
        switch ( formik.values.userType ) {
            case 'Innovator':
                return (
                    <Innovator />

                );

            case 'Problem Solver':
                return (
                    <ProblemSolver />
                );

            case 'Advisor/Mentor':
                return (
                    <Advisor />
                );

            case 'Client/Mentee':
                return (
                    <Client />
                );

            default:
                return null;
        }
    };

    return (
        <div className='themebg'>

            <div className="min-h-[80vh] bg-[#f8f9fa] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl w-full mx-auto max-w-5xl p-8"
                >


                    {step === 1 && (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold themetext mb-8">Join VovantSpace</h2>
                            <h2 className="text-2xl font-bold themetext mb-4 capitalize">select role:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        role: 'Innovator',
                                        description: 'Post challenges and find talented problem solvers for your projects.',
                                        icon: <FaLightbulb />,
                                    },
                                    {
                                        role: 'Problem Solver',
                                        description: 'Solve challenges, showcase your expertise, and earn rewards.',
                                        icon: <FaUsers />,
                                    },
                                    {
                                        role: 'Advisor/Mentor',
                                        description: 'Share your expertise and guide others in their professional journey.',
                                        icon: <FaGraduationCap />,
                                    },
                                    {
                                        role: 'Client/Mentee',
                                        description: 'Connect with advisors and get guidance for your career growth.',
                                        icon: <FaHandshake />,
                                    },
                                ].map( ( { role, description, icon } ) => (
                                    <button
                                        key={role}
                                        onClick={() =>
                                        {
                                            formik.setFieldValue( 'userType', role );
                                            setStep( 2 );
                                        }}
                                        className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#00674F] transition-all group focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                                    >
                                        <div className="flex flex-col justify-center">
                                            <div className='flex items-center text-center '>
                                            <div className="text-4xl themetext mr-3">
                                                {icon}
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-800 group-hover:themetext">
                                                {role}
                                            </h3>
                                            </div>
                                            <p className="text-left text-gray-600 mt-2">
                                                {description}
                                            </p>
                                        </div>
                                    </button>
                                ) )}
                            </div>
                            <div className="mt-8">
                                <p className="text-gray-600">
                                    Already have an account?
                                    <Link to="/login" className="themetext hover:underline ml-2">Login</Link>
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {renderRoleSpecificFields()}
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;