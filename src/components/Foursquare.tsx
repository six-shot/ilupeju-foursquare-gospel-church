'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { denomination } from '@/content/church';
import { Emblem, EMBLEM_COLORS, EMBLEM_ORDER, type EmblemPart } from './Emblem';

// Title colours follow each symbol's official colour (purple lifted for contrast on ink).
const TITLE_COLOR = { ...EMBLEM_COLORS, crown: '#c77fae' };

// Where each tile flies in from (px offsets in the emblem's own 938-unit space).
const FROM: Record<(typeof EMBLEM_ORDER)[number], { x: number; y: number; r: number }> = {
  cross: { x: -1500, y: -700, r: -35 },
  cup: { x: 1500, y: -700, r: 30 },
  dove: { x: -1500, y: 800, r: 25 },
  crown: { x: 1500, y: 800, r: -30 },
};

/**
 * The four-fold Gospel, told with the real Foursquare emblem. Its four symbols —
 * cross, cup, dove, crown — fly in one at a time and lock into place; as each lands,
 * its meaning is named (Saviour, Healer, Baptizer, Coming King).
 */
export default function Foursquare() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      EMBLEM_ORDER.forEach((part) => {
        const f = FROM[part];
        gsap.set(q(`.emblem-${part}`), { x: f.x, y: f.y, rotate: f.r, scale: 1.25, opacity: 0 });
      });
      gsap.set(q('.fs-word .line-inner'), { yPercent: 115 });
      gsap.set(q('.fs-line'), { opacity: 0, y: 14 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=320%', scrub: 1, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(q('.fs-intro .line-inner'), { yPercent: 115 }, { yPercent: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, 0);

      denomination.foursquare.forEach((item, i) => {
        const at = 0.4 + i * 0.75;
        tl.to(q(`.emblem-${item.symbol}`), { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power3.inOut' }, at)
          // once it lands, the symbol lights up white (as in the official colour emblem)
          .to(q(`.emblem-panel-${item.symbol}`), { fill: '#ffffff', duration: 0.35, ease: 'power2.out' }, at + 0.62)
          .to(q(`.fs-word-${item.symbol} .line-inner`), { yPercent: 0, duration: 0.4, ease: 'power3.out' }, at + 0.45)
          .to(q(`.fs-line-${item.symbol}`), { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, at + 0.55);
      });

      tl.to(q('.fs-mark'), { scale: 0.6, yPercent: -6, duration: 0.6, ease: 'power2.inOut' }, 3.5)
        .to(q('.fs-intro'), { opacity: 0, y: -30, duration: 0.3 }, 3.5)
        .fromTo(q('.fs-outro .line-inner'), { yPercent: 115 }, { yPercent: 0, duration: 0.4, stagger: 0.07, ease: 'power3.out' }, 3.7)
        .to({}, { duration: 0.4 });
    },
    { scope: root },
  );

  // Corner placement follows the emblem layout: cross TL, cup TR, dove BL, crown BR.
  const corner: Record<string, string> = {
    cross: 'left-4 top-[22svh] md:left-12 md:top-[24svh]',
    cup: 'right-4 top-[22svh] text-right md:right-12 md:top-[24svh]',
    dove: 'left-4 bottom-[13svh] md:left-12 md:bottom-[18svh]',
    crown: 'right-4 bottom-[13svh] text-right md:right-12 md:bottom-[18svh]',
  };

  return (
    <section ref={root} className="relative h-svh w-full overflow-hidden bg-ink" aria-label="The Foursquare Gospel">
      <div className="fs-intro absolute inset-x-0 top-[9svh] px-6 text-center">
        <span className="line-mask"><span className="line-inner eyebrow text-fs-gold">What we believe</span></span>
        <span className="line-mask"><span className="line-inner serif mt-3 text-4xl italic text-ivory md:text-6xl">Jesus Christ is…</span></span>
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <Emblem className="fs-mark w-[46vw] max-w-[380px] md:w-[24vw]" colored symbolColor="#0d0c0a" />
      </div>

      {denomination.foursquare.map((f) => (
        <div key={f.key} className={`absolute w-[42vw] md:w-[26vw] ${corner[f.symbol]}`}>
          <div className={`fs-word fs-word-${f.symbol}`}>
            <span className="line-mask">
              <span className="line-inner display text-[8.2vw] md:text-[5.6vw]" style={{ color: TITLE_COLOR[f.symbol as EmblemPart] }}>{f.title}</span>
            </span>
          </div>
          <p className={`fs-line fs-line-${f.symbol} mt-2 text-sm text-ivory/65 md:text-base`}>{f.line}</p>
        </div>
      ))}

      <div className="fs-outro absolute inset-x-0 bottom-[5svh] px-6 text-center">
        <span className="line-mask"><span className="line-inner serif text-2xl italic text-fs-gold md:text-4xl">The same yesterday, today and forever.</span></span>
        <span className="line-mask"><span className="line-inner eyebrow mt-2 text-muted">Hebrews 13:8</span></span>
      </div>
    </section>
  );
}
