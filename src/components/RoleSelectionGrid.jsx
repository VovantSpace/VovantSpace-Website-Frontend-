import {FaGraduationCap, FaHandshake, FaLightbulb, FaUsers} from "react-icons/fa";
import PropTypes from 'prop-types';

const RoleSelectionGrid = ({selectedRole, onRoleSelect, showBackButton = false, onBack}) => {
    const roles = [
        {
            role: 'Innovator',
            description: 'Post challenges and find talented problem solvers for your projects.',
            icon: <FaLightbulb/>,
        },
        {
            role: 'Problem Solver',
            description: 'Solve challenges, showcase your expertise, and earn rewards.',
            icon: <FaUsers/>,
        },
        {
            role: 'Advisor/Mentor',
            description: 'Share your expertise and guide others in their professional journey.',
            icon: <FaGraduationCap/>,
        },
        {
            role: 'Client/Mentee',
            description: 'Connect with advisors and get guidance for your career growth.',
            icon: <FaHandshake/>,
        },
    ];

    return (
        <div>
            {showBackButton && (
                <button
                    type={'button'}
                    onClick={onBack}
                    className={'flex items-center text-gray-600 hover:text-gray-800 mb-4'}
                >
                    <span className={'mr-2'}>←</span>
                    Back
                </button>
            )}

            <div className={'grid grid-cols-1 md:grid-cols-2 gap-6'}>
                {roles.map(({role, description, icon}) => (
                    <button
                        key={role}
                        type={'button'}
                        onClick={() => onRoleSelect(role)}
                        className={`w-full p-6 border-2 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-[#00674f] ${
                            selectedRole === role
                                ? 'border-[#00674f] bg-[#00674f]/5'
                                : "border-gray-200 hover:border-[#00674f]"
                        }`}
                    >
                        <div className={'flex flex-col justify-center'}>
                            <div className={'flex items-center text-center'}>
                                <div className={`text-4xl mr-3 ${
                                    selectedRole === role ? 'text-[#00674f]' : 'text-gray-800 group-hover:text-[#00674f]'
                                }`}>
                                    {icon}
                                </div>
                                <h3 className={`text-xl fontsemibold ${
                                    selectedRole === role ? 'text-[#00674f]' : 'text-gray-800 group-hover:text-[#00674f]'
                                }`}>
                                    {role}
                                </h3>
                            </div>
                            <p className={'text-left text-gray-600 mt-2'}>
                                {description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

RoleSelectionGrid.propTypes = {
    selectedRole: PropTypes.string.isRequired,
    onRoleSelect: PropTypes.func.isRequired,
    showBackButton: PropTypes.bool,
    onBack: PropTypes.func,
};

export default RoleSelectionGrid;