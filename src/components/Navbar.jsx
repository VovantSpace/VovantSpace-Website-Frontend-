import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () =>
{
  const [menuOpen, setMenuOpen] = useState( false );
  const toggleMenu = () => setMenuOpen( ( prev ) => !prev );

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];


  return (
    <div className="relative">

      {/* Header */}
      <header className="z-10 relative">
        <div className="xl:container mx-auto flex justify-between items-center px-4 py-6">
          <Link to={'/'}>
            <motion.img
              src={logo}
              alt="VovantSpace logo"
              className="w-28 md:w-40 lg:w-48 transition-transform duration-300 hover:scale-105"
              whileHover={{ rotate: 5 }}
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-6 font-medium">
            <motion.div
              className="flex text-white rounded-full px-2 py-2 space-x-4 md:space-x-7 flex-wrap shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {navLinks.map( ( link ) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-3 py-1 uppercase"
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {link.name}
                </Link>
              ) )}
            </motion.div>
          </nav>

          <div className="flex z-10 text-white items-center lg:gap-2 capitalize mr-[2%]">
            <Link
              to="/login"
              className="transition-colors z-10 hover:text-green-200 duration-200 px-3 md:px-6 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3  md:px-6 py-2  z-10 hover:text-green-200 rounded-full transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Signup
            </Link>
            <button
              onClick={toggleMenu}
              className="lg:hidden text-2xl p-2 z-10 hover:text-gray-300 transition-colors"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 left-4 right-4 bg-white/95 text-[#31473A] rounded-xl p-4 flex flex-col items-center space-y-3 lg:hidden z-50 shadow-xl"
        >
          {navLinks.map( ( link ) => (
            <Link
              key={link.name}
              to={link.href}
              className="w-full text-center py-2 uppercase"
              whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {link.name}
            </Link>
          ) )}
          <div className="w-full border-t my-2" />
          <Link
            to="/login"
            className="w-full text-center py-2"
            whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full text-center py-2 bg-[#00674F] text-white rounded-lg"
            whileHover={{ scale: 1.05, backgroundColor: '#2c3f33' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Signup
          </Link>
        </motion.nav>
      )}
    </div>
  );
};

export default Navbar;
