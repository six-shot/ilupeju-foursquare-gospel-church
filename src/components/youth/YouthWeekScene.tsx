'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Chars } from '../ui';
import { youthWeek } from '@/content/youthWeek';

/**
 * The two plates (generated for this site): a wide one for larger screens and a tall one
 * for phones. `flames` are the tops of the four heads, as % of the plate, where the
 * flickering flames sit.
 */
const PLATES = [
  {
    key: 'wide', src: '/images/youth/sent-ones-wide.jpg', ratio: 1376 / 768, show: 'hidden md:block', flame: '1.7%',
    flames: [{ x: 34.5, y: 44.6 }, { x: 45.2, y: 56.2 }, { x: 55.3, y: 39.4 }, { x: 66.8, y: 47.2 }],
  },
  {
    key: 'tall', src: '/images/youth/sent-ones-tall.jpg', ratio: 768 / 1376, show: 'md:hidden', flame: '3.6%',
    flames: [{ x: 24.8, y: 55.2 }, { x: 42.7, y: 62.7 }, { x: 58.6, y: 52.7 }, { x: 78.0, y: 57.4 }],
  },
];

/** Embers: positions derived from the index so server and client render the same sparks. */
const EMBERS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  size: 2 + (i % 4),
  duration: `${6 + (i % 5) * 1.6}s`,
  delay: `${-(i * 0.83).toFixed(2)}s`,
  drift: `${((i % 7) - 3) * 14}px`,
}));

/**
 * Youth Week on the home page — our own take on the "Sent Ones" artwork. One pinned
 * stage: the sent ones come up out of the dark, walking into the fire, the theme rises
 * letter by letter, and a flame comes to rest on each of them (Acts 2:3).
 * Then the scriptures, dates and sign-up link settle in.
 *
 * On the home page it is scrubbed by the scroll; with `hero` (the Youth Week page) the
 * same sequence simply plays on load and the button jumps to the sign-up form.
 */
export default function YouthWeekScene({ hero = false }: { hero?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q('.ys-rise'), { yPercent: 115 });
      gsap.set(q('.ys-flame'), { opacity: 0, scale: 0.2, transformOrigin: '50% 100%' });

      const tl = gsap.timeline(
        hero
          ? { defaults: { ease: 'none' }, delay: 0.2 }
          : {
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: root.current, start: 'top top', end: '+=170%', scrub: 1, pin: true, anticipatePin: 1 },
            },
      );
      tl.fromTo(q('.ys-plate'), { scale: 1.14, opacity: 0.15 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
        .fromTo(q('.ys-title .char'), { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, 0.1)
        .to(q('.ys-flame'), { opacity: 1, scale: 1, duration: 0.35, stagger: 0.1, ease: 'back.out(2)' }, 1.15)
        .to(q('.ys-rise'), { yPercent: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out' }, 1.3)
        .fromTo(q('.ys-cta'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 1.6)
        .to({}, { duration: 0.5 });
    },
    { scope: root, dependencies: [hero] },
  );

  const Title = hero ? 'h1' : 'h2';
  const cta = 'ys-cta eyebrow mt-6 inline-block rounded-full bg-ivory px-8 py-4 text-ink transition-colors hover:bg-fs-gold';

  return (
    <section id={hero ? undefined : 'youth-week'} ref={root} className="relative h-svh w-full overflow-hidden bg-ink text-ivory" aria-label={`Youth Week ${youthWeek.year}: ${youthWeek.theme}`}>
      {/* the sent ones walking into the fire; each plate covers the stage and stays anchored to the ground */}
      {PLATES.map((p) => (
        <div
          key={p.key}
          className={`ys-plate pointer-events-none absolute bottom-0 left-1/2 origin-bottom ${p.show}`}
          style={{ width: `max(100vw, calc(100svh * ${p.ratio}))`, aspectRatio: p.ratio, marginLeft: `calc(max(100vw, 100svh * ${p.ratio}) / -2)`, marginBottom: p.key === 'wide' ? '-9svh' : 0 }}
          aria-hidden
        >
          <Image src={p.src} alt="" fill sizes="100vw" quality={90} priority={hero} className="object-cover" />
          {p.flames.map((f, i) => (
            <span key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${f.x}%`, top: `${f.y}%`, width: p.flame }}>
              <svg className="ys-flame flame block w-full overflow-visible" viewBox="0 0 20 34">
                <defs>
                  <linearGradient id={`ys-fl-${p.key}-${i}`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0" stopColor="#fff3b0" />
                    <stop offset="0.45" stopColor="#ffc233" />
                    <stop offset="1" stopColor="#ff5a0a" />
                  </linearGradient>
                </defs>
                <path d="M10 0C15 9 20 15 20 23a10 10 0 0 1-20 0C0 16 6 13 10 0Z" fill={`url(#ys-fl-${p.key}-${i})`} />
              </svg>
            </span>
          ))}
        </div>
      ))}
      {/* shade so the title and the closing lines stay readable over the fire */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-transparent" aria-hidden />
      {/* the ground dissolves into the page colour, so the scene runs into whatever follows without a seam */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[48svh]"
        style={{ background: 'linear-gradient(to top, var(--ink) 0%, var(--ink) 4%, rgba(13,12,10,0.82) 22%, rgba(13,12,10,0.4) 55%, transparent 100%)' }}
        aria-hidden
      />

      {/* embers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="ember absolute bottom-[-2%] rounded-full bg-[#ffc94a]"
            style={{ left: e.left, width: e.size, height: e.size, animationDuration: e.duration, animationDelay: e.delay, ['--drift' as string]: e.drift }}
          />
        ))}
      </div>

      {/* type */}
      <div className="relative z-10 flex h-full flex-col items-center px-5 pb-[10svh] pt-[17svh] text-center md:px-10 md:pt-[11svh]">
        <span className="line-mask"><span className="ys-rise eyebrow text-fs-gold">Youth Week {youthWeek.year} · Nationwide</span></span>
        <Title className="ys-title mt-4 -rotate-3 whitespace-nowrap text-[22.5vw] uppercase leading-[0.9] text-ivory drop-shadow-[0_10px_40px_rgba(60,8,2,0.55)] md:text-[17vw]" style={{ fontFamily: 'var(--font-anton), Impact, sans-serif' }}>
          <Chars text={youthWeek.theme} />
        </Title>
        <span className="line-mask mt-4 -rotate-3">
          <span className="ys-rise eyebrow text-[0.7rem] text-ivory md:text-base">{youthWeek.scriptures.map((s) => s.ref).join(', ')}</span>
        </span>

        <div className="mt-auto flex flex-col items-center">
          <span className="line-mask">
            <span className="ys-rise serif text-3xl italic text-ivory md:text-4xl">“{youthWeek.scriptures[0].text}”</span>
          </span>
          <span className="line-mask mt-2">
            <span className="ys-rise text-2xl uppercase tracking-wide text-ivory md:text-3xl" style={{ fontFamily: 'var(--font-anton), Impact, sans-serif' }}>
              {youthWeek.dates}
            </span>
          </span>
          {hero ? (
            <a href="#signup" className={cta}>Register</a>
          ) : (
            <Link href="/youth-week-2027" className={cta}>Register</Link>
          )}
        </div>
      </div>
    </section>
  );
}
