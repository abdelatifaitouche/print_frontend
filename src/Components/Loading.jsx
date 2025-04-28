import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const circleVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

function Loading() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen w-full bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex space-x-2 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full"
            variants={circleVariants}
            custom={i}
          />
        ))}
      </div>
      
      <motion.p 
        className="text-gray-600 font-medium"
        variants={textVariants}
      >
        Loading your content...
      </motion.p>
    </motion.div>
  );
}

export default Loading;