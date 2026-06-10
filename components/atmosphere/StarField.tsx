'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  phase: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: Star[] = [];
    const STAR_COUNT = 120;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Initialize stars
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.15 + 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const time = performance.now() * 0.001;

      for (const star of stars) {
        // Slow drift downward
        star.y += star.speed;
        if (star.y > canvas!.height + 5) {
          star.y = -5;
          star.x = Math.random() * canvas!.width;
        }

        // Breathing opacity
        const breathe = Math.sin(time * 0.4 + star.phase) * 0.3 + 0.7;
        const alpha = star.opacity * breathe;

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180,200,255,${alpha})`;
        ctx!.fill();

        // Subtle glow for brighter stars
        if (star.r > 1) {
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(140,170,255,${alpha * 0.15})`;
          ctx!.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
