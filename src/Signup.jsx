import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { BsArrowRight, BsChevronRight } from 'react-icons/bs';
//import { FaGoogle, FaGithub } from 'react-icons/fa';
import Innovator from './components/signup/Innovator';
import ProblemSolver from './components/signup/ProblemSolver';
import Advisor from './components/signup/Advisor';
import Client from './components/signup/Client';
import RoleSelectionGrid from './components/RoleSelectionGrid';
import { useAppContext } from './context/AppContext';
//import { initiateOauthFlow } from '@/utils/oauthUtils';

const Signup = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { signup, isLoading } = useAppContext();
    const [submitError, setSubmitError] = useState('');
    const [step, setStep] = useState(1);
    // const [isOauthLoading, setIsOauthLoading] = useState(false);
    // const [oauthProvider, setOauthProvider] = useState(null);

    useEffect(() => {
        if (state?.userData && state?.fromOAuth) {
            formik.setValues({
                ...formik.values,
                firstName: state.userData.firstName || '',
                lastName: state.userData.lastName || '',
                email: state.userData.email || '',
                agreeTerms: true,
            });
            setStep(1);
        }
    }, [ state]);

    // const handleOauthSignup = async (provider) => {
    //     try {
    //         setSubmitError('');
    //         setIsOauthLoading(true);
    //         setOauthProvider(provider);
    //         const clientId =
    //             provider === 'google'
    //                 ? import.meta.env.VITE_GOOGLE_CLIENT_ID
    //                 : import.meta.env.VITE_GITHUB_CLIENT_ID;
    //
    //         if (!clientId) {
    //             throw new Error(
    //                 `${provider === 'google' ? 'Google' : 'GitHub'} authentication is not configured.`,
    //             );
    //         }
    //
    //         initiateOauthFlow(provider);
    //     } catch (error) {
    //         console.error(`${provider} OAuth signup error:`, error);
    //         setSubmitError(
    //             `Failed to initiate ${provider === 'google' ? 'Google' : 'GitHub'} signup. Please try again.`,
    //         );
    //         setIsOauthLoading(false);
    //         setOauthProvider(null);
    //     }
    // };

    const formik = useFormik({
        initialValues: {
            userType: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            country: null,
            timezone: null,
            organization: '',
            industry: '',
            bio: '',
            website: '',
            linkedin: '',
            skills: [],
            experience: '',
            portfolio: '',
            expertise: '',
            specialties: [],
            languages: [],
            advisorType: '',
            reason: [],
            experienceLevel: '',
            sendTips: false,
            agreeTerms: false,
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('First Name Required'),
            lastName: Yup.string().required('Last Name Required'),
            email: Yup.string().email('Invalid email').required('Email Required'),
            password: Yup.string().when('$fromOAuth', {
                is: false,
                then: () =>
                    Yup.string()
                        .min(8, 'Minimum 8 characters')
                        .matches(/[A-Z]/, 'Requires uppercase letter')
                        .matches(/[a-z]/, 'Requires lowercase letter')
                        .matches(/[\W_]/, 'Requires symbol')
                        .matches(/\d/, 'Requires number')
                        .required('Password Required'),
                otherwise: () => Yup.string(),
            }),
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
            skills: Yup.array().when('userType', {
                is: 'Problem Solver',
                then: (schema) =>
                    schema.min(1, 'Please select at least one skill').required('Skills Required'),
                otherwise: (schema) => schema,
            }),
            experience: Yup.string().when('userType', {
                is: 'Problem Solver',
                then: (schema) => schema.required('Experience level is Required'),
                otherwise: (schema) => schema,
            }),
            expertise: Yup.string().when('userType', {
                is: 'Advisor/Mentor',
                then: (schema) => schema.required('Expertise Required'),
                otherwise: (schema) => schema,
            }),
            advisorType: Yup.string().when('userType', {
                is: 'Client/Mentee',
                then: (schema) => schema.required('Advisor type Required'),
                otherwise: (schema) => schema,
            }),
            agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms'),
        }),
        context: { fromOAuth: state?.fromOAuth || false },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitError('');
            setSubmitting(true);

            if (step === 1) {
                setStep(2);
                setSubmitting(false);
                return;
            }

            try {
                const apiData = {
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    email: values.email.trim().toLowerCase(),
                    password: values.password || undefined,
                    role: values.userType,
                    sendTips: values.sendTips,
                    agreeTerms: values.agreeTerms,
                    ...(values.userType === 'Innovator' && {
                        organization: values.organization?.trim(),
                        industry: values.industry,
                        bio: values.bio?.trim(),
                        website: values.website?.trim(),
                        linkedin: values.linkedin?.trim(),
                    }),
                    ...(values.userType === 'Problem Solver' && {
                        skills: values.skills || [],
                        experience: values.experience,
                        portfolio: values.portfolio?.trim(),
                        linkedin: values.linkedin?.trim(),
                    }),
                    ...(values.userType === 'Advisor/Mentor' && {
                        expertise: values.expertise?.trim(),
                        specialties: Array.isArray(values.specialties) ? values.specialties.join(', ') : '',
                        languages: Array.isArray(values.languages) ? values.languages.join(', ') : '',
                    }),
                    ...(values.userType === 'Client/Mentee' && {
                        advisorType: values.advisorType,
                        reason: values.reason || [],
                        experienceLevel: values.experienceLevel,
                    }),
                };

                console.log('Submitting data:', apiData);

                const result = await signup(apiData);

                if (result.success) {
                    console.log('Signup successful:', result.user);
                    navigate('/login');
                } else {
                    setSubmitError(result.message || 'Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Signup error:', error.message, error.stack);
                setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const renderRoleSpecificFields = () => {
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
        setStep(2);
    };

    const isFormValid = useCallback(() => {
        const { userType, firstName, lastName, email, password, agreeTerms } = formik.values;

        const basicFieldsValid =
            firstName?.trim() && lastName?.trim() && email?.trim() && agreeTerms;

        const passwordValid =
            state?.fromOAuth ||
            (password &&
                password.length >= 8 &&
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /[\W_]/.test(password) &&
                /\d/.test(password));

        if (!basicFieldsValid || !passwordValid) {
            return false;
        }

        let roleSpecificValid = true;
        switch (userType) {
            case 'Innovator':
                roleSpecificValid = !!(formik.values.organization?.trim() && formik.values.industry);
                break;
            case 'Problem Solver':
                roleSpecificValid = !!(formik.values.skills?.length > 0 && formik.values.experience);
                break;
            case 'Advisor/Mentor':
                roleSpecificValid = !!formik.values.expertise?.trim();
                break;
            case 'Client/Mentee':
                roleSpecificValid = !!formik.values.advisorType;
                break;
            default:
                roleSpecificValid = true;
        }

        return basicFieldsValid && passwordValid && roleSpecificValid;
    }, [formik.values, state?.fromOAuth]);

    return (
        <div className="themebg">
            <div className="min-h-[80vh] bg-[#f8f9fa] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl w-full mx-auto max-w-5xl p-8"
                >
                    {step === 1 && (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold themetext mb-8">Join VovantSpace</h2>
                            {submitError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
                                    {submitError}
                                </div>
                            )}
                            {/*<div className="space-y-4 w-full max-w-md mx-auto mb-8">*/}
                            {/*    <button*/}
                            {/*        onClick={() => handleOauthSignup('google')}*/}
                            {/*        disabled={isLoading || isOauthLoading}*/}
                            {/*        className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"*/}
                            {/*    >*/}
                            {/*        {isOauthLoading && oauthProvider === 'google' ? (*/}
                            {/*            <>*/}
                            {/*                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>*/}
                            {/*                Connecting to Google...*/}
                            {/*            </>*/}
                            {/*        ) : (*/}
                            {/*            <>*/}
                            {/*                <FaGoogle className="text-xl" /> Continue with Google*/}
                            {/*            </>*/}
                            {/*        )}*/}
                            {/*    </button>*/}
                            {/*    <button*/}
                            {/*        onClick={() => handleOauthSignup('github')}*/}
                            {/*        disabled={isLoading || isOauthLoading}*/}
                            {/*        className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"*/}
                            {/*    >*/}
                            {/*        {isOauthLoading && oauthProvider === 'github' ? (*/}
                            {/*            <>*/}
                            {/*                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>*/}
                            {/*                Connecting to GitHub...*/}
                            {/*            </>*/}
                            {/*        ) : (*/}
                            {/*            <>*/}
                            {/*                <FaGithub className="text-xl" /> Continue with GitHub*/}
                            {/*            </>*/}
                            {/*        )}*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                            {/*<div className="my-8 flex items-center w-full max-w-md mx-auto">*/}
                            {/*    <div className="flex-1 border-t border-gray-300"></div>*/}
                            {/*    <span className="px-4 text-gray-500">Or</span>*/}
                            {/*    <div className="flex-1 border-t border-gray-300"></div>*/}
                            {/*</div>*/}
                            <h2 className="text-2xl font-bold themetext mb-4 capitalize">Select Role</h2>
                            <RoleSelectionGrid
                                selectedRole={formik.values.userType}
                                onRoleSelect={handleRoleSelection}
                            />
                            <div className="mt-8">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/login" className="themetext hover:underline ml-2">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                            >
                                <BsChevronRight className="mr-2 rotate-180" />
                                Back to role selection
                            </button>
                            <h2 className="text-2xl font-bold themetext mb-6">
                                Complete your {formik.values.userType} profile
                            </h2>
                            {submitError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {submitError}
                                </div>
                            )}
                            {renderRoleSpecificFields()}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="agreeTerms"
                                    checked={formik.values.agreeTerms}
                                    onChange={formik.handleChange}
                                    disabled={isLoading}
                                    className="mr-2 h-4 w-4"
                                />
                                <label className="text-gray-600">
                                    I agree to the{' '}
                                    <Link to="/terms" className="themetext hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="themetext hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                                {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                                    <div className="text-red-500 text-sm mt-1 ml-2">
                                        {formik.errors.agreeTerms}
                                    </div>
                                )}
                            </div>
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading || formik.isSubmitting || !isFormValid()}
                                    className={`w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
                                        isFormValid()
                                            ? 'bg-[#00674f] text-white hover:bg-[#005a43] cursor-pointer'
                                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    }`}
                                >
                                    {(isLoading || formik.isSubmitting) ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        <>
                                            Create Account
                                            <BsArrowRight className="ml-2" />
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

