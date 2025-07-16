import React from "react";
import { EffectCoverflow, Navigation, Pagination, Autoplay } from "swiper/modules";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaCity } from "react-icons/fa";
import { GiSmartphone } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const FeaturedChallenges = ( { openRoleModal } ) =>
{
  const challenges = [
    {
      title: "Challenge 1: Smart City Innovation",
      desc: "Developing sustainable solutions for urban development #1",
      reward: "$5,000",
      icon: <FaCity className="text-4xl text-green-700" />,
    },
    {
      title: "Challenge 2: Renewable Energy Solutions",
      desc: "Innovative ideas to harness renewable energy sources #2",
      reward: "$6,000",
      icon: <BsFillLightningChargeFill className="text-4xl text-yellow-500" />,
    },
    {
      title: "Challenge 3: Mobile App Development",
      desc: "Create intuitive mobile apps for daily use #3",
      reward: "$7,000",
      icon: <GiSmartphone className="text-4xl text-blue-500" />,
    },
    {
      title: "Challenge 4: AI in Healthcare",
      desc: "Leverage AI to improve healthcare outcomes #4",
      reward: "$8,000",
      icon: <BsFillLightningChargeFill className="text-4xl text-red-500" />,
    },
    {
      title: "Challenge 5: Urban Farming",
      desc: "Sustainable farming practices for urban areas #5",
      reward: "$9,000",
      icon: <FaCity className="text-4xl text-purple-500" />,
    },
  ];

  return (
    <section className="py-8 px-6 lg:px-20 bg-white relative ">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Featured Challenges – Innovate & Solve
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Tackle real-world problems, showcase your expertise, and collaborate with top innovators. Join a challenge, make an impact, and earn rewards!
          </p>
        </motion.div>
        <div className="relative group flex justify-center items-center px-8">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: -10,
              depth: 150,
              modifier: 1.2,
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
              }
            }}
            modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
            className="!pb-5 w-full"
            breakpoints={{
              640: {
                spaceBetween: 20,

              },
              1024: {
                spaceBetween: 40,

              },
            }}
            loop={true}
          >
            {challenges.map( ( challenge, i ) => (
              <SwiperSlide
                key={i}
                className="!w-[320px] lg:!w-[400px]  !h-auto !transition-transform !duration-300"
              >
                <div className="relative h-full group">

                  <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 pb-3 px-6 transition-all duration-300 group-hover:border-green-700/50 ">
                    <div className="flex items-center gap-4 mb-3">
                     
                    </div>
                    <h3 className="text-xl font-semibold h-14 mb-4 text-gray-800">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{challenge.desc}</p>
                    <div className="flex items-center justify-between mb-1">
                    <span className=" text-green-800 px-2  rounded-full font-medium">
                        {challenge.reward}
                      </span>
                    <button className="px-3 py-2 border rounded-full border-[#31473A] text-white bg-[#31473A] hover:bg-[#31473A]  transition-colors text-sm themebg">
                    View Challenge
                  </button>
                  </div>
                  </div>
                </div>
              </SwiperSlide>
            ) )}
          </Swiper>


          <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 [&>.swiper-pagination-bullet]:w-3 [&>.swiper-pagination-bullet]:h-3 [&>.swiper-pagination-bullet]:rounded-full [&>.swiper-pagination-bullet]:bg-gray-800 [&>.swiper-pagination-bullet-active]:bg-green-700" />

        </div>
       
        <div className="swiper-button-prev absolute left-4 xl:left-[10%] top-[63%] -translate-y-1/2 z-10 cursor-pointer p-2 transition-all">
          <FiChevronLeft className="text-5xl text-green-700" />
        </div>
        <div className="swiper-button-next absolute right-4 xl:right-[10%] top-[63%] -translate-y-1/2 z-10 cursor-pointer p-2 transition-all">
          <FiChevronRight className="text-5xl text-green-700" />
        </div>
      </div>

    </section>
  );
};

export default FeaturedChallenges;