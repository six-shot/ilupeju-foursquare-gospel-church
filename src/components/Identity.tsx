'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Frame } from './ui';

const WORDS = [
  { word: 'Faith', dir: 1, speed: 1, outline: false },
  { word: 'Community', dir: -1, speed: 1.35, outline: true },
  { word: 'Purpose', dir: 1, speed: 0.8, outline: false },
  { word: 'Worship', dir: -1, speed: 1.1, outline: false },
];

const FLOATERS = [
  { img: 'identity1' as const, cls: 'left-[6%] top-[12%] w-[24vw] md:w-[14vw] aspect-[3/4]', y: -40 },
  { img: 'identity2' as const, cls: 'right-[8%] top-[30%] w-[28vw] md:w-[16vw] aspect-[3/4]', y: -80 },
  { img: 'identity3' as const, cls: 'left-[30%] bottom-[8%] w-[26vw] md:w-[13vw] aspect-[3/4]', y: -120 },
  { img: 'identity4' as const, cls: 'right-[28%] bottom-[18%] w-[22vw] md:w-[11vw] aspect-[3/4]', y: -60 },
];

/**
 * Identity — four huge words sliding against each other at different speeds, with
 * photographs drifting through the gaps (some in front, some behind). At the end
 * "Worship" grows past the edges of the screen while an image opens behind it,
 * so the typography hands over to the next scene.
 */
export default function Identity() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', scrub: 1, pin: true, anticipatePin: 1 },
      });
      q('.id-row').forEach((row: Element, i: number) => {
        const { dir, speed } = WORDS[i];
        tl.fromTo(row, { xPercent: dir * 28 * speed }, { xPercent: -dir * 34 * speed, duration: 1 }, 0);
      });
      q('.id-float').forEach((el: Element, i: number) => {
        tl.fromTo(el, { yPercent: 60 }, { yPercent: FLOATERS[i].y - 60, duration: 1 }, 0);
        tl.fromTo(el.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 1 }, 0);
      });
      // Hand-over: Worship grows, the others fade, an image opens behind.
      tl.to(q('.id-row:not(.id-last)'), { opacity: 0, filter: 'blur(8px)', duration: 0.3 }, 1)
        .to(q('.id-float'), { opacity: 0, scale: 0.85, duration: 0.3 }, 1)
        .to(q('.id-last'), { xPercent: 0, yPercent: -120, scale: 5.5, opacity: 0, duration: 0.65, ease: 'power2.in' }, 1.05)
        .fromTo(q('.id-reveal'), { clipPath: 'inset(45% 45% 45% 45%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut' }, 1.1)
        .fromTo(q('.id-reveal img'), { scale: 1.5 }, { scale: 1.05, duration: 0.6, ease: 'power2.inOut' }, 1.1)
        .fromTo(q('.id-reveal-text .line-inner'), { yPercent: 115 }, { yPercent: 0, duration: 0.25, stagger: 0.06, ease: 'power3.out' }, 1.5)
        .to({}, { duration: 0.25 });
    },
    { scope: root },
  );

  return (
    <section id="identity" ref={root} className="relative h-svh w-full overflow-hidden bg-ivory text-ink" aria-label="Who we are">
      {/* Floating images behind the words */}
      {FLOATERS.slice(0, 2).map((f, i) => (
        <div key={i} className={`id-float absolute z-0 ${f.cls}`}>
          <Frame img={f.img} className="h-full w-full rounded-[10px]" sizes="20vw" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col justify-center gap-[1vh]">
        {WORDS.map((w, i) => (
          <div
            key={w.word}
            className={`id-row display whitespace-nowrap text-[24vw] md:text-[17vw] ${i === 3 ? 'id-last origin-center text-center' : ''} ${
              i % 2 ? 'self-end' : 'self-start'
            }`}
            style={w.outline ? { WebkitTextStroke: '0.018em #0d0c0a', color: 'transparent' } : undefined}
          >
            {w.word}
          </div>
        ))}
      </div>

      {/* Floating images in front of the words */}
      {FLOATERS.slice(2).map((f, i) => (
        <div key={i + 2} className={`id-float absolute z-20 ${f.cls}`}>
          <Frame img={f.img} className="h-full w-full rounded-[10px]" sizes="20vw" />
        </div>
      ))}

      <div className="absolute left-5 top-6 z-30 md:left-10 md:top-8">
        <span className="eyebrow text-ink/60">Who we are</span>
      </div>

      {/* Hand-over image */}
      <div className="id-reveal absolute inset-0 z-30" style={{ clipPath: 'inset(50% 50% 50% 50%)' }}>
        <Frame img="identityReveal" alt="The choir ministering beneath the cross" className="absolute inset-0" position="50% 40%" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="id-reveal-text absolute inset-x-0 bottom-[10svh] px-6 text-center text-ivory">
          <span className="line-mask"><span className="line-inner eyebrow text-fs-gold">The Foursquare Gospel</span></span>
          <span className="line-mask"><span className="line-inner serif mt-3 text-5xl italic md:text-7xl">One Christ. Four-fold.</span></span>
        </div>
      </div>
    </section>
  );
}
