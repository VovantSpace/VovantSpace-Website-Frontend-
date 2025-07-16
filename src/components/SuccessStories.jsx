import React, { useState } from 'react';
import Success1 from '../assets/successstories/1.jpeg';
import Success2 from '../assets/successstories/2.jpeg';
import Success3 from '../assets/successstories/3.jpeg';
import Success4 from '../assets/successstories/4.jpeg';
import { Link } from 'react-router-dom';

const TestimonialCard = ( { testimonial } ) =>
{
    const [expanded, setExpanded] = useState( false );
    const toggleExpanded = () => setExpanded( !expanded );

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 transition transform hover:shadow-xl">
            <div className='flex justify-start gap-4'>
                <img
                    src={testimonial.img}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-full object-cover"
                />

                <div className="mb-4">
                    <div className='bg-[#73E6CB] text-black rounded-full px-3 py-2'><p className="text-sm font-medium text-center">{testimonial.role}</p></div>
                    <p className="text-md font-bold themetext">{testimonial.name}</p>
                    <p className="text-sm font-medium text-gray-600">{testimonial.role}</p>
                </div>
            </div>
            {/* Project Title */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">{testimonial.title}</h3>
            </div>
            {/* Short Description */}
            <p className="text-gray-700">
                {testimonial.short}
            </p>
            {/* Company */}
            <p className="mt-2 text-sm text-gray-500 italic">{testimonial.company}</p>
            {expanded && (
                <p className="mt-4 text-gray-700">
                    {testimonial.extra}
                </p>
            )}
            <button
                onClick={toggleExpanded}
                className="mt-4 themetext font-semibold"
            >
                {expanded ? 'Show Less' : 'Read More'}
            </button>
        </div>
    );
};

const SuccessStories = () =>
{
    const testimonials = [
        {
            name: "Michael Tan",
            role: "Innovator",
            title: "AI-Powered Smart Farming Solution",
            short:
                "With the help of brilliant problem solvers on VovantSpace, we developed an AI system that improved crop yields by 30%! The platform connected us with the right talent, and now we're scaling worldwide.",
            extra: "Our journey began when we identified a critical challenge in agriculture...",
            company: "AgriTech Solutions",
            img: Success1
        },
        {
            name: "Sarah Kim",
            role: "Problem Solver",
            title: "Building a Machine Learning Model for Smart Cities",
            short:
                "This challenge was an incredible learning experience. I built a cutting-edge ML model, won a $2,000 reward, and even got a job offer from the Innovator's company!",
            extra:
                "Diving into complex data, I built a robust model that revolutionized urban planning.",
            company: "CityTech Innovations",
            img: Success2
        },
        {
            name: "Alex Rodriguez",
            role: "Client/Mentee",
            title: "Career Growth & Interview Prep",
            short:
                "My mentor helped me revamp my resume and ace my job interview. I landed a dream job at a top tech company!",
            extra:
                "Through strategic advice and personalized coaching, I secured my dream job.",
            company: "CareerBoost Inc.",
            img: Success3
        },
        {
            name: "Dr. Jane Smith",
            role: "Advisor/Mentor",
            title: "Startup Fundraising Strategies",
            short:
                "I guided a startup founder on investment pitching, and within three months, they secured $500,000 in funding. Seeing my mentees succeed is the best reward!",
            extra:
                "My mentorship ensured they achieved a milestone in securing investment.",
            company: "Innovate Ventures",
            img: Success4
        }
    ];

    return (
        <section className="py-8 px-6 lg:px-20 bg-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-10 text-center">Success Stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {testimonials.map( ( testimonial, i ) => (
                        <TestimonialCard key={i} testimonial={testimonial} />
                    ) )}
                </div>
                <div className="text-center mt-12">
                    <h3 className="text-2xl font-bold mb-4">Be the next success story</h3>
                    <Link to="/signup">
                    <button className="px-8 py-4 themebg text-white rounded-full font-bold  transition-colors">
                        Join Today
                    </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;
