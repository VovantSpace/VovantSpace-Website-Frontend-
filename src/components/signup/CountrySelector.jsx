import { useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import PropTypes from 'prop-types'

const customTheme = (theme) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary: '#1A281F',
        primary25: '#a9e8b9',
        neutralBorder: '#31473A',
    },
})

const CountrySelector = ({ value, onChange, disabled, customStyles = {} }) => {
    const options = useMemo(() => countryList().getData(), [])

    // Ensure value is always a valid option object
    const selectedOption = useMemo(() => {
        if (!value) return null
        if (typeof value === 'string') {
            // handle if only the country code is passed
            return options.find((option) => option.value === value) || null
        }
        return options.find((option) => option.value === value.value) || null
    }, [value, options])

    const defaultStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '40px',
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
    }

    const mergedStyles = {
        ...defaultStyles,
        control: (provided) => ({
            ...defaultStyles.control(provided),
            ...(customStyles.control ? customStyles.control(provided) : {}),
        }),
        singleValue: (provided) => ({
            ...provided,
            ...(customStyles.singleValue ? customStyles.singleValue(provided) : {}),
        }),
        placeholder: (provided) => ({
            ...provided,
            ...(customStyles.placeholder ? customStyles.placeholder(provided) : {}),
        }),
    }

    return (
        <Select
            options={options}
            value={selectedOption}
            onChange={onChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            isSearchable
            className='!border-[#31473A] !outline-[#31473A] !disabled:bg-gray-50 secondbg text-sm rounded-xl'
            placeholder='Select Country'
            theme={customTheme}
            styles={mergedStyles}
            isDisabled={disabled}
        />
    )
}

CountrySelector.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string,
        }),
        PropTypes.string,
    ]),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    customStyles: PropTypes.object,
}

CountrySelector.defaultProps = {
    value: null,
    disabled: false,
    customStyles: {},
}

export default CountrySelector