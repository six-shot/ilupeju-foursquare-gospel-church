'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Emblem } from './Emblem';

/**
 * Opening curtain: the four symbols of the Foursquare emblem (cross, cup, dove, crown)
 * arrive from four different sides, lock together and light up; the name writes in,
 * then the curtain lifts (clip-path)
 * and the hero intro plays (`loader:done` event).
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const done = () => window.dispatchEvent(new Event('loader:done'));
      document.documentElement.classList.add('is-loading');
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          document.documentElement.classList.remove('is-loading');
          gsap.set(root.current, { display: 'none' });
        },
      });
      // Each symbol arrives from its own side of the screen: cross ← left, cup ↓ top,
      // dove ↑ bottom, crown → right. Offsets are converted from screen px into the
      // emblem's 938-unit SVG space so they start just off-screen at any size.
      const svg = root.current!.querySelector('svg')!;
      const k = 938 / svg.getBoundingClientRect().width;
      const offX = (window.innerWidth / 2 + 120) * k;
      const offY = (window.innerHeight / 2 + 120) * k;
      const from = {
        cross: { x: -offX, y: 0, rotate: -25 },
        cup: { x: 0, y: -offY, rotate: 20 },
        dove: { x: 0, y: offY, rotate: -20 },
        crown: { x: offX, y: 0, rotate: 25 },
      };
      (Object.keys(from) as (keyof typeof from)[]).forEach((part, i) => {
        tl.from(`.ld-tile.emblem-${part}`, { ...from[part], duration: 1.05, ease: 'expo.out' }, i * 0.16);
      });
      tl.to('.emblem-panel', { fill: '#ffffff', duration: 0.5, stagger: 0.06, ease: 'power2.out' }, '-=0.35')
        .from('.ld-name .line-inner', { yPercent: 110, duration: 1.1, stagger: 0.08 }, '-=0.45')
        .to('.ld-count', { innerText: 100, snap: { innerText: 1 }, duration: 1.6, ease: 'power2.inOut' }, 0)
        .to('.ld-inner', { yPercent: -18, opacity: 0, duration: 0.9, ease: 'power3.in' }, '+=0.15')
        .add(done, '-=0.35')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.25, ease: 'expo.inOut' }, '-=0.55');
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] grid place-items-center bg-ink"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      aria-hidden
    >
      <div className="ld-inner flex flex-col items-center gap-7">
        <Emblem className="h-28 w-28 md:h-36 md:w-36" tileClass="ld-tile" colored symbolColor="#0d0c0a" />
        <div className="ld-name text-center">
          <span className="line-mask">
            <span className="line-inner serif text-2xl text-ivory md:text-3xl">Ilupeju Foursquare</span>
          </span>
          <span className="line-mask mt-2">
            <span className="line-inner eyebrow text-muted">Gospel Church · Lagos</span>
          </span>
        </div>
      </div>
      <span className="ld-count eyebrow absolute bottom-8 right-8 tabular-nums text-muted">0</span>
    </div>
  );
}
