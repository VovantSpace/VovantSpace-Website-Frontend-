import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import SuccessStories from './SuccessStories';
import FeaturedChallenges from './landing/FeaturedChallenges';
import TrustedAdvisors from './landing/TrustedAdvisors';
import {Link} from 'react-router-dom';
import
{
  FaStar,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFire,
  FaLightbulb,
  FaUsers
} from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';


<SuccessStories />

const CommunitySection = (  ) =>
{
  const stats = [
    { value: '10K+', label: 'Members', icon: FaUsers },
    { value: '5K+', label: 'Challenges Solved', icon: FaFire },
    { value: '98%', label: 'Advisor Satisfaction', icon: FaStar },
  ];

  return (
    <section className="py-8 px-6 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Join Our Community
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Be part of a global movement where innovators, problem solvers, advisors, and mentees collaborate to create real impact. Join VovantSpace and shape the future today!
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map( ( stat, i ) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <stat.icon className="text-5xl mx-auto mb-4 themetext" />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ) )}
        </div>
        <Link  to="/signup">
        <button
          className="px-8 py-4 themebg text-white rounded-xl text-xl font-bold hover:bg-green-800 transition-colors flex items-center gap-3 mx-auto"
         
        >
          <FaLightbulb className="text-2xl" />
          Start Your Journey – Join Now
          <FiChevronRight className="text-2xl" />
          </button>
        </Link>
      </div>
    </section>
  );
};



// ------ Sticky "Join Now" Button ------
const JoinNowStickyButton = ( { onClick, isVisible } ) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link to="/signup">
        <button
          className="px-6 py-3 themebg border border-green-700 text-white rounded-full shadow-lg hover:bg-green-800 transition-colors font-semibold"
          onClick={onClick}
        >
          Join Now
        </button>
        </Link>
      </motion.div>
    )}
  </AnimatePresence>
);

// ------ Main  Component ------
const Featured = () =>
{
  const [isSticky, setIsSticky] = useState( false );
  const { scrollYProgress } = useScroll();

  useEffect( () =>
  {
    const handleScroll = () => setIsSticky( window.scrollY > 100 );
    window.addEventListener( 'scroll', handleScroll );
    return () => window.removeEventListener( 'scroll', handleScroll );
  }, [] );


  return (
    <div className="bg-white text-gray-900 relative overflow-hidden">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-700 to-green-500 z-50"
        style={{ scaleX: scrollYProgress }}
      />
      <FeaturedChallenges  />
      <TrustedAdvisors  />
      <SuccessStories />
      <CommunitySection  />

      <JoinNowStickyButton  isVisible={isSticky} />
      
    </div>
  );
};

export default Featured;
