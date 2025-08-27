import PropTypes from 'prop-types';
import { FaGoogle, FaGithub, FaUser, FaEnvelope, FaLock, FaGlobe, FaClock, FaBuilding, FaIndustry, FaInfoCircle, FaLink, FaLinkedin, FaTimes } from 'react-icons/fa';
import CountryandTime from './CountryandTime';
import DetailsForm from './DetailsForm';
import StickyCardContainer from './StickyCardContainer';

export const advisorOptions = [
    { key: "Business & Entrepreneurship", label: "Business & Entrepreneurship" },
    { key: "Mental Health & Therapy", label: "Mental Health & Therapy" },
    { key: "Career Coaching & Personal Development", label: "Career Coaching & Personal Development" },
    { key: "Technology & Software Development", label: "Technology & Software Development" },
    { key: "Finance, Investing & Wealth Management", label: " Finance, Investing & Wealth Management" },
    { key: "Relationships", label: "Relationships" },
    { key: "Life Coaching", label: "Life Coaching" },
    { key: "Cryptocurrency & Blockchain", label: "Cryptocurrency & Blockchain" },
    { key: "Health, Wellness & Nutrition", label: "Health, Wellness & Nutrition" },
    { key: "Legal & Compliance Consulting", label: "Legal & Compliance Consulting" },
    { key: "Education & Learning", label: "Education & Learning" },
    { key: "Creative & Media Coaching", label: "Creative & Media Coaching" }
];

export const advisorMapping = {
    "Business & Entrepreneurship": [
        "Startup Growth & Scaling",
        "Leadership & Executive Coaching",
        "Business Strategy",
        "Marketing & Branding",
        "Product Development",
        "Fundraising & Venture Capital",
        "Sales & Client Acquisition",
        "E-commerce"
    ],
    "Mental Health & Therapy": [
        "Anxiety & Stress Management",
        "Depression & Emotional Well-being",
        "Cognitive Behavioral Therapy (CBT)",
        "Family & Relationship Counseling",
        "Trauma & PTSD Support",
        "Grief Counseling",
        "Addiction Recovery"
    ],
    "Career Coaching & Personal Development": [
        "Resume & LinkedIn Optimization",
        "Interview Preparation",
        "Salary Negotiation",
        "Public Speaking & Communication",
        "Confidence & Motivation Coaching",
        "Productivity & Time Management",
        "Work-Life Balance"
    ],
    "Technology & Software Development": [
        "Software Engineering (Frontend, Backend, Full-Stack)",
        "Artificial Intelligence (AI) & Machine Learning",
        "Data Science & Analytics",
        "Cybersecurity & Ethical Hacking",
        "Blockchain & Web3 Development",
        "UI/UX Design",
        "Mobile App Development"
    ],
    "Finance, Investing & Wealth Management": [
        "Personal Finance & Budgeting",
        "Investing & Stock Market Strategies",
        "Cryptocurrency & Blockchain Investments",
        "Real Estate Investing",
        "Tax Planning",
        "Retirement Planning"
    ],
    "Relationships": [
        "Dating & Romantic Relationships",
        "Marriage Counseling",
        "Conflict Resolution",
        "Family Relationships"
    ],
    "Life Coaching": [
        "Goal Setting & Achievement",
        "Mindfulness & Meditation",
        "Work-Life Balance",
        "Spiritual Growth"
    ],
    "Cryptocurrency & Blockchain": [
        "Crypto Investing",
        "DeFi (Decentralized Finance)",
        "NFT & Web3 Development",
        "Smart Contracts"
    ],
    "Health, Wellness & Nutrition": [
        "Diet & Nutrition Planning",
        "Weight Loss & Fitness Coaching",
        "Sleep Optimization",
        "Women's Health",
        "Chronic Illness Management"
    ],
    "Legal & Compliance Consulting": [
        "Business & Corporate Law",
        "Intellectual Property (IP) & Trademarks",
        "Contract Law & Negotiation",
        "Employment & Labor Law",
        "Data Privacy & GDPR Compliance"
    ],
    "Education & Learning": [
        "Study & Exam Preparation",
        "Language Learning",
        "College Admissions & Scholarships",
        "E-learning & Online Course Creation"
    ],
    "Creative & Media Coaching": [
        "Graphic Design & Branding",
        "Content Writing & Copywriting",
        "Video Production & Editing",
        "Social Media Growth",
        "Public Relations & Brand Management"
    ]
};

const Client = ({ formik }) => {
    const selectedAdvisor = formik.values.advisorType;

    // Handle advisor change using formik
    const handleAdvisorChange = (e) => {
        formik.setFieldValue('advisorType', e.target.value);
        // Clear reasons when advisor type changes
        formik.setFieldValue('reason', []);
    };

    // Handle reason change using formik
    const handleReasonChange = (reason) => {
        const currentReasons = formik.values.reason || [];

        if (currentReasons.includes(reason)) {
            // Remove the reason if it's already selected
            const newReasons = currentReasons.filter(r => r !== reason);
            formik.setFieldValue('reason', newReasons);
        } else {
            // Add the reason if it's not selected and limit to 3 selections
            if (currentReasons.length < 3) {
                formik.setFieldValue('reason', [...currentReasons, reason]);
            }
        }
    };

    // Remove reason using formik
    const removeReason = (reason) => {
        const currentReasons = formik.values.reason || [];
        const newReasons = currentReasons.filter(r => r !== reason);
        formik.setFieldValue('reason', newReasons);
    };

    return (
        <div className='flex flex-col lg:flex-row gap-8 p-4 max-w-7xl mx-auto'>
            <div className="flex-1 space-y-8 !max-w-[28rem]">
                <DetailsForm formik={formik} />
                <div className="max-w-xl mx-auto">
                    <h1 className="text-xl font-semibold mb-4 text-[#00674F]">Advisory Needs & Preferences</h1>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Advisor Type</label>
                        <select
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            onChange={handleAdvisorChange}
                            value={selectedAdvisor || ''}
                            name="advisorType"
                        >
                            <option value="">Select Preferred Advisor Type</option>
                            {advisorOptions.map((option, index) => (
                                <option key={index} value={option.key}>{option.label}</option>
                            ))}
                        </select>
                        {formik.errors.advisorType && formik.touched.advisorType && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.advisorType}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Joining (Select up to 3)
                        </label>
                        <div className="relative max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                            {selectedAdvisor ? (
                                advisorMapping[selectedAdvisor].map((reason, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`reason-${index}`}
                                            value={reason}
                                            checked={(formik.values.reason || []).includes(reason)}
                                            onChange={() => handleReasonChange(reason)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`reason-${index}`} className="text-sm text-gray-700">
                                            {reason}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">
                                    Select Preferred Advisor Type first
                                </div>
                            )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(formik.values.reason || []).map((reason, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                                >
                                    {reason}
                                    <button
                                        type="button"
                                        className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                                        onClick={() => removeReason(reason)}
                                    >
                                        <FaTimes />
                                    </button>
                                </span>
                            ))}
                        </div>
                        {formik.errors.reason && formik.touched.reason && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.reason}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile (Optional)</label>
                        <input
                            type="text"
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="LinkedIn Profile"
                            name="linkedin"
                            value={formik.values.linkedin || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.errors.linkedin && formik.touched.linkedin && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.linkedin}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 themetext"
                                name="sendTips"
                                checked={formik.values.sendTips || false}
                                onChange={formik.handleChange}
                            />
                            <span className="ml-2 text-sm text-gray-700">Send me emails with tips on how to find the best advisors and book impactful sessions on VovantSpace.</span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 themetext"
                                name="agreeTerms"
                                checked={formik.values.agreeTerms || false}
                                onChange={formik.handleChange}
                                required
                            />
                            <span className="ml-2 text-sm text-gray-700">Yes, I understand and agree to the VovantSpace Terms of Service, including the User Agreement and Privacy Policy.</span>
                        </label>
                        {formik.errors.agreeTerms && formik.touched.agreeTerms && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.agreeTerms}</p>
                        )}
                    </div>
                </div>
            </div>
            <StickyCardContainer
                heading={`Client/Mentee Sign-Up Page`}
                para={<>
                    Unlock your full potential by connecting with experienced mentors who can guide you through career decisions, skill development, and life challenges. Whether you need industry insights, technical coaching, personal advice, or emotional support, VovantSpace provides the right mentors to help you succeed. Set your path, gain clarity, your future. and take meaningful steps toward. <br/> <i> Sign up now and take control of your journey!</i>
                </>}
                subheading={`Learn. Grow. Achieve.`}
            />
        </div>
    )
}

// PropTypes definition
Client.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({
            advisorType: PropTypes.string,
            reason: PropTypes.arrayOf(PropTypes.string),
            linkedin: PropTypes.string,
            sendTips: PropTypes.bool,
            agreeTerms: PropTypes.bool,
        }).isRequired,
        errors: PropTypes.object.isRequired,
        touched: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        setFieldValue: PropTypes.func.isRequired,
    }).isRequired
};

export default Client