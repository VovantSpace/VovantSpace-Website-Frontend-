import React from 'react'
import Select from 'react-select'
import moment from 'moment-timezone'

const customTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#31473A',     
    primary25: '#a9e8b9',   
    neutralBorder: '#31473A', 
  },
});

const TimezoneSelector = ({ selectedTimezone, setSelectedTimezone, timezones }) => {
  const timezoneOptions = timezones.map(tz => ({
    value: tz,
    label: `${tz} (UTC${moment.tz(tz).format('Z')}, ${moment.tz(tz).format('hh:mm A')})`
  }))
  return (
    <Select
      options={timezoneOptions}
      value={selectedTimezone ? { value: selectedTimezone, label: `${selectedTimezone} (UTC${moment.tz(selectedTimezone).format('Z')}, ${moment.tz(selectedTimezone).format('hh:mm A')})` } : null}
      onChange={(selected) => setSelectedTimezone(selected ? selected.value : null)}
      isSearchable
      theme={customTheme}
      placeholder="Select Time Zone"
      className='!border-[#31473A] !outline-[#31473A] secondbg text-sm'
    />
  )
}

export default TimezoneSelector
