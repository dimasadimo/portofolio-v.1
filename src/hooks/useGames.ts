import { useState, useEffect, useCallback, useRef } from 'react';

// --- SNAKE ---
export const useSnake = (canvasRef: React.RefObject<HTMLCanvasElement | null>, isActive: boolean) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 0;
    let dy = 0;
    let nextDx = 0;
    let nextDy = 0;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dy === 0) { nextDx = 0; nextDy = -1; }
      if (e.key === 'ArrowDown' && dy === 0) { nextDx = 0; nextDy = 1; }
      if (e.key === 'ArrowLeft' && dx === 0) { nextDx = -1; nextDy = 0; }
      if (e.key === 'ArrowRight' && dx === 0) { nextDx = 1; nextDy = 0; }
    };

    window.addEventListener('keydown', handleKey);

    const gameLoop = setInterval(() => {
      dx = nextDx;
      dy = nextDy;
      
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      
      // Collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
          snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = '#9bbc0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f380f';
      snake.forEach(s => ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize - 2, gridSize - 2));
      
      ctx.fillStyle = '#306230';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    }, 100);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isActive, canvasRef]);

  return { score, gameOver, reset: () => { setScore(0); setGameOver(false); } };
};

// --- TETRIS ---
export const useTetris = (canvasRef: React.RefObject<HTMLCanvasElement | null>, isActive: boolean) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Very simplified Tetris for MVP
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText('TETRIS MODE', 40, 100);
    ctx.fillText('COMING SOON', 40, 120);
    
  }, [isActive, canvasRef]);

  return { score, gameOver, reset: () => { setScore(0); setGameOver(false); } };
};

// --- BREAKOUT ---
export const useBreakout = (canvasRef: React.RefObject<HTMLCanvasElement | null>, isActive: boolean) => {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
  
    useEffect(() => {
      if (!isActive || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText('BREAKOUT MODE', 40, 100);
      ctx.fillText('COMING SOON', 40, 120);
      
    }, [isActive, canvasRef]);
  
    return { score, gameOver, reset: () => { setScore(0); setGameOver(false); } };
};
