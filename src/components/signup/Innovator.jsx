import PropTypes from 'prop-types';
import { FaBuilding, FaIndustry, FaInfoCircle, FaLink, FaLinkedin } from 'react-icons/fa';
import DetailsForm from './DetailsForm';
import StickyCardContainer from './StickyCardContainer';


const Innovator = ({ formik}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4 mx-auto">
            {/* Main Form Container - Takes full available width */}
            <div className="flex-1 space-y-8 !max-w-[28rem]">
                <DetailsForm formik={formik} />

                {/* Professional Details Section */}
                <div className="w-full">
                    <h1 className="text-2xl font-semibold mb-6 text-[#00674F]">Professional Details</h1>
                    <div className="space-y-6">
                        {/* Organization Name */}
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="organization-name">
                                Organization Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaBuilding className="text-gray-400" />
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                    type="text"
                                    id="organization-name"
                                    name="organization"
                                    placeholder='Organization Name'
                                    value={formik.values.organization || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.organization && formik.errors.organization && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.organization}</div>
                            )}
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
                                    name="industry"
                                    value={formik.values.industry || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Select Industry</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Business & Finance">Business & Finance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Energy & Sustainability">Energy & Sustainability</option>
                                    <option value="Media & Entertainment">Media & Entertainment</option>
                                    <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Social Impact">Social Impact</option>
                                    <option value="Government & Public Policy">Government & Public Policy</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {formik.errors.industry && formik.touched.industry && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.industry}</p>
                            )}
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
                                    name="bio"
                                    rows="4"
                                    placeholder='Short Bio'
                                    maxLength={300}
                                    value={formik.values.bio || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="text-gray-500 text-sm mt-2">
                                {(formik.values.bio || '').length}/300 characters
                            </div>
                            {formik.touched.bio && formik.errors.bio && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.bio}</div>
                            )}
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
                                    name="website"
                                    placeholder="Website"
                                    value={formik.values.website || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.website && formik.errors.website && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.website}</div>
                            )}
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
                                    name="linkedin"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                    placeholder='LinkedIn Profile'
                                    value={formik.values.linkedin || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.linkedin && formik.errors.linkedin && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.linkedin}</div>
                            )}
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 themetext mt-1"
                                    id="tips"
                                    name="sendTips"
                                    checked={formik.values.sendTips || false}
                                    onChange={formik.handleChange}
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
                                    name="agreeTerms"
                                    checked={formik.values.agreeTerms || false}
                                    onChange={formik.handleChange}
                                    required
                                />
                                <label htmlFor="terms" className="ml-3 text-gray-700 leading-tight">
                                    Yes, I understand and agree to the VovantSpace Terms of Service, including the User Agreement and Privacy Policy.
                                </label>
                            </div>
                            {formik.errors.agreeTerms && formik.touched.agreeTerms && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.agreeTerms}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Card Container */}
            <StickyCardContainer
                heading="Innovator Sign-Up Page"
                para={<>Turn Vision Into Reality.
                    Join a dynamic community of forward-thinkers, problem- solvers, and creators. As an innovator, you can propose challenges, form teams, and bring transformative ideas to life. Whether you&#39;re reshaping industries, pioneering new technologies, or driving social impact, VovantSpace is your launchpad for innovation.<br />
                    <i>Sign up today and start shaping the future!</i>
                </>}
                subheading="Solve Challenges. Create Impact."
            />
        </div>
    );
};

// PropTypes definition
Innovator.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        setFieldValue: PropTypes.func.isRequired,
        touched: PropTypes.object,
        errors: PropTypes.object,
    }).isRequired,
    INDUSTRIES: PropTypes.arrayOf(PropTypes.string),
    isLoading: PropTypes.bool,
};

export default Innovator;