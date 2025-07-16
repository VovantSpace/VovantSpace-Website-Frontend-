import React from 'react';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion';
import Footer from './components/Footer';
import
  {
    FaRocket,
    FaLightbulb,
    FaPuzzlePiece,
    FaCheckCircle,
    FaUsers,
    FaCheck,
    FaArrowRight,
    FaGraduationCap,
    FaTrophy
  } from 'react-icons/fa';
import Bubbles from './components/Bubbles';
import { Link } from 'react-router-dom';

const Services = () =>
{

  const listItems = [
    {
      id: 1,
      text: 'Mentees gain hands-on learning and career growth',
    },
    {
      id: 2,
      text: 'Mentors earn recognition and contribute to the next generation of innovators',
    },
    {
      id: 3,
      text: 'Build valuable professional relationships',
    },
  ];
  return (
    <>
      <section className="bg-[#31473A] text-white text-center relative ">
        <Bubbles />
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 py-14">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaLightbulb className="text-white text-5xl mx-auto mb-4 transition-transform duration-300 hover:scale-110" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-lg">
            Empowering Innovation, One Collaboration at a Time
          </p>
          <p className="text-lg mt-6">
            VovantSpace provides a dynamic ecosystem where innovators, problem solvers, advisors/mentors, and clients/mentees come together to tackle challenges, create solutions, and drive impact.
          </p>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FaRocket className="themetext text-2xl transition-transform duration-300 hover:scale-110" />
              <h2 className="text-3xl font-extrabold text-gray-900 ml-2">Our Key Services</h2>
            </div>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Submit Challenges Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaLightbulb className="themetext text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">Submit Challenges</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Have a problem that needs solving? Post your challenge on VovantSpace and let brilliant minds collaborate to find the best solutions.
                </p>
                <ul className="list-none space-y-2">
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="themetext mr-2 text-xl" />
                    Define requirements, set goals, and assemble a team
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="themetext mr-2 text-xl" />
                    Gain insights from experts and problem-solvers
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="themetext mr-2 text-xl" />
                    Turn challenges into opportunities for innovation
                  </li>
                </ul>
              </motion.div>
              {/* Join Projects Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaPuzzlePiece className="themetext text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">Join Projects</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Looking for exciting challenges? Join real-world projects that align with your expertise and interests.
                </p>
                <ul className="list-none space-y-2">
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="themetext mr-2 text-xl" />
                    Work on industry-relevant problems
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="themetext mr-2 text-xl" />
                    Collaborate with innovators and mentors
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="themetext mr-2 text-xl" />
                    Gain hands-on experience and build your portfolio
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* Mentorship & Advisory and Earn & Learn Section */}
      <section className="bg-gray-100 flex justify-center items-center py-12">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mentorship & Advisory Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaGraduationCap className="themetext text-2xl" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Mentorship &amp; Advisory</h2>
              <p className="text-gray-700 mb-4">
                Whether you're seeking guidance or ready to share expertise, mentorship is at the heart of VovantSpace.
              </p>
              <ul className="space-y-2">
                {listItems.map( ( item ) => (
                  <li key={item.id} className="flex items-center text-gray-700">
                    <div>
                    <FaCheckCircle className="themetext mr-2 text-xl" />
                    </div>
                    <p>
                    {item.text}
                    </p>
                  </li>
                ) )}
              </ul>

            </motion.div>
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaTrophy className="themetext text-2xl" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Earn &amp; Learn</h2>
              <p className="text-gray-700 mb-4">
                Gain skills, grow your experience, and get rewarded.
              </p>
              <ul className="">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="themetext mr-2 text-xl" />
                  Work on projects that enhance your expertise
                </li>
                <li className="flex items-center text-gray-700 mt-2">
                  <FaCheckCircle className="themetext mr-2 text-xl" />
                  Earn incentives based on contributions
                </li>
                <li className="flex items-center text-gray-700 mt-2">
                  <FaCheckCircle className="themetext mr-2 text-xl" />
                  Learn from industry leaders and gain exposure
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose VovantSpace Section */}
      <section className="bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center justify-center">
            <FaUsers className="themetext mr-2 text-3xl" />
            Why Choose VovantSpace?
          </h2>
          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6 lg:px-10 px-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md flex items-center transform hover:scale-105 transition duration-300"
            >
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaCheck className="themetext" />
              </div>
              <div className="text-left">
                <p className="text-gray-900 font-medium">A diverse community of innovators, thinkers, and doers</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md flex items-center transform hover:scale-105 transition duration-300"
            >
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaCheck className="themetext" />
              </div>
              <div className="text-left">
                <p className="text-gray-900 font-medium">Opportunities to network, grow, and make a difference</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md flex items-center transform hover:scale-105 transition duration-300"
            >
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaCheck className="themetext" />
              </div>
              <div className="text-left">
                <p className="text-gray-900 font-medium">A collaborative space where ideas become real-world solutions</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="themebg flex items-center justify-center py-12">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Get Started Today!</h1>
          <p className="text-lg mb-8">
            Ready to innovate, solve challenges, or find expert guidance? Join VovantSpace and be part of the future of collaboration.
          </p>
          <div className="flex items-center justify-center">
            <Link to='/signup'>
            <button className="bg-white text-teal-800 font-semibold py-2 px-6 rounded-full border-2 border-teal-800 hover:bg-teal-100 hover:shadow-lg transition duration-300 flex justify-center items-center">
              Sign Up Now <FaArrowRight className="ml-2" />
            </button>
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default Services;
