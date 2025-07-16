import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaLightbulb, FaUser, FaGraduationCap, FaHandshake, FaMagic, FaStar } from 'react-icons/fa';
import { BsRocketTakeoff, BsPeople, BsLightning, BsGlobe } from 'react-icons/bs';
import Navbar from './components/Navbar'
import Bubbles from './components/Bubbles';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';

const About = () =>
{
    const values = [
        {
            icon: <BsRocketTakeoff />,
            title: 'Innovation',
            description: 'Transforming ideas into reality',
        },
        {
            icon: <BsPeople />,
            title: 'Collaboration',
            description: 'Uniting diverse talents for meaningful impact',
        },
        {
            icon: <FaStar />,
            title: 'Impact-Driven',
            description: 'Focusing on real-world challenges and solutions',
        },
        {
            icon: <BsGlobe />,
            title: 'Inclusivity',
            description: 'A space where everyone can contribute and grow',
        },
    ];

    return (
        <main className="">

            <section className="bg-[#31473A] relative">
                <Bubbles />
                <Navbar />

                <div className='flex items-center justify-center px-4 py-16'>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center text-white max-w-4xl">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <FaLightbulb className="text-white text-5xl mx-auto mb-4 transition-transform duration-300 hover:scale-110" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            Empowering Innovation Through Collaboration
                        </h1>
                        <p className="text-lg md:text-xl mb-6 text-white/90 leading-relaxed">
                            VovantSpace is a thriving ecosystem where Innovators, Problem Solvers, Advisors/Mentors, and Clients/Mentees come together to create, learn, and grow.
                        </p>
                        <Link to={'/signup'}>
                        <motion.button whileHover={{ scale: 1.05 }} className="bg-white z-10 text-[#00674F] font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto">
                            Join Us <FaHandshake className="text-xl" />
                        </motion.button>
                        </Link>
                    </motion.div>
                </div>

            </section>
            <section className="bg-gray-50 flex flex-col items-center justify-center p-6 py-8">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <div className="bg-[#00674F]/10 p-4 rounded-xl mr-4">
                                <FaRocket className="text-3xl text-[#00674F]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#00674F]">Our Mission</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            To empower a global network of thinkers, creators, and leaders by providing a collaborative platform for solving real-world challenges and accelerating innovation.
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <div className="bg-[#00674F]/10 p-4 rounded-xl mr-4">
                                <FaLightbulb className="text-3xl text-[#00674F]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#00674F]">Our Vision</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            A future where every idea finds the right minds to bring it to life and create lasting change.
                        </p>
                    </motion.div>
                </div>
            </section>
            <section className="bg-gray-50 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
                        <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                            At VovantSpace, we connect individuals with diverse expertise and needs to collaborate and innovate.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Innovators', 'Advisors', 'Clients'].map( ( role, i ) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="bg-[#00674F]/10 w-max p-4 rounded-xl mb-4">
                                    {i === 0 ? (
                                        <BsLightning className="text-3xl text-[#00674F]" />
                                    ) : i === 1 ? (
                                        <FaGraduationCap className="text-3xl text-[#00674F]" />
                                    ) : (
                                        <FaUser className="text-3xl text-[#00674F]" />
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                                    For {role}
                                </h2>
                                <ul className="space-y-2 text-gray-600">
                                    {i === 0 ? (
                                        <>
                                            <li>Submit challenges needing solutions</li>
                                            <li>Join aligned projects</li>
                                        </>
                                    ) : i === 1 ? (
                                        <>
                                            <li>Share knowledge and guide</li>
                                            <li>Provide strategic mentorship</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>Access expert insights</li>
                                            <li>Develop tailored solutions</li>
                                        </>
                                    )}
                                </ul>
                            </motion.div>
                        ) )}
                    </div>
                </div>
            </section>
            <section className="text-center py-12 bg-gray-50">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Core Values</h2>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map( ( value, index ) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-[#E5F0ED] p-4 rounded-full themecolor text-2xl">
                                        {value.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ) )}
                    </div>
                </div>
            </section>
            <section className="themebg text-white py-12 px-6  flex justify-center items-center flex-col">
                <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
                <p className="mb-6">No matter your role, there's a place for you at VovantSpace!</p>
                <Link to={'/signup'} className="bg-white flex items-center gap-2 text-green-800 font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300">
                    Join Now <FaMagic />
                </Link>
            </section>
            <Footer/>
        </main>
    );
};

export default About;
