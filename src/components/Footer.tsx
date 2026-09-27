'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Chars } from './ui';
import { Emblem } from './Emblem';
import { church, nav } from '@/content/church';

/**
 * The closing scene. As it scrolls into view the giant name rises letter by letter
 * from below the fold, the columns settle in, and the Foursquare mark turns into place.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'bottom bottom', scrub: 1 },
      });
      tl.fromTo(q('.ft-big .char'), { yPercent: 105 }, { yPercent: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' }, 0.2)
        .fromTo(q('.ft-col'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 0)
        .fromTo(q('.ft-mark'), { rotate: -90, scale: 0.4 }, { rotate: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, 0);
    },
    { scope: root },
  );

  const year = new Date().getFullYear();
  return (
    <footer ref={root} className="relative overflow-hidden bg-ink px-5 pt-24 text-ivory md:px-10 md:pt-32">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
        <div className="ft-col">
          <Emblem className="ft-mark h-16 w-16" colored />
          <p className="serif mt-6 max-w-sm text-3xl italic leading-tight">{church.theme.value}.</p>
        </div>
        <div className="ft-col text-sm">
          <h4 className="eyebrow mb-4 text-muted">Visit</h4>
          <p className="text-ivory/80">{church.address.value}</p>
          <a href={church.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block underline decoration-fs-gold underline-offset-4">Directions</a>
        </div>
        <div className="ft-col text-sm">
          <h4 className="eyebrow mb-4 text-muted">Contact</h4>
          <a className="block text-ivory/80 hover:text-ivory" href={`tel:${church.phone.value.replace(/\s/g, '')}`}>{church.phone.value}</a>
          <a className="mt-1 block break-all text-ivory/80 hover:text-ivory" href={`mailto:${church.email.value}`}>{church.email.value}</a>
          <div className="mt-4 flex gap-4">
            {church.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="underline decoration-fs-gold underline-offset-4">{s.label}</a>
            ))}
          </div>
        </div>
        <div className="ft-col text-sm">
          <h4 className="eyebrow mb-4 text-muted">Explore</h4>
          <ul className="grid grid-cols-2 gap-y-1 md:grid-cols-1">
            {nav.map((n) => (
              <li key={n.href}><a href={n.href} className="text-ivory/80 hover:text-ivory">{n.label}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ft-big display mt-16 select-none overflow-hidden text-[23.5vw] leading-[0.78] text-ivory md:mt-24" aria-hidden>
        <Chars text="Ilupeju" />
      </div>

      <div className="flex flex-col gap-4 border-t border-ivory/15 py-6 text-xs text-ivory/50 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/brand/foursquare-nigeria-logo-white.png" alt="The Foursquare Gospel Church in Nigeria" width={150} height={36} className="h-7 w-auto opacity-80" />
        </div>
        <span>© {year} {church.name.value}. Part of {church.denomination.value}.</span>
      </div>
    </footer>
  );
}
