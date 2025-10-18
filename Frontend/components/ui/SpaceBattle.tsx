// components/SpaceBattle.tsx - FIXED VERSION
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpaceBattleProps {
  animationType: 'correct' | 'wrong' | 'idle';
  onAnimationComplete?: () => void;
}

const SpaceBattle: React.FC<SpaceBattleProps> = ({ 
  animationType, 
  onAnimationComplete 
}) => {
  const [showLaser, setShowLaser] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (animationType === 'idle') return;

    const sequence = async () => {
      // Show laser
      setShowLaser(true);
      
      // After laser animation, show explosion/hit effect
      setTimeout(() => {
        setShowLaser(false);
        setShowExplosion(true);
        
        // Generate explosion particles for correct answers
        if (animationType === 'correct') {
          const newParticles = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 40 - 20,
            y: Math.random() * 40 - 20,
          }));
          setParticles(newParticles);
        }
      }, 600);

      // Clean up after explosion
      setTimeout(() => {
        setShowExplosion(false);
        setParticles([]);
        onAnimationComplete?.();
      }, 1200);
    };

    sequence();
  }, [animationType, onAnimationComplete]);

  return (
    <div className="relative w-full h-24 bg-black/40 border border-[#00FFFF]/30 overflow-hidden" 
         style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
      <svg className="w-full h-full" viewBox="0 0 400 96">
        {/* Background grid for cyberpunk feel */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="#00FFFF"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Player Ship (Left) - Triangle pointing RIGHT */}
        <motion.g
          animate={
            animationType === 'wrong'
              ? {
                  x: [0, -6, 6, -3, 3, 0],
                  transition: { duration: 0.6, ease: 'easeInOut' }
                }
              : {}
          }
        >
          <motion.polygon
            points="50,48 75,35 75,61"
            fill="none"
            stroke="#00FFFF"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_#00FFFF]"
            animate={
              animationType === 'wrong'
                ? {
                    stroke: ['#00FFFF', '#FF0066', '#00FFFF'],
                    transition: { duration: 0.6, ease: 'easeInOut' }
                  }
                : {}
            }
          />
          {/* Player ship glow */}
          <motion.polygon
            points="50,48 75,35 75,61"
            fill="#00FFFF"
            fillOpacity="0.1"
            animate={
              animationType === 'correct'
                ? {
                    fillOpacity: [0.1, 0.3, 0.1],
                    transition: { duration: 0.3, ease: 'easeInOut' }
                  }
                : {}
            }
          />
        </motion.g>

        {/* Enemy Ship (Right) - Triangle pointing LEFT */}
        <AnimatePresence>
          {animationType !== 'correct' || !showExplosion ? (
            <motion.g
              exit={
                animationType === 'correct'
                  ? {
                      scale: 0,
                      rotate: 180,
                      transition: { duration: 0.4, ease: 'easeOut' }
                    }
                  : {}
              }
            >
              <motion.polygon
                points="350,48 325,35 325,61"
                fill="none"
                stroke="#FF0066"
                strokeWidth="2"
                className="drop-shadow-[0_0_8px_#FF0066]"
                animate={
                  animationType === 'correct' && showExplosion
                    ? {
                        stroke: ['#FF0066', '#FFFF00', '#FF0066'],
                        transition: { duration: 0.2, ease: 'easeInOut', repeat: 2 }
                      }
                    : {}
                }
              />
              {/* Enemy ship glow */}
              <motion.polygon
                points="350,48 325,35 325,61"
                fill="#FF0066"
                fillOpacity="0.1"
                animate={
                  animationType === 'wrong'
                    ? {
                        fillOpacity: [0.1, 0.3, 0.1],
                        transition: { duration: 0.3, ease: 'easeInOut' }
                      }
                    : {}
                }
              />
            </motion.g>
          ) : null}
        </AnimatePresence>

        {/* Laser Beams */}
        <AnimatePresence>
          {showLaser && (
            <>
              <motion.line
                x1={animationType === 'correct' ? 75 : 325}
                y1="48"
                x2={animationType === 'correct' ? 325 : 75}
                y2="48"
                stroke={animationType === 'correct' ? '#00FF00' : '#FF0066'}
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: [0, 1, 1, 0],
                  transition: { duration: 0.6, ease: 'easeOut' }
                }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                style={{
                  filter: `drop-shadow(0 0 8px ${animationType === 'correct' ? '#00FF00' : '#FF0066'})`
                }}
              />
              {/* Outer glow for laser */}
              <motion.line
                x1={animationType === 'correct' ? 75 : 325}
                y1="48"
                x2={animationType === 'correct' ? 325 : 75}
                y2="48"
                stroke={animationType === 'correct' ? '#00FF00' : '#FF0066'}
                strokeWidth="6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: [0, 0.3, 0.3, 0],
                  transition: { duration: 0.6, ease: 'easeOut' }
                }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Explosion Particles for CORRECT answers (enemy ship explodes) */}
        <AnimatePresence>
          {showExplosion && animationType === 'correct' && (
            <g>
              {particles.map((particle) => (
                <motion.circle
                  key={particle.id}
                  cx="337"
                  cy="48"
                  r="2"
                  fill="#FFFF00"
                  className="drop-shadow-[0_0_6px_#FFFF00]"
                  initial={{ 
                    scale: 0, 
                    x: 0, 
                    y: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    x: particle.x * 2,
                    y: particle.y * 2,
                    opacity: [1, 0.8, 0],
                    transition: { 
                      duration: 0.8, 
                      ease: 'easeOut',
                      delay: Math.random() * 0.1
                    }
                  }}
                  exit={{ opacity: 0 }}
                />
              ))}
              
              {/* Central explosion flash */}
              <motion.circle
                cx="337"
                cy="48"
                r="15"
                fill="#FFFF00"
                fillOpacity="0.6"
                className="drop-shadow-[0_0_20px_#FFFF00]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 0],
                  opacity: [0, 0.8, 0],
                  transition: { duration: 0.4, ease: 'easeOut' }
                }}
                exit={{ opacity: 0 }}
              />
            </g>
          )}
        </AnimatePresence>

        {/* Hit effect for WRONG answers (player ship gets hit) */}
        <AnimatePresence>
          {showExplosion && animationType === 'wrong' && (
            <motion.circle
              cx="62"
              cy="48"
              r="12"
              fill="#FF0066"
              fillOpacity="0.4"
              className="drop-shadow-[0_0_15px_#FF0066]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
                transition: { duration: 0.6, ease: 'easeOut' }
              }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export default SpaceBattle;