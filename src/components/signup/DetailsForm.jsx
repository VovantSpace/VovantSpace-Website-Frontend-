import PropTypes from 'prop-types'
import {FaUser, FaEnvelope, FaLock} from 'react-icons/fa'
import CountryandTime from './CountryandTime'

const DetailsForm = ({formik}) => {
    // Get password from formik instead of local state
    const password = formik.values.password || ""
    const isLengthValid = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasSymbol = /[^A-Za-z0-9]/.test(password)
    const hasNumber = /\d/.test(password);

    return (
        <>
            <div className="w-full max-w-xl mx-auto">
                <div className="my-2 flex items-center w-full">
                    <div className="flex-1 border-t border-gray-300"></div>
                    {/*<span className="px-4 text-gray-500">Or</span>*/}
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
                <h2 className="text-2xl font-semibold mb-6 text-[#00674F]">Basic Information</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium">First Name</label>
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400"/>
                                </div>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formik.values.firstName || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                    required
                                    placeholder='First Name'
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Last Name</label>
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400"/>
                                </div>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formik.values.lastName || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                    required
                                    placeholder='Last Name'
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-gray-400"/>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                required
                                placeholder='Email'
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400"/>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#31473A]"
                                placeholder='Password'
                                required
                                autoComplete="new-password" // Prevent browser autofill issues
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}
                        </div>
                        <ul className="mt-3 text-sm space-y-1">
                            <li className={isLengthValid ? "text-green-600" : "text-red-600"}>• Password must be at
                                least 8 characters long
                            </li>
                            <li className={hasUppercase ? "text-green-600" : "text-red-600"}>• Password must contain at
                                least one uppercase letter
                            </li>
                            <li className={hasLowercase ? "text-green-600" : "text-red-600"}>• Password must contain at
                                least one lowercase letter
                            </li>
                            <li className={hasSymbol ? "text-green-600" : "text-red-600"}>• Password must contain at
                                least one symbol
                            </li>
                            <li className={hasNumber ? "text-green-600" : "text-red-600"}>• Password must contain at
                                least one number
                            </li>
                        </ul>
                    </div>
                    <CountryandTime formik={formik}/>
                </div>
            </div>
        </>
    )
}

// PropTypes definition
DetailsForm.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            email: PropTypes.string,
            password: PropTypes.string,
        }).isRequired,
        errors: PropTypes.object.isRequired,
        touched: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
    }).isRequired
};

export default DetailsForm