import {motion} from 'framer-motion';
import {FiChevronRight} from 'react-icons/fi';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import bulb from './assets/bulb2.png';
import './App.css';
import './index.css';
import Featured from './components/Featured';

const LandingPage = () => {


    return (
        <div className=" bg-[#31473A] text-white relative overflow-hidden">
            <ToastContainer/>
            <Navbar/>
            {/* Main Section */}
            <main
                className="xl:container md:h-[31rem] lg:h-[27rem] mx-auto grid md:grid-cols-2 justify-center md:justify-start text-center md:text-left px-4 lg:px-28 relative z-10 mt-2">
                <div className="max-w-2xl space-y-5 mt-14">
                    <motion.h1
                        className="text-6xl md:text-8xl dynamo font-bold mb-4 leading-h1"
                        initial={{opacity: 0, y: -50}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        style={{lineHeight: "64px"}}
                    >
                        Collaborate<br/>
                        <span className="relative inline-block">
              <span className="absolute inset-0 opacity-30"/>
              <span className="relative text-transparent -z-10 outline-text bg-clip-text bg-gradient-to-r">
                Create
              </span>
            </span><br/>
                        Change
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-lg md:pt-2 text-gray-200"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.5, duration: 1}}
                    >
                        Join a thriving community of innovators, problem solvers, and experts. Make an impact today!
                    </motion.p>

                    <motion.div
                        className="flex items-center gap-4 w-full flex-wrap justify-center md:justify-start"
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.7, duration: 0.5}}
                    >
                        {['Explore Projects', 'Explore Mentors'].map((text) => (
                            <motion.a
                                key={text}
                                href="#"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="flex items-center overflow-hidden px-4 py-3 z-20 bg-white text-[#31473A] rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {text}
                                <FiChevronRight
                                    className="ml-2 bg-[#31473A] text-white rounded-full p-1 text-2xl font-bold"/>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>

                <div className="relative flex justify-center items-center lg:mt-0 mt-10">

                    {/* <motion.div
            className="absolute inset-0 md:flex hidden"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div 
              className="absolute  left-3/4 top-[40%] bg-yellow-400/30 blur-[20px] w-48 h-48" 
              style={{ mixBlendMode: 'screen' }}
            />
            <div 
              className="absolute left-3/4 top-[40%] bg-yellow-300/10  blur-[30px] w-48 h-48" 
              style={{ mixBlendMode: 'screen' }}
            />
          </motion.div> */}

                    <motion.img
                        src={bulb}
                        alt="Hanging Bulb with Wire"
                        className="relative w-24 sm:w-32 md:w-52 left-10 sm:left-16 lg:left-[41%] xl:left-[42%] z-2 bottom-20 md:bottom-52 hidden md:block pointer-events-none"
                        initial={{y: -200, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{
                            delay: 0.5,
                            duration: 1,
                            type: 'spring',
                            stiffness: 50
                        }}
                    />
                </div>
            </main>
            <Featured/>
            <Footer/>
        </div>
    );
};

export default LandingPage;
