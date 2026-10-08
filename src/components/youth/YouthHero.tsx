'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Emblem } from '../Emblem';
import YouthWeekScene from './YouthWeekScene';
import { church } from '@/content/church';
import { expect, youthWeek } from '@/content/youthWeek';

/**
 * Youth Week page: the "Sent Ones" scene plays on load, then the theme scriptures and
 * "what to expect", a stack of poster-sized words that catch fire one at a time as
 * they pass the middle of the screen.
 */
export default function YouthHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      q('.yh-row').forEach((row: Element) => {
        ScrollTrigger.create({ trigger: row, start: 'top 68%', end: 'bottom 34%', toggleClass: 'is-lit' });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label={`${church.name.value} — home`}>
          <Emblem className="h-8 w-8" colored />
          <span className="eyebrow text-[0.62rem] leading-[1.35] text-ivory md:text-[0.66rem]">
            Ilupeju Foursquare<br />Gospel Church
          </span>
        </Link>
        <a href="#signup" className="eyebrow rounded-full bg-fs-gold px-4 py-2.5 text-[0.62rem] text-ink transition-colors hover:bg-ivory">
          Register
        </a>
      </header>

      <YouthWeekScene hero />

      <section className="relative w-full bg-ink px-5 pb-[14svh] pt-[8svh] md:px-10" aria-label="About Youth Week">
        {/* an afterglow of the fire above; it is fully faded at every edge, so there is no line where the scene ends */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[80svh]"
          style={{ background: 'radial-gradient(closest-side, rgba(240,96,12,0.16), rgba(150,22,8,0.07) 55%, transparent 100%)' }}
          aria-hidden
        />
        <p className="serif relative mx-auto max-w-6xl text-3xl leading-[1.15] text-ivory md:text-5xl">{youthWeek.intro}</p>
        <div className="relative mx-auto mt-14 grid max-w-6xl gap-10 border-t border-ivory/15 pt-12 md:grid-cols-2 md:gap-16">
          {youthWeek.scriptures.map((s) => (
            <figure key={s.ref}>
              <blockquote className="serif text-4xl italic leading-[1.05] text-ivory md:text-6xl">“{s.text}”</blockquote>
              <figcaption className="eyebrow mt-5 text-fs-gold">{s.ref}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="w-full bg-ink px-5 pb-[12svh] text-ivory md:px-10" aria-label="What to expect">
        <div className="mx-auto max-w-6xl">
          <h2 className="eyebrow text-fs-gold">What to expect</h2>
          <ul className="mt-7">
            {expect.map((e) => (
              <li key={e.title} className="yh-row grid items-end gap-x-10 gap-y-2 border-t border-ivory/10 py-5 md:grid-cols-[1fr_21rem] md:py-3">
                <span className="yh-word text-[14vw] uppercase leading-[0.95] md:text-[8.5vw]" style={{ fontFamily: 'var(--font-anton), Impact, sans-serif' }}>{e.title}</span>
                <span className="yh-line max-w-sm text-ivory/85 md:pb-[1.1vw] md:text-lg">{e.line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-ivory/10 pt-6 text-sm text-ivory/45">The full day-by-day programme will be published here once it is confirmed.</p>
        </div>
      </section>
    </div>
  );
}
