'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NeonButton from '@/components/NeonButton';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className="scanline-overlay" />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00FFFF] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#FF00FF] rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 pixel-text"
            style={{
              color: '#00FFFF',
              textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF, 0 0 40px #00FFFF'
            }}
            animate={{
              textShadow: [
                '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
                '0 0 15px #00FFFF, 0 0 25px #00FFFF, 0 0 35px #00FFFF, 0 0 45px #00FFFF',
                '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          > 
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[#FFFF00] text-sm md:text-base mb-8 pixel-text"
            style={{
              textShadow: '0 0 10px #FFFF00'
            }}
          >
            AI-POWERED TRIVIA ARCADE
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <NeonButton
              text="START GAME"
              color="cyan"
              onClick={() => router.push('/setup')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
            className="mt-8 text-[#00FF00] text-xs pixel-text"
          >
            PRESS START
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 text-[#FF00FF] text-xs pixel-text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
        </motion.div>
      </div>
    </>
  );
}
