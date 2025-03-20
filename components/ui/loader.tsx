import React from 'react';
import { motion } from 'framer-motion';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-16 h-16 mb-4"
      >
        <div className="h-full w-full rounded-full border-4 border-gray-200 border-t-[#EECE84]"></div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-gray-600 font-medium"
      >
        Chargement des données...
      </motion.p>
    </div>
  );
};

export default LoadingState;