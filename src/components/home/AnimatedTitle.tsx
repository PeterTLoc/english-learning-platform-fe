'use client';
import { motion, Variants } from 'framer-motion';

const title = 'English Learning System';
const subtext = 'The perfect place to master English.';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const subtextVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: title.length * 0.05 + 0.2,
      duration: 0.5,
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: title.length * 0.05 + 0.4,
      duration: 0.5,
    },
  },
}

const AnimatedTitle: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <motion.div
        className="text-7xl font-bold flex flex-wrap"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {title.split('').map((char, i) => (
          <motion.span key={i} variants={charVariants}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        className="text-[#CFCFCF] text-sm text-center mt-3"
        variants={subtextVariants}
        initial="hidden"
        animate="visible"
      >
        {subtext}
      </motion.div>

      <motion.div
        className="text-[#CFCFCF] text-sm text-center"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
      >
        <button className='mt-6 bg-[#4CC2FF] border-[#42A7DC] hover:bg-[#48B2E9] px-6 py-3 rounded-md text-black font-bold text-base transitiion-all duration-300'>Start learning now</button>
      </motion.div>
    </div>
  );
};

export default AnimatedTitle;
