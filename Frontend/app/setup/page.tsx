'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NeonButton from '@/components/NeonButton';
import NeonCard from '@/components/NeonCard';
import { useQuizStore } from '@/store/quizStore';

export default function SetupPage() {
  const router = useRouter();
  const {
    topic,
    difficulty,
    numQuestions,
    setTopic,
    setDifficulty,
    setNumQuestions,
    setQuestions,
    setLoading,
    setError,
    isLoading,
    error
  } = useQuizStore();

  const [localTopic, setLocalTopic] = useState(topic);

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleGenerateQuiz = async () => {
    if (!localTopic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setTopic(localTopic);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/generate_quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: localTopic,
          num_questions: numQuestions,
          difficulty: difficulty
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuestions(data.questions || data);
      router.push('/quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="scanline-overlay" />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <h1
            className="text-3xl md:text-5xl font-bold mb-8 text-center pixel-text"
            style={{
              color: '#00FFFF',
              textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF'
            }}
          >
            SET-UP
          </h1>

          <NeonCard color="cyan" className="space-y-6">
            <div>
              <label
                className="block text-[#FFFF00] text-sm mb-2 pixel-text"
                style={{ textShadow: '0 0 5px #FFFF00' }}
              >
                TOPIC
              </label>
              <input
                type="text"
                value={localTopic}
                onChange={(e) => setLocalTopic(e.target.value)}
                placeholder="e.g., Space, History, Science..."
                className="w-full bg-black/70 border-2 border-[#00FFFF] text-[#00FFFF] px-4 py-3 focus:outline-none focus:shadow-[0_0_15px_#00FFFF]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              />
            </div>

            <div>
              <label
                className="block text-[#FFFF00] text-sm mb-2 pixel-text"
                style={{ textShadow: '0 0 5px #FFFF00' }}
              >
                DIFFICULTY
              </label>
              <div className="flex gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`
                      flex-1 px-4 py-3 border-2 font-bold text-sm transition-all
                      ${difficulty === diff
                        ? 'bg-[#00FFFF] text-black border-[#00FFFF] shadow-[0_0_15px_#00FFFF]'
                        : 'bg-black/70 text-[#00FFFF] border-[#00FFFF]/50 hover:border-[#00FFFF]'
                      }
                    `}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                    }}
                  >
                    {diff.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="block text-[#FFFF00] text-sm mb-2 pixel-text"
                style={{ textShadow: '0 0 5px #FFFF00' }}
              >
                NUMBER OF QUESTIONS: {numQuestions}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="flex-1 h-2 bg-black/70 appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-6
                    [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:bg-[#00FFFF]
                    [&::-webkit-slider-thumb]:shadow-[0_0_10px_#00FFFF]
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-6
                    [&::-moz-range-thumb]:h-6
                    [&::-moz-range-thumb]:bg-[#00FFFF]
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:shadow-[0_0_10px_#00FFFF]
                    [&::-moz-range-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${(numQuestions / 10) * 100}%, rgba(0,255,255,0.2) ${(numQuestions / 10) * 100}%, rgba(0,255,255,0.2) 100%)`
                  }}
                />
                <span className="text-[#00FFFF] text-2xl font-bold w-12 text-center">
                  {numQuestions}
                </span>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/20 border-2 border-red-500 p-4 text-red-400 text-sm pixel-text"
              >
                ERROR: {error}
              </motion.div>
            )}

            <div className="flex gap-4 pt-4">
              <NeonButton
                text="BACK"
                color="magenta"
                variant="outline"
                onClick={() => router.push('/')}
                disabled={isLoading}
                className="flex-1"
              />
              <NeonButton
                text={isLoading ? 'LOADING...' : 'GENERATE'}
                color="cyan"
                onClick={handleGenerateQuiz}
                disabled={isLoading}
                className="flex-1"
              />
            </div>
          </NeonCard>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8"
            >
              <div
                className="text-[#00FFFF] text-xl pixel-text neon-flicker"
                style={{ textShadow: '0 0 10px #00FFFF' }}
              >
                GENERATING QUIZ...
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
