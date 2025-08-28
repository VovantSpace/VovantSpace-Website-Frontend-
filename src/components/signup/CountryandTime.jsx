import { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import ct from 'countries-and-timezones'
import CountrySelector from './CountrySelector'
import TimezoneSelector from './TimeZoneSelector'
import { FaGlobe, FaClock } from 'react-icons/fa'

const CountryandTime = ({ formik }) => {
    // Get values from formik instead of local state
    const selectedCountry = formik.values.country || null
    const selectedTimezone = formik.values.timezone || null

    // Use useCallback to memoize the setFieldValue function
    const setTimezone = useCallback((timezone) => {
        formik.setFieldValue('timezone', timezone)
    }, [formik])

    useEffect(() => {
        if (selectedCountry) {
            const countryData = ct.getCountry(selectedCountry.value || selectedCountry)
            const tzs = countryData?.timezones || []

            // Only update timezone if there are timezones and no timezone is currently selected
            if (tzs.length > 0 && !selectedTimezone) {
                setTimezone(tzs[0])
            } else if (tzs.length === 0 && selectedTimezone) {
                setTimezone(null)
            }
        } else if (selectedTimezone) {
            // Only clear timezone if it's currently set
            setTimezone(null)
        }
    }, [setTimezone, selectedTimezone, selectedCountry])

    const handleCountryChange = (country) => {
        formik.setFieldValue('country', country)
    }

    const handleTimezoneChange = (timezone) => {
        formik.setFieldValue('timezone', timezone)
    }

    // Get country timezones for the timezone selector
    const getCountryTimezones = () => {
        if (!selectedCountry) return []
        const countryData = ct.getCountry(selectedCountry.value || selectedCountry)
        return countryData?.timezones || []
    }

    // Custom styles to accommodate the icons
    const selectWithIconStyles = {
        control: (provided) => ({
            ...provided,
            paddingLeft: '2.5rem', // Add left padding for the icon
        }),
        singleValue: (provided) => ({
            ...provided,
            marginLeft: 0, // Reset margin since we're using padding on control
        }),
        placeholder: (provided) => ({
            ...provided,
            marginLeft: 0, // Reset margin since we're using padding on control
        }),
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            <div>
                <label className="block text-gray-700 font-medium">Country</label>
                <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                        <FaGlobe className="text-gray-400" />
                    </div>
                    <div className="relative">
                        <CountrySelector
                            value={selectedCountry}
                            onChange={handleCountryChange}
                            customStyles={selectWithIconStyles}
                        />
                    </div>
                    {formik.touched.country && formik.errors.country && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.country}</div>
                    )}
                </div>
            </div>
            <div>
                <label className="block text-gray-700 font-medium">Time Zone</label>
                <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                        <FaClock className="text-gray-400" />
                    </div>
                    <div className="relative">
                        <TimezoneSelector
                            selectedTimezone={selectedTimezone}
                            setSelectedTimezone={handleTimezoneChange}
                            timezones={getCountryTimezones()}
                            customStyles={selectWithIconStyles}
                        />
                    </div>
                    {formik.touched.timezone && formik.errors.timezone && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.timezone}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

// PropTypes definition
CountryandTime.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({
            country: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
            timezone: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        }).isRequired,
        errors: PropTypes.object.isRequired,
        touched: PropTypes.object.isRequired,
        setFieldValue: PropTypes.func.isRequired,
    }).isRequired
};

export default CountryandTime