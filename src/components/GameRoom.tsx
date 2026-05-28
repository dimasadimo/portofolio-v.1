import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useIntl } from 'react-intl';
import { useSnake, useTetris, useBreakout } from '../hooks/useGames';
import { cn } from '../lib/utils';

type GameType = 'snake' | 'tetris' | 'breakout';

export const GameRoom: React.FC = () => {
  const intl = useIntl();
  const [activeGame, setActiveGame] = useState<GameType>('snake');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const snake = useSnake(canvasRef, activeGame === 'snake');
  const tetris = useTetris(canvasRef, activeGame === 'tetris');
  const breakout = useBreakout(canvasRef, activeGame === 'breakout');

  const currentScore = activeGame === 'snake' ? snake.score : 
                       activeGame === 'tetris' ? tetris.score : 
                       breakout.score;

  const isGameOver = activeGame === 'snake' ? snake.gameOver : 
                     activeGame === 'tetris' ? tetris.gameOver : 
                     breakout.gameOver;

  return (
    <section id="bored" className="py-24 px-4 bg-[var(--bg-primary)]">
      <div className="container mx-auto flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
            <h2 className="text-5xl font-display font-bold">{intl.formatMessage({ id: 'game.title' })}</h2>
            <p className="text-[var(--text-muted)]">Take a break with some retro classics.</p>
        </div>

        {/* Game Selector */}
        <div className="flex gap-4 p-2 bg-[var(--border-color)] rounded-2xl border border-[var(--border-color)]">
          {(['snake', 'tetris', 'breakout'] as GameType[]).map((game) => (
            <button
              key={game}
              onClick={() => setActiveGame(game)}
              className={cn(
                "px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
                activeGame === game ? "bg-orange text-white" : "text-[var(--text-muted)] hover:bg-orange/10 hover:text-orange"
              )}
            >
              {intl.formatMessage({ id: `game.${game}` })}
            </button>
          ))}
        </div>

        {/* Nokia / Retro Shell */}
        <div className="relative group">
            {/* Outer Shell */}
            <div className="w-[320px] h-[580px] bg-[#d1d1d1] dark:bg-[#2a2a2a] rounded-[50px] border-[10px] border-[#a1a1a1] dark:border-[#1a1a1a] shadow-2xl relative transition-colors duration-500">
                
                {/* Screen Bezel */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[260px] h-[240px] bg-[#1a1a1a] rounded-lg p-2 flex flex-col shadow-inner">
                    {/* Top Status Bar */}
                    <div className="flex justify-between items-center text-[8px] text-white/40 font-press-start mb-2 uppercase">
                        <span>{activeGame}</span>
                        <span>{intl.formatMessage({ id: 'game.score' })}: {currentScore}</span>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 relative rounded overflow-hidden bg-black">
                        <canvas 
                            ref={canvasRef} 
                            width={240} 
                            height={200}
                            className={cn(
                                "w-full h-full object-contain",
                                activeGame === 'snake' ? "[image-rendering:pixelated]" : ""
                            )}
                        />

                        {/* CRT Effect Overlay */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,128,0.03))] bg-[length:100%_2px,3px_100%] opacity-20" />
                        
                        {/* Game Over Screen */}
                        {isGameOver && (
                            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
                                <h3 className="text-orange font-press-start text-xs mb-4">GAME OVER</h3>
                                <button 
                                    onClick={() => activeGame === 'snake' ? snake.reset() : activeGame === 'tetris' ? tetris.reset() : breakout.reset()}
                                    className="px-4 py-2 bg-orange text-white font-press-start text-[8px] rounded"
                                >
                                    RETRY
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Keypad */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[240px] grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                        <div 
                            key={key} 
                            className="w-full aspect-square bg-[#b1b1b1] dark:bg-[#3a3a3a] rounded-full border-b-4 border-[#818181] dark:border-[#1a1a1a] flex items-center justify-center text-[var(--text-primary)]/40 dark:text-white/20 font-bold active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
                        >
                            {key}
                        </div>
                    ))}
                </div>

                {/* Logo */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[var(--text-primary)]/20 dark:text-white/10 font-bold tracking-widest text-[10px]">
                    ADIMO 3310
                </div>
            </div>

            {/* Glowing Accent */}
            <div className="absolute -inset-4 bg-orange/5 blur-2xl rounded-full -z-10 group-hover:bg-orange/10 transition-colors" />
        </div>

        <p className="text-[var(--text-muted)] text-xs italic">Use arrow keys to control snake.</p>
      </div>
    </section>
  );
};
