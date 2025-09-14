import { useEffect, useRef, useState } from 'react';
import { useGamification } from '../../contexts/GamificationContext';

// Lightweight canvas confetti (no external deps). Runs <1.5s and is non-blocking.
function drawConfettiBurst(ctx, width, height) {
  const particleCount = 80;
  const particles = Array.from({ length: particleCount }).map(() => ({
    x: width / 2,
    y: height / 2,
    angle: Math.random() * Math.PI * 2,
    speed: 2 + Math.random() * 4,
    size: 2 + Math.random() * 3,
    color: `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`,
    life: 900 + Math.random() * 300
  }));

  let start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      // simple physics
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed + 0.5; // gravity
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    if (elapsed < 2000) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
}

export default function XPConfetti() {
  const { xpEvent, clearXpEvent } = useGamification();
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const canvasRef = useRef(null);
  const timeoutRef = useRef(null);
  const textTimeoutRef = useRef(null);

  useEffect(() => {
    if (!xpEvent) return;

    // Major events threshold → centered animation; minor → skip (toast optional later)
    const isMajor = xpEvent.amount >= 20 || ['task', 'streak', 'timetable-slot', 'journal'].includes(xpEvent.source);
    if (!isMajor) {
      clearXpEvent();
      return;
    }

    setVisible(true);
    setTextVisible(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawConfettiBurst(ctx, rect.width, rect.height);

    // Clear any existing timeouts
    clearTimeout(timeoutRef.current);
    clearTimeout(textTimeoutRef.current);

    // Hide text after 1.5 seconds with fade out
    textTimeoutRef.current = setTimeout(() => {
      setTextVisible(false);
    }, 1500);

    // Hide entire component and clear event after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      clearXpEvent();
    }, 3000);

    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(textTimeoutRef.current);
    };
  }, [xpEvent, clearXpEvent]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none', // non-blocking
      zIndex: 50
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
        <div 
          className={`text-3xl font-extrabold text-blue-600 drop-shadow-sm select-none transition-all duration-500 ${
            textVisible ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-75'
          }`}
          style={{ 
            position: 'absolute', 
            left: '50%', 
            top: '45%', 
            transform: 'translate(-50%, -50%)'
          }}
        >
          +{xpEvent?.amount || 0} XP
        </div>
      </div>
    </div>
  );
}



