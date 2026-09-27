'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Chars, Frame, MaskLine } from './ui';
import { church } from '@/content/church';

/**
 * Cinematic opening, pinned for ~1.3 screens. Only transforms and opacity are animated
 * (no blur / clip-path on large layers) so it stays smooth on every device.
 *  - intro (after the loader): the photo settles from a slight push-in, letters rise into place
 *  - scroll: the photo eases back while each letter drifts up at its own pace and fades,
 *    and the title shade lifts — ending on the clear, full-screen photo, which is exactly
 *    where the Story section begins.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q('.h-char'), { yPercent: 115 });
      gsap.set(q('.h-sub .line-inner, .h-meta .line-inner'), { yPercent: 110 });

      const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      intro
        .fromTo(q('.h-bg'), { scale: 1.18 }, { scale: 1.08, duration: 2.8 }, 0)
        .to(q('.h-char'), { yPercent: 0, duration: 1.5, stagger: { each: 0.05, from: 'center' } }, 0.15)
        .to(q('.h-sub .line-inner'), { yPercent: 0, duration: 1.3 }, 0.45)
        .to(q('.h-meta .line-inner'), { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.8)
        .from(q('.h-scroll'), { opacity: 0, y: 20, duration: 1 }, 1.1);

      const play = () => intro.play();
      window.addEventListener('loader:done', play, { once: true });
      const fallback = window.setTimeout(play, 4500); // e.g. after a hot reload

      const chars = q('.h-char');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=130%', scrub: 0.8, pin: true, anticipatePin: 1 },
      });
      tl.to(q('.h-bg'), { scale: 1, duration: 1 }, 0)
        .to(chars, {
          yPercent: (i: number) => -120 - ((i * 37) % 5) * 28, // each letter at its own speed
          opacity: 0,
          duration: 0.6,
          stagger: { each: 0.035, from: 'edges' },
          ease: 'power1.in',
        }, 0)
        .to(q('.h-sub'), { y: -70, opacity: 0, duration: 0.45 }, 0)
        .to(q('.h-meta, .h-scroll'), { opacity: 0, duration: 0.25 }, 0)
        .to(q('.h-title-shade'), { opacity: 0, duration: 0.7 }, 0.1)
        .to(q('.h-flat-shade'), { opacity: 1, duration: 0.7 }, 0.1);

      return () => {
        window.clearTimeout(fallback);
        window.removeEventListener('loader:done', play);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-svh w-full overflow-hidden bg-ink" aria-label="Welcome">
      <div className="h-bg absolute inset-0 will-change-transform">
        <Frame
          img="heroBackground"
          alt="The choir beneath the cross and the congregation celebrating at Ilupeju Foursquare Gospel Church"
          className="absolute inset-0"
          position="50% 40%"
          priority
        />
      </div>
      {/* Legibility shade under the title; hands over to the flat shade the Story section starts with */}
      <div className="h-title-shade pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/45 via-transparent to-ink/85" />
      <div className="h-flat-shade pointer-events-none absolute inset-0 bg-ink/35 opacity-0" />

      {/* Title — set low, like a film title */}
      <div className="absolute inset-x-0 bottom-[15svh] z-10 px-4 md:bottom-[11svh]">
        <div className="h-sub text-center">
          <MaskLine innerClass="serif text-[8vw] italic leading-none text-ivory md:text-[4.4vw]">
            Foursquare Gospel Church
          </MaskLine>
        </div>
        <h1 className="display mt-2 text-center text-[21.5vw] text-ivory md:text-[18.5vw]">
          <Chars text="Ilupeju" charClass="h-char" />
        </h1>
      </div>

      {/* Meta */}
      <div className="h-meta absolute inset-x-0 bottom-5 z-10 flex items-end justify-between px-5 text-ivory/80 md:px-10">
        <div className="max-w-[40%]">
          <MaskLine innerClass="eyebrow">{church.denomination.value}</MaskLine>
        </div>
        <div className="max-w-[40%] text-right">
          <MaskLine innerClass="eyebrow">{church.address.value.replace(', Nigeria', '')}</MaskLine>
        </div>
      </div>

      <div className="h-scroll absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 md:right-10 md:flex">
        <span className="eyebrow text-[0.62rem] text-ivory/70 [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-ivory/20">
          <span className="absolute inset-x-0 top-0 block h-1/2 animate-[scrollcue_1.8s_cubic-bezier(.76,0,.24,1)_infinite] bg-ivory" />
        </span>
      </div>
    </section>
  );
}
