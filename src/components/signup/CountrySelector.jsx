import React, { useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'

const customTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#1A281F',     
    primary25: '#a9e8b9',   
    neutralBorder: '#31473A', 
  },
});

const CountrySelector = ({ value, onChange,disabled }) => {
  const options = useMemo(() => countryList().getData(), [])
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      isSearchable
      className='!border-[#31473A] !outline-[#31473A] !disabled:bg-gray-50 secondbg text-sm rounded-xl'
      placeholder="Select Country"
      theme={customTheme}
      isDisabled={disabled}
    />
  )
}

export default CountrySelector
