import React, { useState, useEffect } from 'react'
import ct from 'countries-and-timezones'
import CountrySelector from '@/components/signup/CountrySelector'
import TimezoneSelector from '@/components/signup/TimeZoneSelector'
import { FaGlobe, FaClock } from 'react-icons/fa'

const CountryandTime = ({flex,disable}) => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedTimezone, setSelectedTimezone] = useState(null)
  const [countryTimezones, setCountryTimezones] = useState([])

  useEffect(() => {
    if (selectedCountry) {
      const countryData = ct.getCountry(selectedCountry.value)
      const tzs = countryData?.timezones || []
      setCountryTimezones(tzs)
      if (tzs.length > 0) {
        setSelectedTimezone(tzs[0])
      } else {
        setSelectedTimezone(null)
      }
    } else {
      setCountryTimezones([])
      setSelectedTimezone(null)
    }
  }, [selectedCountry])

  return (
    <div className={`grid md:grid-cols-2 gap-6`}>
      <div>
        <label className="block text-gray-700 font-medium dark:text-white text-sm">Country</label>
        <div className="relative mt-2 secondbg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaGlobe className="text-gray-400" />
          </div>
          <CountrySelector value={selectedCountry} onChange={setSelectedCountry} disabled={disable} />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-medium dark:text-white text-sm">Time Zone</label>
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaClock className="text-gray-400" />
          </div>
          <TimezoneSelector selectedTimezone={selectedTimezone} setSelectedTimezone={setSelectedTimezone} timezones={countryTimezones} />
        </div>
      </div>
    </div>
  )
}

export default CountryandTime
