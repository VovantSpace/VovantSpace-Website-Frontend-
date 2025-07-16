import React, { useState } from 'react';
import
    {
        FaEnvelope,
        FaPhone,
        FaMapMarkerAlt,
        FaGlobe,
        FaPhoneAlt,
        FaCalendarAlt,
        FaLinkedin,
        FaTwitter,
        FaFacebook,
        FaInstagram,
        FaArrowRight,
        FaLightbulb
    } from 'react-icons/fa';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion';
import Bubbles from './components/Bubbles';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';

const Contact = () =>
{
    const [formValues, setFormValues] = useState( {
        name: '',
        email: '',
        message: ''
    } );
    const [formErrors, setFormErrors] = useState( {} );

    const handleChange = ( e ) =>
    {
        const { id, value } = e.target;
        setFormValues( { ...formValues, [id]: value } );
        setFormErrors( { ...formErrors, [id]: '' } );
    };

    const validate = () =>
    {
        const errors = {};
        if ( !formValues.name.trim() ) {
            errors.name = 'Name is required.';
        }
        if ( !formValues.email.trim() ) {
            errors.email = 'Email is required.';
        } else if ( !/\S+@\S+\.\S+/.test( formValues.email ) ) {
            errors.email = 'Email is invalid.';
        }
        if ( !formValues.message.trim() ) {
            errors.message = 'Message is required.';
        }
        return errors;
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();
        const errors = validate();
        if ( Object.keys( errors ).length > 0 ) {
            setFormErrors( errors );
        } else {
            // Form submission logic here
            alert( 'Form submitted!' );
            setFormValues( { name: '', email: '', message: '' } );
            setFormErrors( {} );
        }
    };

    return (
        <>
            {/* Header Section */}
            <section>
                <div className="bg-[#31473A] relative">
                    <Navbar />
                    <Bubbles/>
                    <div className="text-white text-center py-16">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <FaLightbulb className="text-white text-5xl mx-auto mb-4 transition-transform duration-300 hover:scale-110" />
                        </motion.div>
                        <h1 className="text-4xl font-bold ">Let's Connect and Innovate Together</h1>
                        <p className="mt-4 text-lg text-wrap px-2">
                            Have a question, need support, or want to collaborate? We'd love to hear from you!
                        </p>
                    </div>
                </div>

                {/* Contact & Message Section */}
                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                    {/* Left Side – Contact Information */}
                    <div className="md:w-1/2 space-y-8">
                        <div className="p-6 rounded-lg shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold mb-4">
                                <FaEnvelope className="themetext inline-block mr-2" /> Get in Touch
                            </h2>
                            <ul className="list-disc space-y-2">
                                <li className="flex flex-wrap">
                                    <strong>General Inquiries:</strong>
                                    <a
                                        href="mailto:info@vovantspace.com"
                                        className="themetext ml-1 whitespace-normal transition-all "
                                    >
                                        info@vovantspace.com
                                    </a>
                                </li>
                                <li className="flex flex-wrap">
                                    <strong>Support &amp; Assistance:</strong>
                                    <a
                                        href="mailto:support@vovantspace.com"
                                        className="themetext ml-1 whitespace-normal transition-all "
                                    >
                                         support@vovantspace.com
                                    </a>
                                </li>
                                <li className="flex flex-wrap">
                                    <strong>Partnerships &amp; Collaborations:</strong>
                                    <a
                                        href="mailto:partnerships@vovantspace.com"
                                        className="themetext ml-1 whitespace-normal transition-all "
                                    >
                                        partnerships@vovantspace.com
                                    </a>
                                </li>
                            </ul>

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                            {/* Our Location */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 themetext" />
                                    Our Location
                                </h2>
                                <p className="flex items-center mb-2">
                                    <FaMapMarkerAlt className="themetext mr-2" />
                                    [Company Address]
                                </p>
                                <p className="flex items-center">
                                    <FaGlobe className="themetext mr-2" />
                                    Operating Globally – Join Us from Anywhere!
                                </p>
                            </div>
                            {/* Talk to Us */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2 flex items-center">
                                    <FaPhoneAlt className="mr-2 themetext" />
                                    Talk to Us
                                </h2>
                                <p className="flex items-center mb-2">
                                    <FaPhoneAlt className="themetext mr-2" />
                                    Phone: [+123 456 7890]
                                </p>
                                <button className="themebg text-white px-4 hover:scale-105 transition-all py-2 rounded-full flex items-center">
                                    <FaCalendarAlt className="mr-2" />
                                    Schedule a Call
                                </button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Follow Us &amp; Stay Connected</h2>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <button className="bg-white text-gray-700 font-medium py-2 px-4 border hover:bg-gray-100 hover:scale-105 transition-all rounded shadow flex items-center space-x-2">
                                    <FaLinkedin />
                                    <span>LinkedIn</span>
                                </button>
                                <button className="bg-white text-gray-700 font-medium py-2 px-4 border hover:bg-gray-100 hover:scale-105 transition-all rounded shadow flex items-center space-x-2">
                                    <FaTwitter />
                                    <span>Twitter</span>
                                </button>
                                <button className="bg-white text-gray-700 font-medium py-2 px-4 border hover:bg-gray-100 hover:scale-105 transition-all rounded shadow flex items-center space-x-2">
                                    <FaFacebook />
                                    <span>Facebook</span>
                                </button>
                                <button className="bg-white text-gray-700 font-medium py-2 px-4 border hover:bg-gray-100 hover:scale-105 transition-all rounded shadow flex items-center space-x-2">
                                    <FaInstagram />
                                    <span>Instagram</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side – Message Form */}
                    <div className="md:w-1/2">
                        <div className="p-6 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formValues.name}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Your name"
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formValues.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Your email"
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="message" className="block text-gray-700">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        value={formValues.message}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] ${formErrors.message ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        rows="4"
                                        placeholder="Your message"
                                    ></textarea>
                                    {formErrors.message && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                                    )}
                                </div>
                                <button type="submit" className="themebg flex justify-center items-center transition-all text-lg text-white px-4 py-3 rounded-full w-full">
                                    Send Message   <FaArrowRight className="ml-2 text-sm" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="bg-gray-50">
                <div className="themebg text-white text-center py-12 shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">
                        Join the VovantSpace Community and Start Innovating Today!
                    </h2>
                    <Link to='/signup'>
                    <button className="bg-white themetext font-medium py-2 px-6 rounded-full shadow inline-flex items-center">
                        Sign Up Now
                        <FaArrowRight className="ml-2" />
                    </button>
                    </Link>
                </div>
            </section>
            <Footer/>
        </>
    );
};

export default Contact;
