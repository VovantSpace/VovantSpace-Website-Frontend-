import React, { useState } from 'react';
import StickyCardContainer from './StickyCardContainer'
import DetailsForm from './DetailsForm';

const ProblemSolver = () => {
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

    const [selectedSkill, setSelectedSkill] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSkills = skillsList.filter(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSkillSelection = (skill) => {
        setSelectedSkill(prev => prev === skill ? '' : skill);
    };

    return (
        <>
            <div className='flex flex-col lg:flex-row gap-8 p-4 mx-auto'>
                <div className="flex-1 space-y-8 !max-w-[28rem]">
                    <DetailsForm />

                    <div className="max-w-xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-[#00674F]">Professional Details</h2>
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
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`skill-${index}`}
                                            className="mr-2"
                                            checked={selectedSkill === skill}
                                            onChange={() => handleSkillSelection(skill)}
                                        />
                                        <label htmlFor={`skill-${index}`} className="text-gray-700">{skill}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {selectedSkill && (
                            <div className="mt-4 mb-2">
                                <h3 className="text-lg font-medium text-gray-700">Selected Skill:</h3>
                                <ul className="flex flex-wrap gap-2">
                                    <li className="bg-green-700 text-sm px-2 py-1 text-white rounded-xl">{selectedSkill}</li>
                                </ul>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
                            <select className="w-full border rounded-lg p-2 text-sm">
                                <option>0-1 years</option>
                                <option>1-3 years</option>
                                <option selected>4-6 years</option>
                                <option>7-10 years</option>
                                <option>10+ years</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Portfolio or GitHub Link (Optional)</label>
                            <input type="url" className="w-full border rounded-lg p-3" placeholder="https://github.com/username" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">LinkedIn Profile (Optional)</label>
                            <input type="url" className="w-full border rounded-lg p-3" placeholder="https://www.linkedin.com/in/username" />
                        </div>

                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input type="checkbox" className="form-checkbox" required />
                                <span className="ml-2 text-gray-700">Send me emails with tips on how to discover and solve challenges that match my skills on VovantSpace.</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input type="checkbox" className="form-checkbox" required />
                                <span className="ml-2 text-gray-700">Yes, I understand and agree to the VovantSpace Terms of Service, including the User Agreement and Privacy Policy.</span>
                            </label>
                        </div>

                        <button className="w-full themebg text-white font-medium py-3 rounded-lg">Create Account as Problem Solver</button>
                    </div>
                </div>
                <StickyCardContainer 
                    heading={`Problem Solver Sign-Up Page`} 
                    para={<>Are you passionate about solving real-world challenges? As a problem solver on VovantSpace, you'll collaborate with innovators to develop groundbreaking solutions. Showcase your skills, tackle exciting projects, and make a lasting impact-all while building a powerful portfolio. <br /> <i> Join now and be part of solutions that drive change!</i></>} 
                    subheading={`Solve Challenges. Create Impact.`} 
                />
            </div>
        </>
    )
}

export default ProblemSolver;