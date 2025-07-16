import React from 'react'
import { Link } from 'react-router-dom'
const StickyCardContainer = ({heading,subheading,para}) =>
{
    return (
        <div className="lg:w-[30rem] lg:block hidden themetext text-center">
            <div className="sticky top-[14%] space-y-4">
                <div className="bg-white px-8 py-2 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-[23px] font-bold mb-3 themetext">{heading}</h3>
                    <span className="themebg text-white rounded-xl py-2 px-4  mb-2">{subheading}</span>
                    <p className="text-gray-600 leading-relaxed mt-3">
                 {para}
                    </p>
                </div>

                {/* Login Link */}
                <div className="pt-1 border-t border-gray-200">
                    <p className="text-center text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="themetext hover:underline font-semibold hover:themetext transition-colors"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default StickyCardContainer