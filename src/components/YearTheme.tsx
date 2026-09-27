'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Chars, Frame, MaskLine } from './ui';
import { church } from '@/content/church';

/**
 * Our theme for the year — "Divine Honour and Dignity". Pinned: "Divine" and "Honour"
 * sweep in from opposite sides, the gold "and" turns into place, "Dignity" rises letter
 * by letter, and the closing line lands, over a faint film of the pulpit.
 */
export default function YearTheme() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q('.yt-char'), { yPercent: 120 });
      gsap.set(q('.yt-top .line-inner, .yt-close .line-inner'), { yPercent: 115 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=170%', scrub: 0.8, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(q('.yt-bg'), { scale: 1.25 }, { scale: 1, duration: 2.2 }, 0)
        .fromTo(q('.yt-year'), { yPercent: 20 }, { yPercent: -20, duration: 2.2 }, 0)
        .to(q('.yt-top .line-inner'), { yPercent: 0, duration: 0.35, stagger: 0.08, ease: 'power3.out' }, 0)
        .fromTo(q('.yt-divine'), { xPercent: -70, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.15)
        .fromTo(q('.yt-honour'), { xPercent: 70, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.3)
        .fromTo(q('.yt-and'), { scale: 0, rotate: -35, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' }, 0.65)
        .to(q('.yt-char'), { yPercent: 0, duration: 0.5, stagger: { each: 0.05, from: 'center' }, ease: 'power3.out' }, 0.8)
        .to(q('.yt-close .line-inner'), { yPercent: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, 1.35)
        .to({}, { duration: 0.5 });
    },
    { scope: root },
  );

  return (
    <section id="theme" ref={root} className="relative h-svh w-full overflow-hidden bg-ink text-ivory" aria-label="Our theme for the year">
      <div className="yt-bg absolute inset-0 opacity-25">
        <Frame img="sermon" alt="" className="absolute inset-0" position="50% 40%" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(246,184,38,0.14),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
      <span
        className="yt-year display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[46vw] leading-none text-transparent md:text-[34vw]"
        style={{ WebkitTextStroke: '1px rgba(243,237,227,0.08)' }}
        aria-hidden
      >
        2026
      </span>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="yt-top">
          <MaskLine innerClass="eyebrow text-fs-gold">Our theme for 2026</MaskLine>
          <MaskLine innerClass="serif mt-3 text-[7vw] italic text-ivory/85 md:text-[2.6vw]">Our year of</MaskLine>
        </div>
        <h2 className="mt-4 md:mt-6" aria-label={church.yearTheme.value}>
          <span className="yt-divine display block text-[17vw] leading-[0.86] md:text-[10vw]">Divine</span>
          <span className="yt-honour display block text-[17vw] leading-[0.86] md:text-[10vw]">Honour</span>
          <span className="yt-and serif my-1 inline-block text-[11vw] italic leading-none text-fs-gold md:text-[5vw]">and</span>
          <span className="display block text-[17vw] leading-[0.86] text-fs-gold md:text-[10vw]">
            <Chars text="Dignity" charClass="yt-char" />
          </span>
        </h2>
        <div className="yt-close mt-8 max-w-xl text-ivory/70">
          <MaskLine innerClass="serif text-xl italic md:text-2xl">Crowned with His honour,</MaskLine>
          <MaskLine innerClass="serif text-xl italic md:text-2xl">walking together in dignity.</MaskLine>
        </div>
      </div>
    </section>
  );
}
