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

const TimezoneSelector = ({ selectedTimezone, setSelectedTimezone, timezones, customStyles = {} }) => {
    const timezoneOptions = timezones.map(tz => ({
        value: tz,
        label: `${tz} (UTC${moment.tz(tz).format('Z')}, ${moment.tz(tz).format('hh:mm A')})`
    }))

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
            options={timezoneOptions}
            value={selectedTimezone ? {
                value: selectedTimezone,
                label: `${selectedTimezone} (UTC${moment.tz(selectedTimezone).format('Z')}, ${moment.tz(selectedTimezone).format('hh:mm A')})`
            } : null}
            onChange={(selected) => setSelectedTimezone(selected ? selected.value : null)}
            isSearchable
            theme={customTheme}
            styles={mergedStyles}
            placeholder="Select Time Zone"
            className='!border-[#31473A] !outline-[#31473A] secondbg text-sm rounded-xl'
        />
    )
}

export default TimezoneSelector