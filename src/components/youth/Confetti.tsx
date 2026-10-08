'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { prefersReducedMotion } from '@/lib/gsap';

// Fire colours from the Sent Ones scene, plus the four Foursquare colours.
const COLORS = ['#ffd75a', '#ffab1f', '#f2600c', '#f3ede3', '#d82820', '#0080c0', '#f8c000', '#984878'];

type Piece = { x: number; y: number; vx: number; vy: number; w: number; h: number; rot: number; vr: number; color: string; tilt: number };

/**
 * A one-off burst of confetti over the whole screen, fired from both bottom corners.
 * Mount it when there is something to celebrate; it clears itself after a few seconds.
 * Skipped entirely for people who asked the OS for less motion.
 */
export default function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || prefersReducedMotion()) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const count = W < 640 ? 110 : 190;
    const pieces: Piece[] = Array.from({ length: count }, (_, i) => {
      const fromLeft = i % 2 === 0;
      // each corner throws up and inward, in a fan
      const angle = (fromLeft ? -Math.PI / 3 : (-2 * Math.PI) / 3) + (Math.random() - 0.5) * 0.9;
      const speed = (0.55 + Math.random() * 0.85) * Math.sqrt(H) * 0.85;
      return {
        x: fromLeft ? -10 : W + 10,
        y: H * 0.92,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 7,
        h: 9 + Math.random() * 9,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        tilt: Math.random() * Math.PI * 2,
      };
    });

    const DURATION = 4200;
    const start = performance.now();
    let last = start;
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const elapsed = now - start;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = Math.min(1, (DURATION - elapsed) / 900);
      for (const p of pieces) {
        p.vy += 0.22 * dt; // gravity
        p.vx *= 0.975; // air drag, so pieces float down rather than drop
        p.vy *= 0.975;
        p.x += p.vx * dt + Math.sin(p.tilt + elapsed / 260) * 0.9; // flutter
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.tilt + elapsed / 140)); // the piece turning over as it falls
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (elapsed < DURATION) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Portalled to <body>: inside the ticket, the mask and shadow filter would trap and clip a fixed canvas.
  return createPortal(
    <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[70] h-full w-full" aria-hidden />,
    document.body,
  );
}
