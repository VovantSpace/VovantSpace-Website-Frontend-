import {useCallback, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {useFormik} from 'formik';
import {Link, useNavigate} from 'react-router-dom';
import * as Yup from 'yup';
import {FaGraduationCap, FaHandshake, FaLightbulb, FaUsers} from 'react-icons/fa';
import {BsArrowRight, BsChevronRight} from 'react-icons/bs';
import Innovator from './components/signup/Innovator';
import ProblemSolver from './components/signup/ProblemSolver';
import Advisor from './components/signup/Advisor';
import Client from './components/signup/Client';

import {useAppContext} from './context/AppContext.jsx'

const Signup = () => {
    const navigate = useNavigate();
    const {signup, isLoading} = useAppContext();
    const [submitError, setSubmitError] = useState('');
    const [step, setStep] = useState(1);
    const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Other'];
    const EXPERIENCE = ['0-1 years', '1-3 years', '4-6 years', '7-10 years', '10+ years'];

    const formik = useFormik({
        initialValues: {
            userType: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            country: null,
            timezone: null,
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
            specialties: [],
            languages: [],
            // Client/Mentee
            advisorType: '',
            reason: [],
            experienceLevel: '',
            // Common
            sendTips: false,
            agreeTerms: false
        },

        validationSchema: Yup.object().shape({
            firstName: Yup.string().required("First Name Required"),
            lastName: Yup.string().required("Last Name Required"),
            email: Yup.string().email('Invalid email').required("Email Required"),
            password: Yup.string()
                .min(8, 'Minimum 8 characters')
                .matches(/[A-Z]/, 'Requires uppercase letter')
                .matches(/[a-z]/, 'Requires lowercase letter')
                .matches(/[\W_]/, 'Requires symbol')
                .matches(/\d/, 'Requires number') // Added missing number validation
                .required('Password Required'),

            // Innovator validations
            organization: Yup.string().when('userType', {
                is: 'Innovator',
                then: (schema) => schema.required('Organization Required'),
                otherwise: (schema) => schema,
            }),
            industry: Yup.string().when('userType', {
                is: 'Innovator',
                then: (schema) => schema.required('Industry Required'),
                otherwise: (schema) => schema,
            }),

            // Problem Solver validations
            skills: Yup.array().when('userType', {
                is: 'Problem Solver',
                then: (schema) => schema.min(1, 'Please select at least one skill').required('Skills Required'),
                otherwise: (schema) => schema,
            }),
            experience: Yup.string().when('userType', {
                is: 'Problem Solver',
                then: (schema) => schema.required('Experience level is Required'),
                otherwise: (schema) => schema,
            }),

            // Advisor validations
            expertise: Yup.string().when('userType', {
                is: 'Advisor/Mentor',
                then: (schema) => schema.required('Expertise Required'),
                otherwise: (schema) => schema,
            }),

            // Client/Mentee validations
            advisorType: Yup.string().when('userType', {
                is: 'Client/Mentee',
                then: (schema) => schema.required('Advisor type Required'),
                otherwise: (schema) => schema,
            }),

            // Common validation
            agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms'),
        }),

        onSubmit: async (values, { setSubmitting }) => {
            // Prevent default form submission behavior
            event?.preventDefault();

            // Clear any previous errors
            setSubmitError('');
            setSubmitting(true);

            if (step === 1) {
                setStep(2);
                setSubmitting(false);
                return;
            }

            try {
                // Prepare data for API - map userType to role
                const apiData = {
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    email: values.email.trim().toLowerCase(),
                    password: values.password,
                    role: values.userType,
                    sendTips: values.sendTips,
                    agreeTerms: values.agreeTerms,

                    // Innovator fields
                    ...(values.userType === 'Innovator' && {
                        organization: values.organization?.trim(),
                        industry: values.industry,
                        bio: values.bio?.trim(),
                        website: values.website?.trim(),
                        linkedin: values.linkedin?.trim(),
                    }),

                    // Problem solver fields
                    ...(values.userType === 'Problem Solver' && {
                        skills: values.skills || [],
                        experience: values.experience,
                        portfolio: values.portfolio?.trim(),
                        linkedin: values.linkedin?.trim(),
                    }),

                    // Advisor fields
                    ...(values.userType === 'Advisor/Mentor' && {
                        expertise: values.expertise?.trim(),
                        specialties: Array.isArray(values.specialties) ? values.specialties.join(', ') : '',
                        languages: Array.isArray(values.languages) ? values.languages.join(', ') : '',
                    }),

                    // Client/Mentee fields
                    ...(values.userType === 'Client/Mentee' && {
                        advisorType: values.advisorType,
                        reason: values.reason || [],
                        experienceLevel: values.experienceLevel,
                    }),
                };

                console.log('Submitting data:', apiData); // Debug log

                const result = await signup(apiData);

                if (result.success) {
                    console.log('Signup successful:', result.user);
                    navigate('/login');
                } else {
                    setSubmitError(result.message || 'Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Signup error:', error.message, error.stack);
                setSubmitError(error.message ||'An unexpected error occurred. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    const renderRoleSpecificFields = () => {
        // Pass the formik instance directly - no extra props needed
        switch (formik.values.userType) {
            case 'Innovator':
                return <Innovator formik={formik} />;
            case 'Problem Solver':
                return <ProblemSolver formik={formik} />;
            case 'Advisor/Mentor':
                return <Advisor formik={formik} />;
            case 'Client/Mentee':
                return <Client formik={formik} />;
            default:
                return null;
        }
    };

    const handleRoleSelection = (role) => {
        formik.setFieldValue('userType', role);
        // Reset role-specific fields when changing roles
        formik.setFieldValue('skills', []);
        formik.setFieldValue('experience', '');
        formik.setFieldValue('portfolio', '');
        formik.setFieldValue('organization', '');
        formik.setFieldValue('industry', '');
        formik.setFieldValue('bio', '');
        formik.setFieldValue('expertise', '');
        formik.setFieldValue('specialties', []);
        formik.setFieldValue('languages', []);
        formik.setFieldValue('advisorType', '');
        formik.setFieldValue('reason', []);
        formik.setFieldValue('experienceLevel', '');
        // Don't reset country/timezone as they're common fields
        setStep(2);
    };

    // More robust form validation check
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const isFormValid = useCallback(() => {
        const {userType, firstName, lastName, email, password, agreeTerms} = formik.values;

        // Check if basic fields are filled
        const basicFieldsValid = firstName?.trim() &&
            lastName?.trim() &&
            email?.trim() &&
            password &&
            agreeTerms;

        // Check password requirements
        const passwordValid = password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[\W_]/.test(password) &&
            /\d/.test(password);

        console.log('Basic fields valid:', basicFieldsValid);
        console.log('Password valid:', passwordValid);

        if (!basicFieldsValid || !passwordValid) {
            return false;
        }

        // Check role-specific required fields
        let roleSpecificValid = true;
        switch (userType) {
            case 'Innovator':
                roleSpecificValid = !!(formik.values.organization?.trim() && formik.values.industry);
                console.log('Innovator fields valid:', roleSpecificValid, {
                    organization: !!formik.values.organization?.trim(),
                    industry: !!formik.values.industry
                });
                break;
            case 'Problem Solver':
                roleSpecificValid = !!(formik.values.skills?.length > 0 && formik.values.experience);
                console.log('Problem Solver fields valid:', roleSpecificValid, {
                    skills: formik.values.skills?.length || 0,
                    experience: !!formik.values.experience
                });
                break;
            case 'Advisor/Mentor':
                roleSpecificValid = !!formik.values.expertise?.trim();
                console.log('Advisor fields valid:', roleSpecificValid, {
                    expertise: !!formik.values.expertise?.trim()
                });
                break;
            case 'Client/Mentee':
                roleSpecificValid = !!formik.values.advisorType;
                console.log('Client fields valid:', roleSpecificValid, {
                    advisorType: !!formik.values.advisorType
                });
                break;
            default:
                roleSpecificValid = true;
        }

        return basicFieldsValid && passwordValid && roleSpecificValid;
    })

    // Enhanced debugging
    useEffect(() => {
        console.log('=== FORMIK DEBUG ===');
        console.log('Form values:', formik.values);
        console.log('Form errors:', formik.errors);
        console.log('Form touched:', formik.touched);
        console.log('Is form valid (Yup):', formik.isValid);
        console.log('Is form valid (custom):', isFormValid());
        console.log('Current step:', step);
        console.log('Selected userType:', formik.values.userType);
        console.log('==================');
    }, [formik.values, formik.errors, formik.touched, formik.isValid, step, isFormValid]);

    return (
        <div className='themebg'>
            <div className="min-h-[80vh] bg-[#f8f9fa] flex items-center justify-center p-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="bg-white rounded-2xl shadow-xl w-full mx-auto max-w-5xl p-8"
                >
                    {step === 1 && (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold themetext mb-8">Join VovantSpace</h2>
                            <h2 className="text-2xl font-bold themetext mb-4 capitalize">Select Role:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        role: 'Innovator',
                                        description: 'Post challenges and find talented problem solvers for your projects.',
                                        icon: <FaLightbulb/>,
                                    },
                                    {
                                        role: 'Problem Solver',
                                        description: 'Solve challenges, showcase your expertise, and earn rewards.',
                                        icon: <FaUsers/>,
                                    },
                                    {
                                        role: 'Advisor/Mentor',
                                        description: 'Share your expertise and guide others in their professional journey.',
                                        icon: <FaGraduationCap/>,
                                    },
                                    {
                                        role: 'Client/Mentee',
                                        description: 'Connect with advisors and get guidance for your career growth.',
                                        icon: <FaHandshake/>,
                                    },
                                ].map(({role, description, icon}) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => handleRoleSelection(role)}
                                        className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#00674F] transition-all group focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                                    >
                                        <div className="flex flex-col justify-center">
                                            <div className='flex items-center text-center'>
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
                                ))}
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
                        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
                            {/* Back button */}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                            >
                                <BsChevronRight className="mr-2 rotate-180"/>
                                Back to role selection
                            </button>

                            <h2 className="text-2xl font-bold themetext mb-6">
                                Complete your {formik.values.userType} profile
                            </h2>

                            {/* Error message */}
                            {submitError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {submitError}
                                </div>
                            )}

                            {renderRoleSpecificFields()}

                            {/* Submit button */}
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading || formik.isSubmitting}
                                    className={`w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
                                        isFormValid()
                                            ? 'bg-[#00674f] text-white hover:bg-[#005a43] cursor-pointer'
                                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    }`}
                                >
                                    {(isLoading || formik.isSubmitting) ? (
                                        <div className="flex items-center">
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        <>
                                            Create Account
                                            <BsArrowRight className="ml-2"/>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;