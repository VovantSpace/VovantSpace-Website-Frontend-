// components/landing/RoleSelectionModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiTool, FiBook, FiBriefcase } from 'react-icons/fi';

export const RoleSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const roles = [
    { id: 1, title: 'Innovator', icon: <FiUser className="text-3xl" /> },
    { id: 2, title: 'Problem Solver', icon: <FiTool className="text-3xl" /> },
    { id: 3, title: 'Advisor/Mentor', icon: <FiBook className="text-3xl" /> },
    { id: 4, title: 'Client/Mentee', icon: <FiBriefcase className="text-3xl" /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-[#2A3C39] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#27332F]"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-white">Select Your Role</h3>
            <div className='relative right-0 text-2xl' onClick={isOpen(false)}>X</div>
            <div className="grid grid-cols-2 gap-4">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 bg-[#31473A]/50 rounded-xl flex flex-col items-center gap-3 hover:bg-[#31473A]/70 transition-all"
                  onClick={() => onSelect(role.title)}
                >
                  <span className="text-yellow-400">{role.icon}</span>
                  <span className="text-white font-medium">{role.title}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};