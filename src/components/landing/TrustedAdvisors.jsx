import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { FaStar } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import advisor1 from '../../assets/1.jpeg';
import advisor2 from '../../assets/2.jpeg';
import advisor3 from '../../assets/3.jpeg';

const TrustedAdvisors = ( { openRoleModal } ) =>
{
  const advisors = [
    {
      name: "Dr. Jane Smith",
      role: "Leadership Coach & Business Strategist",
      sessions: "120+ Sessions",
      rating: 4.9,
      expertise: ["Business Growth", "Leadership", "Startups"],
      img: advisor1,
    },
    {
      name: "Dr. Michael Chen",
      role: "AI & Machine Learning Expert",
      sessions: "85+ Sessions",
      rating: 5,
      expertise: ["Business Growth", "Leadership", "Startups"],
      img: advisor2,
    },
    {
      name: "Emma Rodriguez",
      role: "Product Development Strategist",
      sessions: "120+ Sessions",
      rating: 4.9,
      expertise: ["Business Growth", "Leadership", "Startups"],
      img: advisor3,
    },
    {
      name: "Emma Rodriguez",
      role: "Product Development Strategist",
      sessions: "120+ Sessions",
      rating: 4.9,
      expertise: ["Business Growth", "Leadership", "Startups"],
      img: advisor3,
    },
    {
      name: "Emma Rodriguez",
      role: "Product Development Strategist",
      sessions: "120+ Sessions",
      rating: 4.9,
      expertise: ["Business Growth", "Leadership", "Startups"],
      img: advisor3,
    },
  ];

  return (
    <section className="py-8 px-6 lg:px-20 bg-gray-50 relative">
      <div className="container max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">
          Meet Our Trusted Advisors
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Connect with trusted experts in business, wellness, and personal growth. Whether you need career guidance, therapy, or strategic advice, our advisors are here to support your journey. Book a session and take your journey to the next level!
        </p>
        <Swiper

          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3} 
          coverflowEffect={{
            rotate: 0,
            stretch: -50, 
            depth: 150, 
            modifier: 1.5,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            renderBullet: ( index, className ) =>
            {
              return `<span class="${className} w-3 h-3 bg-gray-800 rounded-full mx-1 transition-all"></span>`;
            },
          }}
          modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
          className="!pb-5 w-full"
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
              coverflowEffect: {
                stretch: -10,
                depth: 50,
              },
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
              coverflowEffect: {
                stretch: -30,
                depth: 100,
              },
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20, 
              coverflowEffect: {
                stretch: -62, 
                depth: 150,
              },
            },
          }}
          loop={true}
        >
          {advisors.map( ( advisor, i ) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }}
                viewport={{ once: true }}
                className="bg-white md:w-full rounded-xl md:ml-0 mx-auto shadow-md border border-gray-200 p-6 hover:scale-105  lg:!w-[400px] !h-auto !transition-transform !duration-300"
              >
                <img
                  src={advisor.img}
                  alt={advisor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-2xl font-bold text-center mb-1">{advisor.name}</h3>
                <p className="text-gray-600 text-center mb-2">{advisor.role}</p>
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array( 5 )].map( ( _, idx ) => (
                    <FaStar key={idx} className="text-yellow-400" />
                  ) )}
                </div>
                <p className="text-center text-sm text-gray-500 mb-3">{advisor.sessions}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {advisor.expertise.map( ( exp, j ) => (
                    <span key={j} className="themebg text-white px-3 py-1 rounded-full text-sm">
                      {exp}
                    </span>
                  ) )}
                </div>
                <div className="flex gap-3 justify-center">
                  <button className="px-3 py-2 border rounded-full hover:bg-[#31473A] hover:text-white  themecolor themeborder transition-colors text-sm">
                    View Profile
                  </button>
                  <button
                    className="px-4 py-2 border rounded-full themebg text-white transition-colors"
                    onClick={openRoleModal}
                  >
                    Book Session
                  </button>
                </div>
              </motion.div>
            </SwiperSlide>
          ) )}
        </Swiper>
        {/* Custom Navigation Arrows */}
        <div className="swiper-button-prev absolute left-4 xl:left-[10%] top-[63%] -translate-y-1/2 z-10 cursor-pointer p-2 transition-all">
          <FiChevronLeft className="text-5xl themecolor" />
        </div>
        <div className="swiper-button-next absolute right-4 xl:right-[10%] top-[63%] -translate-y-1/2 z-10 cursor-pointer p-2 transition-all">
          <FiChevronRight className="text-5xl themecolor" />
        </div>
        {/* Custom Pagination */}
        <div className="swiper-pagination absolute bottom-4 w-full text-center [&>.swiper-pagination-bullet]:bg-gray-800 [&>.swiper-pagination-bullet-active]:bg-green-700 [&>.swiper-pagination-bullet]:w-3 [&>.swiper-pagination-bullet]:h-3 [&>.swiper-pagination-bullet]:rounded-full" />
      </div>
    </section>
  );
};

export default TrustedAdvisors;