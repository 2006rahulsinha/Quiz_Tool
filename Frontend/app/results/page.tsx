'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NeonButton from '@/components/NeonButton';
import NeonCard from '@/components/NeonCard';
import { useQuizStore } from '@/store/quizStore';

export default function ResultsPage() {
  const router = useRouter();
  const { score, numQuestions, topic, resetQuiz } = useQuizStore();
  const [showConfetti, setShowConfetti] = useState(false);

  const percentage = Math.round((score / numQuestions) * 100);
  const isPerfect = score === numQuestions;
  const isGood = percentage >= 70;
  const isOkay = percentage >= 50;

  useEffect(() => {
    if (numQuestions === 0) {
      router.push('/setup');
      return;
    }
    setShowConfetti(true);
  }, [numQuestions, router]);

  const handlePlayAgain = () => {
    resetQuiz();
    router.push('/setup');
  };

  if (numQuestions === 0) {
    return null;
  }

  const getMessage = () => {
    if (isPerfect) return 'PERFECT SCORE!';
    if (isGood) return 'EXCELLENT!';
    if (isOkay) return 'GOOD JOB!';
    return 'KEEP TRYING!';
  };

  const getColor = () => {
    if (isPerfect) return 'yellow';
    if (isGood) return 'green';
    if (isOkay) return 'cyan';
    return 'magenta';
  };

  return (
    <>
      <div className="scanline-overlay" />
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'][Math.floor(Math.random() * 4)]
              }}
              animate={{
                y: ['0vh', '110vh'],
                x: [0, Math.random() * 200 - 100],
                rotate: [0, Math.random() * 360],
                opacity: [1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: 'easeIn'
              }}
            />
          ))}
        </div>
      )}

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-center pixel-text"
            style={{
              color: getColor() === 'yellow' ? '#FFFF00' : getColor() === 'green' ? '#00FF00' : getColor() === 'cyan' ? '#00FFFF' : '#FF00FF',
              textShadow: `0 0 10px ${getColor() === 'yellow' ? '#FFFF00' : getColor() === 'green' ? '#00FF00' : getColor() === 'cyan' ? '#00FFFF' : '#FF00FF'}, 0 0 20px ${getColor() === 'yellow' ? '#FFFF00' : getColor() === 'green' ? '#00FF00' : getColor() === 'cyan' ? '#00FFFF' : '#FF00FF'}`
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            {getMessage()}
          </motion.h1>

          <NeonCard color={getColor() as any} className="text-center space-y-6">
            <div>
              <motion.div
                className="text-[#00FFFF] text-sm pixel-text mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                TOPIC: {topic.toUpperCase()}
              </motion.div>

              <motion.div
                className="text-8xl md:text-9xl font-bold pixel-text"
                style={{
                  color: '#FFFF00',
                  textShadow: '0 0 20px #FFFF00, 0 0 30px #FFFF00'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                {score}
              </motion.div>

              <motion.div
                className="text-2xl text-[#00FFFF] pixel-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                OUT OF {numQuestions}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-4"
            >
              <div className="text-[#FF00FF] text-xl mb-2 pixel-text">
                ACCURACY
              </div>
              <div className="w-full h-8 bg-black/70 border-2 border-[#00FFFF] overflow-hidden">
                <motion.div
                  className="h-full flex items-center justify-center font-bold pixel-text"
                  style={{
                    background: `linear-gradient(90deg, #00FFFF, ${getColor() === 'yellow' ? '#FFFF00' : getColor() === 'green' ? '#00FF00' : getColor() === 'cyan' ? '#00FFFF' : '#FF00FF'})`,
                    boxShadow: '0 0 20px #00FFFF'
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 1.1, duration: 1, ease: 'easeOut' }}
                >
                  <span className="text-black">{percentage}%</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="pt-6"
            >
              <div className="flex gap-4">
                <NeonButton
                  text="HOME"
                  color="magenta"
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1"
                />
                <NeonButton
                  text="PLAY AGAIN"
                  color="cyan"
                  onClick={handlePlayAgain}
                  className="flex-1"
                />
              </div>
            </motion.div>
          </NeonCard>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="text-center mt-8"
          >
            <div
              className="text-[#00FF00] text-sm pixel-text"
              style={{ textShadow: '0 0 10px #00FF00' }}
            >
              {isPerfect ? '★ LEGENDARY ★' : isGood ? '◆ MASTER ◆' : isOkay ? '▲ NOVICE ▲' : '● BEGINNER ●'}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
