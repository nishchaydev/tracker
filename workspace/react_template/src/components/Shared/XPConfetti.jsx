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

    if (elapsed < 1200) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
}

export default function XPConfetti() {
  const { xpEvent } = useGamification();
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!xpEvent) return;

    // Major events threshold → centered animation; minor → skip (toast optional later)
    const isMajor = xpEvent.amount >= 20 || ['task', 'streak', 'timetable-slot', 'journal'].includes(xpEvent.source);
    if (!isMajor) return;

    setVisible(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawConfettiBurst(ctx, rect.width, rect.height);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 1400);

    return () => clearTimeout(timeoutRef.current);
  }, [xpEvent]);

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
        <div className="text-3xl font-extrabold text-blue-600 drop-shadow-sm select-none" style={{ position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%, -50%)' }}>
          +{xpEvent?.amount || 0} XP
        </div>
      </div>
    </div>
  );
}


