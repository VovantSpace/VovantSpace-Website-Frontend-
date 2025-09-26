import { useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import PropTypes from 'prop-types';

const customTheme = (theme) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary: '#1A281F',
        primary25: '#a9e8b9',
        neutralBorder: '#31473A',
    },
});

const CountrySelector = ({ value, onChange, disabled, customStyles = {} }) => {
    const options = useMemo(() => countryList().getData(), [])

    // Merge custom styles with default styles
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
            ...customStyles.control?.(provided),
        }),
        singleValue: (provided) => ({
            ...provided,
            ...customStyles.singleValue?.(provided),
        }),
        placeholder: (provided) => ({
            ...provided,
            ...customStyles.placeholder?.(provided),
        }),
    }

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
            styles={mergedStyles}
            isDisabled={disabled}
        />
    )
}

CountrySelector.propTypes = {
    value: PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    customStyles: PropTypes.shape({
        control: PropTypes.func,
        singleValue: PropTypes.func,
        placeholder: PropTypes.string,
    })
}

// Default props
CountrySelector.defaultProps = {
    value: null,
    disabled: false,
    customStyles: {},
}

export default CountrySelector