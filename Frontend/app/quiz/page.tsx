// Updated QuizPage with FIXED correct answer comparison and type handling
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NeonButton from '@/components/NeonButton';
import NeonCard from '@/components/NeonCard';
import SpaceBattle from '@/components/ui/SpaceBattle';
import { useQuizStore } from '@/store/quizStore';

export default function QuizPage() {
  const router = useRouter();
  const {
    questions,
    userAnswers,
    setUserAnswer,
    setScore,
    setLoading,
    setError
  } = useQuizStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Space Battle Animation States
  const [battleAnimation, setBattleAnimation] = useState<'correct' | 'wrong' | 'idle'>('idle');
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    if (questions.length === 0) {
      router.push('/setup');
    }
  }, [questions, router]);

  if (questions.length === 0) {
    return null;
  }

  const question = questions[currentQuestion];

  let opts: Record<string, string> = {};

  // FIXED: Proper type checking and handling with proper type guards
  const questionOptions = question.options;
  const questionChoices = (question as any).choices;

  if (Array.isArray(questionOptions)) {
    // It's an array - map to A, B, C, D
    ['A', 'B', 'C', 'D'].forEach((key, i) => {
      opts[key] = questionOptions[i] || '';
    });
  } else if (typeof questionOptions === 'object' && questionOptions !== null && !Array.isArray(questionOptions)) {
    // It's already an object with keys - use type assertion after guard
    opts = questionOptions as Record<string, string>;
  } else if (Array.isArray(questionChoices)) {
    // Fallback to choices if options doesn't exist
    ['A', 'B', 'C', 'D'].forEach((key, i) => {
      opts[key] = questionChoices[i] || '';
    });
  } else {
    // Final fallback
    opts = { A: '', B: '', C: '', D: '' };
  }

  const options = [
    { key: 'A', value: opts.A },
    { key: 'B', value: opts.B },
    { key: 'C', value: opts.C },
    { key: 'D', value: opts.D }
  ];

  const handleSelectAnswer = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
      setUserAnswer(currentQuestion, answer);
      setIsAnswered(true);
      
      // FIXED: Check both camelCase and snake_case for correct answer
      const correctAnswer = (question as any).correctAnswer || (question as any).correct_answer;
      const isCorrect = answer === correctAnswer;
      
      // Debug logging
      console.log('Selected answer:', answer);
      console.log('Correct answer:', correctAnswer);
      console.log('Is correct:', isCorrect);
      
      setBattleAnimation(isCorrect ? 'correct' : 'wrong');
    }
  };

  const handleAnimationComplete = () => {
    // Reset battle animation and show next button
    setBattleAnimation('idle');
    setShowNextButton(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowNextButton(false);
      setBattleAnimation('idle');
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError(null);

    try {
      const formattedAnswers = questions.map((_, index) => ({
        question_number: index + 1,
        user_answer: userAnswers[index] || ''
      }));

      const response = await fetch('http://localhost:8000/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: formattedAnswers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate quiz');
      }

      const data = await response.json();
      setScore(data.score || 0);
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>
      <div className="scanline-overlay" />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl"
        >
          {/* Progress Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-[#FFFF00] text-sm pixel-text"
                style={{ textShadow: '0 0 5px #FFFF00' }}
              >
                QUESTION {currentQuestion + 1} OF {questions.length}
              </span>
              <span
                className="text-[#00FF00] text-sm pixel-text"
                style={{ textShadow: '0 0 5px #00FF00' }}
              >
                SCORE: {Object.keys(userAnswers).length}/{questions.length}
              </span>
            </div>
            <div className="w-full h-3 bg-black/70 border-2 border-[#00FFFF]">
              <motion.div
                className="h-full bg-[#00FFFF]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: '0 0 10px #00FFFF'
                }}
              />
            </div>
          </div>

          {/* Space Battle Animation */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SpaceBattle 
              animationType={battleAnimation}
              onAnimationComplete={handleAnimationComplete}
            />
          </motion.div>

          {/* Quiz Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <NeonCard color="cyan" className="mb-6">
                <h2
                  className="text-xl md:text-2xl text-[#00FFFF] mb-6 pixel-text leading-relaxed"
                  style={{ textShadow: '0 0 5px #00FFFF' }}
                >
                  {question.question}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {options.map((option) => {
                    const isSelected = selectedAnswer === option.key;
                    // FIXED: Check both camelCase and snake_case
                    const correctAnswer = (question as any).correctAnswer || (question as any).correct_answer;
                    const isCorrect = option.key === correctAnswer;
                    
                    // Show correct/incorrect colors after answer is selected
                    let buttonStyle = '';
                    if (isAnswered) {
                      if (isSelected && isCorrect) {
                        buttonStyle = 'bg-[#00FF00] text-black border-[#00FF00] shadow-[0_0_20px_#00FF00]';
                      } else if (isSelected && !isCorrect) {
                        buttonStyle = 'bg-[#FF0066] text-white border-[#FF0066] shadow-[0_0_20px_#FF0066]';
                      } else if (!isSelected && isCorrect) {
                        buttonStyle = 'bg-[#00FF00]/30 text-[#00FF00] border-[#00FF00] shadow-[0_0_15px_#00FF00]';
                      } else {
                        buttonStyle = 'bg-black/30 text-[#00FFFF]/50 border-[#00FFFF]/30';
                      }
                    } else {
                      buttonStyle = isSelected
                        ? 'bg-[#FFFF00] text-black border-[#FFFF00] shadow-[0_0_20px_#FFFF00]'
                        : 'bg-black/70 text-[#00FFFF] border-[#00FFFF] hover:shadow-[0_0_15px_#00FFFF]';
                    }

                    return (
                      <motion.button
                        key={option.key}
                        onClick={() => handleSelectAnswer(option.key)}
                        disabled={isAnswered}
                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                        className={`
                          text-left px-6 py-4 border-2 transition-all duration-300
                          ${buttonStyle}
                          disabled:cursor-not-allowed
                        `}
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                        }}
                      >
                        <span className="font-bold mr-3">{option.key}.</span>
                        <span>{option.value}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </NeonCard>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <NeonButton
                  text="QUIT"
                  color="magenta"
                  variant="outline"
                  onClick={() => router.push('/setup')}
                />

                <AnimatePresence>
                  {showNextButton && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <NeonButton
                        text={currentQuestion === questions.length - 1 ? 'SUBMIT' : 'NEXT'}
                        color="green"
                        onClick={handleNext}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}