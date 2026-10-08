'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Frame } from './ui';
import { church, heroFacts } from '@/content/church';

/**
 * Opening screen: the film full-bleed, one headline, two actions and the three facts a
 * first-time visitor needs (when, midweek, where).
 *  - intro (after the loader): the film settles and the content fades up in order
 *  - scroll: the film drifts and the content fades as the hero leaves the screen
 * The intro animates the `.h-in` items and the scroll animates their wrappers, so the two
 * never touch the same element.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q('.h-in'), { opacity: 0, y: 18 });

      const intro = gsap.timeline({ paused: true });
      intro
        .fromTo(q('.h-bg'), { scale: 1.08 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
        .to(q('.h-in'), { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.1);

      const play = () => intro.play();
      window.addEventListener('loader:done', play, { once: true });
      const fallback = window.setTimeout(play, 4500); // e.g. after a hot reload

      const scrollTrigger = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(q('.h-film'), { yPercent: 12, ease: 'none', scrollTrigger });
      gsap.to(q('.h-content'), { opacity: 0, y: -40, ease: 'none', scrollTrigger });

      return () => {
        window.clearTimeout(fallback);
        window.removeEventListener('loader:done', play);
      };
    },
    { scope: root },
  );

  const yearLine = `2026 · Our year of ${church.yearTheme.value}`;

  return (
    <section ref={root} className="relative flex h-svh min-h-[640px] w-full flex-col overflow-hidden bg-ink text-ivory" aria-label="Welcome">
      <div className="h-film absolute inset-0 will-change-transform">
        <div className="h-bg absolute inset-0 will-change-transform">
          <Frame
            img="heroBackground"
            alt="The choir beneath the cross and the congregation celebrating at Ilupeju Foursquare Gospel Church"
            className="absolute inset-0"
            position="50% 40%"
            priority
          />
        </div>
      </div>
      {/* Legibility: a soft cap under the nav and a deeper foot for the headline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      <div className="h-content relative z-10 mt-auto px-5 pb-6 md:px-10 md:pb-10">
        <p className="h-in mb-4 text-sm text-ivory/75 md:mb-5 md:text-base">{yearLine}</p>
        <h1 className="h-in font-display max-w-[12ch] text-[clamp(2.75rem,7.2vw,6.75rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
          There&rsquo;s a seat saved for you.
        </h1>
        <p className="h-in mt-5 max-w-md text-base leading-relaxed text-ivory/80 md:text-lg">
          Whoever you are and wherever you&rsquo;re coming from, come and grow with {church.theme.value.toLowerCase()}.
        </p>
        <div className="h-in mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a href="#visit" className="rounded-full bg-ivory px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white">
            Plan a visit
          </a>
          <a href="#services" className="text-sm font-medium underline decoration-ivory/40 underline-offset-[6px] transition-colors hover:decoration-ivory">
            See service times
          </a>
        </div>

        <dl className="h-in mt-9 grid gap-x-10 gap-y-4 border-t border-ivory/20 pt-5 sm:grid-cols-3 md:mt-14">
          {heroFacts.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-4 sm:block">
              <dt className="text-sm text-ivory/55">{f.label}</dt>
              <dd className="text-sm font-medium sm:mt-1 md:text-base">
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noreferrer" className="underline decoration-ivory/30 underline-offset-4 transition-colors hover:decoration-ivory">
                    {f.value}
                  </a>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
