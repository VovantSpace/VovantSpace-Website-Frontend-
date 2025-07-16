import React from 'react';
import { FaGoogle, FaGithub, FaBuilding, FaIndustry, FaInfoCircle, FaLink, FaLinkedin } from 'react-icons/fa';
import DetailsForm from './DetailsForm';
import { Link } from 'react-router-dom';
import StickyCardContainer from './StickyCardContainer';

const customTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#31473A',     
      primary25: '#a9e8b9',   
      neutralBorder: '#31473A', 
    },
  });
  
const Innovator = () =>
{
    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4 mx-auto">
            {/* Main Form Container - Takes full available width */}
            <div className="flex-1 space-y-8 !max-w-[28rem]">
                <DetailsForm />

                {/* Professional Details Section */}
                <div className="w-full">
                    <h1 className="text-2xl font-semibold mb-6 text-[#00674F]">Professional Details</h1>
                    <div className="space-y-6">
                        {/* Organization Name */}
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="organization-name">
                                Organization Name (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaBuilding className="text-gray-400" />
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                    type="text"
                                    id="organization-name"
                                    placeholder='Organization Name'
                                />
                            </div>
                        </div>

                        {/* Industry Dropdown */}
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="industry">
                                Industry
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaIndustry className="text-gray-400" />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-[#31473A] rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#31473A] hover:border-[#31473A]"
                                    id="industry"
                                    placeholder="Select"
                              
                                 
                                >
                                    <option>Technology</option>
                                    <option >Business & Finance</option>
                                    <option >Healthcare</option>
                                    <option >Education</option>
                                    <option >Engineering</option>
                                    <option >Manufacturing</option>
                                    <option >Energy & Sustainability</option>
                                    <option >Media & Entertainment</option>
                                    <option >Retail & E-Commerce</option>
                                    <option >Transportation</option>
                                    <option >Agriculture</option>
                                    <option >Real Estate</option>
                                    <option >Social Impact</option>
                                    <option >Government & Public Policy</option>
                                    <option >Other</option>

                                </select>
                            </div>
                        </div>

                        {/* Bio Textarea */}
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="bio">
                                Short Bio/About You (Max 300 characters)
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3">
                                    <FaInfoCircle className="text-gray-400" />
                                </div>
                                <textarea
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                    id="bio"
                                    rows="4"
                                    placeholder='Short Bio'
                                ></textarea>
                            </div>
                            <div className="text-gray-500 text-sm mt-2">0/300 characters</div>
                        </div>

                        {/* Website Input */}
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="website">
                                Website (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLink className="text-gray-400" />
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                    type="text"
                                    id="website"
                                    placeholder="Website"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Section */}
                <div className="w-full">
                    <div className="space-y-6">
                        {/* LinkedIn Input */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="linkedin">
                                LinkedIn Profile (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLinkedin className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="linkedin"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                    placeholder='Linkedin Profile'
                                />
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 themetext mt-1"
                                    id="tips"
                                    required
                                />
                                <label htmlFor="tips" className="ml-3 text-gray-700 leading-tight">
                                    Send me emails with tips on how to find the right problem solvers for my challenges on VovantSpace.
                                </label>
                            </div>

                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-green-600 mt-1"
                                    id="terms"
                                    required
                                />
                                <label htmlFor="terms" className="ml-3 text-gray-700 leading-tight">
                                    Yes, I understand and agree to the VovantSpace Terms of Service, including the User Agreement and Privacy Policy.
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button className="w-full themebg text-white py-4 rounded-lg text-lg font-semibold  transition-colors focus:outline-none focus:ring-2  focus:ring-offset-2">
                            Create Account as Innovator
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky Card Container */}
            <StickyCardContainer heading={`Innovator Sign-Up Page`} para={<>Turn Vision Into Reality.
                Join a dynamic community of forward-thinkers, problem- solvers, and creators. As an innovator, you can propose challenges, form teams, and bring transformative ideas to life. Whether you're reshaping industries, pioneering new technologies, or driving social impact, VovantSpace is your launchpad for innovation.<br />
                <i>Sign up today and start shaping the future!</i>
            </>} subheading={`Solve Challenges. Create Impact.`} />
        </div>
    );
};

export default Innovator;