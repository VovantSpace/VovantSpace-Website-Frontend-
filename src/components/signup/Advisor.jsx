import React, { useState } from 'react';
import
{
    FaGoogle, FaGithub, FaUser, FaEnvelope, FaLock, FaGlobe,
    FaClock, FaBuilding, FaIndustry, FaLink, FaLinkedin, FaGraduationCap,
    FaTags, FaChartLine, FaHandshake
} from 'react-icons/fa';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import DetailsForm from './DetailsForm';
import StickyCardContainer from './StickyCardContainer';


const EXPERTISE_SPECIALTIES = {
    'Business & Entrepreneurship': [
      'Startup Growth & Scaling',
      'Leadership & Executive Coaching',
      'Business Strategy',
      'Marketing & Branding',
      'Product Development',
      'Fundraising & Venture Capital',
      'Sales & Client Acquisition',
      'E-commerce'
    ],
    'Mental Health & Therapy': [
      'Anxiety & Stress Management',
      'Depression & Emotional Well-being',
      'Cognitive Behavioral Therapy (CBT)',
      'Family & Relationship Counseling',
      'Trauma & PTSD Support',
      'Grief Counseling',
      'Addiction Recovery'
    ],
    'Career Coaching & Personal Development': [
      'Resume & LinkedIn Optimization',
      'Interview Preparation',
      'Salary Negotiation',
      'Public Speaking & Communication',
      'Confidence & Motivation Coaching',
      'Productivity & Time Management',
      'Work-Life Balance'
    ],
    'Technology & Software Development': [
      'Software Engineering (Frontend, Backend, Full-Stack)',
      'Artificial Intelligence (AI) & Machine Learning',
      'Data Science & Analytics',
      'Cybersecurity & Ethical Hacking',
      'Blockchain & Web3 Development',
      'UI/UX Design',
      'Mobile App Development'
    ],
    'Finance, Investing & Wealth Management': [
      'Personal Finance & Budgeting',
      'Investing & Stock Market Strategies',
      'Cryptocurrency & Blockchain Investments',
      'Real Estate Investing',
      'Tax Planning',
      'Retirement Planning'
    ],
    'Relationships': [
      'Dating & Romantic Relationships',
      'Marriage Counseling',
      'Conflict Resolution',
      'Family Relationships'
    ],
    'Life Coaching': [
      'Goal Setting & Achievement',
      'Mindfulness & Meditation',
      'Work-Life Balance',
      'Spiritual Growth'
    ],
    'Cryptocurrency & Blockchain': [
      'Crypto Investing',
      'DeFi (Decentralized Finance)',
      'NFT & Web3 Development',
      'Smart Contracts'
    ],
    'Health, Wellness & Nutrition': [
      'Diet & Nutrition Planning',
      'Weight Loss & Fitness Coaching',
      'Sleep Optimization',
      'Women’s Health',
      'Chronic Illness Management'
    ],
    'Legal & Compliance Consulting': [
      'Business & Corporate Law',
      'Intellectual Property (IP) & Trademarks',
      'Contract Law & Negotiation',
      'Employment & Labor Law',
      'Data Privacy & GDPR Compliance'
    ],
    'Education & Learning': [
      'Study & Exam Preparation',
      'Language Learning',
      'College Admissions & Scholarships',
      'E-learning & Online Course Creation'
    ],
    'Creative & Media Coaching': [
      'Graphic Design & Branding',
      'Content Writing & Copywriting',
      'Video Production & Editing',
      'Social Media Growth',
      'Public Relations & Brand Management'
    ]
  }
  

const validationSchema = Yup.object().shape( {
    firstName: Yup.string().required( 'First Name is required' ),
    lastName: Yup.string().required( 'Last Name is required' ),
    email: Yup.string().email( 'Invalid email' ).required( 'Email is required' ),
    password: Yup.string()
        .min( 8, 'Minimum 8 characters' )
        .matches( /[A-Z]/, 'Requires uppercase letter' )
        .matches( /[a-z]/, 'Requires lowercase letter' )
        .matches( /[\W_]/, 'Requires symbol' )
        .required( 'Password is required' ),
    expertise: Yup.string().required( 'Expertise is required' ),
    specialties: Yup.array()
        .max( 3, 'Maximum 3 specialties allowed' )
        .required( 'At least one specialty is required' ),
    yearsExperience: Yup.string().required( 'Experience is required' ),
    languages: Yup.array().min( 1, 'At least one language is required' ),
    bio: Yup.string()
        .max( 300, 'Maximum 300 characters' )
        .required( 'Bio is required' ),
    agreeTerms: Yup.boolean().oneOf( [true], 'You must accept the terms' )
} );

function Advisor ()
{
    const formik = useFormik( {
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            country: '',
            timeZone: '',
            expertise: '',
            specialties: [],
            yearsExperience: '',
            languages: [],
            bio: '',
            linkedin: '',
            sendTips: false,
            agreeTerms: false
        },
        validationSchema,
        onSubmit: values =>
        {
            console.log( 'Form submitted:', values );
        }
    } );

    return (
        <div className='flex flex-col lg:flex-row gap-8 p-4 mx-auto '>
            <div
              
                className="flex-1 space-y-8 !max-w-[28rem]"
            >
                <DetailsForm />
                {/* Professional Details */}
                <div className="space-y-6 ">
                    <h2 className="text-2xl font-semibold text-[#00674F]">Professional Details</h2>

                    {/* Expertise */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Expertise</label>
                        <div className="relative">

                            <select
                                name="expertise"
                                className="w-full pl-3 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                                {...formik.getFieldProps( 'expertise' )}
                                onChange={e =>
                                {
                                    formik.setFieldValue( 'expertise', e.target.value );
                                    formik.setFieldValue( 'specialties', [] );
                                }}
                            >
                                <option value="">Select Expertise</option>
                                {Object.keys( EXPERTISE_SPECIALTIES ).map( expertise => (
                                    <option key={expertise} value={expertise}>{expertise}</option>
                                ) )}
                            </select>

                        </div>
                    </div>

                    {/* Specialties */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Specialties (Select up to 3)
                        </label>
                        <div className="flex flex-col space-y-2">
                            {formik.values.expertise &&
                                EXPERTISE_SPECIALTIES[formik.values.expertise]?.map( specialty => (
                                    <label key={specialty} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="specialties"
                                            value={specialty}
                                            checked={formik.values.specialties.includes( specialty )}
                                            onChange={e =>
                                            {
                                                const checked = e.target.checked;
                                                let newSpecialties = [...formik.values.specialties];
                                                if ( checked ) {
                                                    if ( newSpecialties.length < 3 ) {
                                                        newSpecialties.push( specialty );
                                                    }
                                                } else {
                                                    newSpecialties = newSpecialties.filter( s => s !== specialty );
                                                }
                                                formik.setFieldValue( 'specialties', newSpecialties );
                                            }}
                                            className="mr-2"
                                        />
                                        {specialty}
                                    </label>
                                ) )
                            }
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {formik.values.specialties.map( specialty => (
                                <div key={specialty} className="bg-[#00674F]/10 themetext px-3 py-1 rounded-full flex items-center">
                                    {specialty}
                                    <button
                                        type="button"
                                        onClick={() => formik.setFieldValue(
                                            'specialties',
                                            formik.values.specialties.filter( s => s !== specialty )
                                        )}
                                        className="ml-2 hover:text-[#005741]"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) )}
                        </div>
                    </div>

                    {/* Years of Experience */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
                        <div className="relative">
                            <FaChartLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                name="yearsExperience"
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                                {...formik.getFieldProps( 'yearsExperience' )}
                            >

                                <option value="1-3">1-3 years</option>
                                <option value="4-6">4-6 years</option>
                                <option value="7-10">7-10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                            {formik.touched.yearsExperience && formik.errors.yearsExperience && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.yearsExperience}</div>
                            )}
                        </div>
                    </div>

                    {/* Languages Spoken */}
                    <div>
                        <label className=" text-gray-700 font-medium mb-2">Languages Spoken</label>
                        <div className="">

                            <select
                                multiple
                                name="languages"
                                className="w-full pl-3 pr-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31473A] h-32"
                                {...formik.getFieldProps( 'languages' )}
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Chinese">Chinese</option>
                            </select>
                            {formik.touched.languages && formik.errors.languages && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.languages}</div>
                            )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formik.values.languages.map( language => (
                                <div key={language} className="bg-[#00674F]/10 text-[#00674F] px-3 py-1 rounded-full flex items-center">
                                    {language}
                                    <button
                                        type="button"
                                        onClick={() => formik.setFieldValue(
                                            'languages',
                                            formik.values.languages.filter( l => l !== language )
                                        )}
                                        className="ml-2 hover:text-[#005741]"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Short Bio/About You (Max 300 characters)
                        </label>
                        <textarea
                            name="bio"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                            rows="4"
                            {...formik.getFieldProps( 'bio' )}
                            placeholder='Short Bio'
                        />
                        <div className="text-right text-sm text-gray-500">
                            {formik.values.bio.length}/300
                        </div>
                        {formik.touched.bio && formik.errors.bio && (
                            <div className="text-red-500 text-sm ">{formik.errors.bio}</div>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            LinkedIn Profile (Optional)
                        </label>
                        <div className="relative">
                            <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                name="linkedin"
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                                {...formik.getFieldProps( 'linkedin' )}
                                placeholder='Linkedin Profile'
                            />
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4">
                        <label className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                className="mt-1 form-checkbox h-5 w-5 text-[#00674F]"
                                required
                                {...formik.getFieldProps( 'sendTips' )}
                            />
                            <span className="text-gray-700">
                                Send me emails with tips on how to connect with clients/mentees and grow my advisory presence on VovantSpace.
                            </span>
                        </label>

                        <label className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                className="mt-1 form-checkbox h-5 w-5 text-[#00674F]"
                                required
                                {...formik.getFieldProps( 'agreeTerms' )}
                            />
                            <span className="text-gray-700">
                                Yes, I understand and agree to the VovantSpace Terms of Service, including the User Agreement and Privacy Policy.
                            </span>
                        </label>
                        {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                            <div className="text-red-500 text-sm">{formik.errors.agreeTerms}</div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full themebg text-white py-3 rounded-lg font-semibold hover:bg-[#005741] transition-all"
                        onClick={formik.handleSubmit}
                    >
                        Create Account as Advisor/Mentor
                    </button>
                </div>
            </div>
            <StickyCardContainer heading={`Advisor/Mentor Sign-Up Page`} para={<>Make a lasting impact by mentoring the next generation of innovators, problem solvers, and changemakers. As a mentor on VovantSpace, you'll provide valuable career insights, technical expertise, and life guidance to help mentees navigate challenges and achieve their goals. Whether offering strategic advice, personal development support, or industry expertise, your mentorship can change lives. <br /> <i> Join now and start shaping the future!</i></>} subheading={`Inspire. Guide. Transform.`} />
        </div>
    );
}

export default Advisor;