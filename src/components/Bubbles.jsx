import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const generateBubble = () => ({
  id: Math.random().toString(36).substr(2, 9), // Unique identifier
  size: Math.random() * 30 + 10, // Random size between 10 and 40
  x: Math.random() * 100, // Random horizontal position
  duration: Math.random() * 5 + 5, // Random duration between 5 and 10 seconds
  opacity: Math.random() * 0.5 + 0.1, // Random opacity between 0.1 and 0.6
});

const Bubbles = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble = generateBubble();
      setBubbles((bubs) => [...bubs, newBubble]);

      // Remove the bubble after its animation duration
      setTimeout(() => {
        setBubbles((bubs) => bubs.filter((b) => b.id !== newBubble.id));
      }, newBubble.duration * 1000);
    }, 300); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((bubble) => (
       <motion.div
       key={bubble.id}
       className="absolute bg-white rounded-full"
       style={{
         width: bubble.size,
         height: bubble.size,
         left: `${bubble.x}%`,
         bottom: '0%', // Start at the bottom of the container
         opacity: bubble.opacity,
       }}
       animate={{ y: '-100%' }} // Move upward beyond the top
       transition={{
         duration: bubble.duration,
         ease: 'easeInOut',
       }}
     
        />
      ))}
    </div>
  );
};

export default Bubbles;
