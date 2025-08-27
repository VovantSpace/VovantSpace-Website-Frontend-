import { useState } from 'react';
import PropTypes from 'prop-types';
import StickyCardContainer from './StickyCardContainer'
import DetailsForm from './DetailsForm';

const ProblemSolver = ({ formik}) => {
    const skillsList = [
        "Frontend Development",
        "Backend Development",
        "Full Stack Development",
        "Mobile App Development",
        "Game Development",
        "Software Engineering",
        "Data Science & Analytics",
        "Machine Learning & AI",
        "Blockchain Development",
        "Cybersecurity",
        "Cloud Computing",
        "Internet of Things (IoT)",
        "DevOps & Automation",
        "Database Management",
        "API Development & Integration",
        "Business Strategy & Growth Hacking",
        "Entrepreneurship & Startups",
        "Digital Marketing",
        "Branding & Personal Branding",
        "Sales & Lead Generation",
        "Market Research & Consumer Insights",
        "Financial Analysis & Investment Strategy",
        "E-commerce Strategy",
        "Project Management",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil & Structural Engineering",
        "Robotics & Automation",
        "Product Design & Prototyping",
        "Medical Research & Data Analysis",
        "HealthTech & Telemedicine Solutions",
        "Biotechnology & Biomedical Engineering",
        "Mental Health & Therapy Counseling",
        "Nutrition & Dietetics",
        "UI/UX Design",
        "Graphic Design",
        "Video Editing & Motion Graphics",
        "Content Writing & Copywriting",
        "Music Production & Sound Engineering",
        "Photography & Digital Arts",
        "Renewable Energy Solutions",
        "Climate Change & Environmental Science",
        "Sustainable Agriculture & Food Tech",
        "Smart Cities & Urban Planning",
        "Teaching & Coaching",
        "Curriculum Development & E-learning",
        "Research & Academic Writing",
        "Nonprofit & Social Entrepreneurship",
        "CivicTech & Government Innovation",
        "Diversity, Equity & Inclusion Initiatives"
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const filteredSkills = skillsList.filter(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSkillSelection = (skill) => {
        const currentSkills = formik.values.skills || [];
        const isSelected = currentSkills.includes(skill);

        if (isSelected) {
            // Remove skill if already selected
            const updatedSkills = currentSkills.filter(s => s !== skill);
            formik.setFieldValue('skills', updatedSkills);
        } else {
            // Add skill if not selected
            formik.setFieldValue('skills', [...currentSkills, skill]);
        }
    };

    const removeSkill = (skillToRemove) => {
        const updatedSkills = formik.values.skills.filter(skill => skill !== skillToRemove);
        formik.setFieldValue('skills', updatedSkills);
    };

    return (
        <>
            <div className='flex flex-col lg:flex-row gap-8 p-4 mx-auto'>
                <div className="flex-1 space-y-8 !max-w-[28rem]">
                    <DetailsForm formik={formik} />

                    <div className="max-w-xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-[#00674F]">Professional Details</h2>

                        {/* Debug info - remove in production */}
                        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                            <div>Skills: {JSON.stringify(formik.values.skills)}</div>
                            <div>Experience: {formik.values.experience}</div>
                            <div>Agree Terms: {formik.values.agreeTerms ? 'true' : 'false'}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Skills/Expertise</label>
                            <input
                                type="text"
                                placeholder="Search skills..."
                                className="w-full border rounded-lg p-2 mb-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="border rounded-lg p-4 h-32 overflow-y-auto">
                                {filteredSkills.map((skill, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`skill-${index}`}
                                            className="mr-2"
                                            checked={formik.values.skills?.includes(skill) || false}
                                            onChange={() => handleSkillSelection(skill)}
                                        />
                                        <label htmlFor={`skill-${index}`} className="text-gray-700 text-sm">{skill}</label>
                                    </div>
                                ))}
                            </div>
                            {formik.touched.skills && formik.errors.skills && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.skills}</div>
                            )}
                        </div>

                        {formik.values.skills && formik.values.skills.length > 0 && (
                            <div className="mt-4 mb-4">
                                <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Skills:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {formik.values.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-green-700 text-sm px-3 py-1 text-white rounded-xl flex items-center gap-2"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="text-white hover:text-red-200 text-lg leading-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
                            <select
                                name="experience"
                                className="w-full border rounded-lg p-2 text-sm"
                                value={formik.values.experience}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select experience level</option>
                                <option value="0-1 years">0-1 years</option>
                                <option value="1-3 years">1-3 years</option>
                                <option value="4-6 years">4-6 years</option>
                                <option value="7-10 years">7-10 years</option>
                                <option value="10+ years">10+ years</option>
                            </select>
                            {formik.touched.experience && formik.errors.experience && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.experience}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Portfolio or GitHub Link (Optional)</label>
                            <input
                                type="url"
                                name="portfolio"
                                className="w-full border rounded-lg p-3"
                                placeholder="https://github.com/username"
                                value={formik.values.portfolio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.portfolio && formik.errors.portfolio && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.portfolio}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">LinkedIn Profile (Optional)</label>
                            <input
                                type="url"
                                name="linkedin"
                                className="w-full border rounded-lg p-3"
                                placeholder="https://www.linkedin.com/in/username"
                                value={formik.values.linkedin}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.linkedin && formik.errors.linkedin && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.linkedin}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="sendTips"
                                    className="form-checkbox"
                                    checked={formik.values.sendTips}
                                    onChange={formik.handleChange}
                                />
                                <span className="ml-2 text-gray-700">Send me emails with tips on how to discover and solve challenges that match my skills on VovantSpace.</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="agreeTerms"
                                    className="form-checkbox"
                                    checked={formik.values.agreeTerms}
                                    onChange={formik.handleChange}
                                />
                                <span className="ml-2 text-gray-700">Yes, I understand and agree to the VovantSpace Terms of Service, including the User Agreement and Privacy Policy.</span>
                            </label>
                            {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.agreeTerms}</div>
                            )}
                        </div>
                    </div>
                </div>
                <StickyCardContainer
                    heading="Problem Solver Sign-Up Page"
                    para={<>Are you passionate about solving real-world challenges? As a problem solver on VovantSpace, you'll collaborate with innovators to develop groundbreaking solutions. Showcase your skills, tackle exciting projects, and make a lasting impact-all while building a powerful portfolio. <br /> <i> Join now and be part of solutions that drive change!</i></>}
                    subheading="Solve Challenges. Create Impact."
                />
            </div>
        </>
    )
}

// PropTypes definition
ProblemSolver.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        setFieldValue: PropTypes.func.isRequired,
        touched: PropTypes.object,
        errors: PropTypes.object,
    }).isRequired,
    isLoading: PropTypes.bool,
    EXPERIENCE: PropTypes.arrayOf(PropTypes.string),
};

export default ProblemSolver;