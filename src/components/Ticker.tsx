'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { EMBLEM_COLORS, EMBLEM_ORDER } from './Emblem';
import { church, events, services } from '@/content/church';

// Year theme, the weekly services, where we are, and what's coming up.
const ITEMS = [
  `Our year of ${church.yearTheme.value}`,
  ...services.map((s) => `${s.day} · ${s.name.replace(' — ', ': ')} · ${s.time}`),
  church.address.value.replace(', Nigeria', ''),
  ...events.filter((e) => e.verified).slice(0, 1).map((e) => `${e.title} · ${e.date}`),
];

/** Programme ticker fixed to the bottom of the screen; slides in once the loader lifts. */
export default function Ticker() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(root.current, { yPercent: 100 });
      const show = () => gsap.to(root.current, { yPercent: 0, duration: 1.1, ease: 'expo.out', delay: 1 });
      window.addEventListener('loader:done', show, { once: true });
      const fallback = window.setTimeout(show, 5000);
      return () => {
        window.clearTimeout(fallback);
        window.removeEventListener('loader:done', show);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t border-ivory/15 bg-ink/55 py-3 backdrop-blur-md">
      <div className="marquee-track flex w-max animate-[marquee_70s_linear_infinite]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {ITEMS.map((t, i) => (
              <span key={t} className="eyebrow flex items-center whitespace-nowrap text-[0.62rem] text-ivory/85 md:text-[0.68rem]">
                <span className="px-6">{t}</span>
                <span className="inline-block h-2 w-2" style={{ background: EMBLEM_COLORS[EMBLEM_ORDER[i % 4]] }} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
