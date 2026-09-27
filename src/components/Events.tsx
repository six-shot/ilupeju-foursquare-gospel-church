'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Frame } from './ui';
import { events as allEvents } from '@/content/church';

const events = allEvents.filter((e) => e.verified);

/**
 * Events — one pinned stage. Each event arrives as a new image wiping up over the
 * last (clip-path), while its huge date slides in from the side and the details
 * rise from their masks. The previous event's type scatters away as the next one lands.
 */
export default function Events() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const slides = q('.ev-slide');
      slides.forEach((s: Element, i: number) => {
        if (i === 0) return;
        gsap.set(s.querySelector('.ev-img'), { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(s.querySelectorAll('.line-inner'), { yPercent: 115 });
        gsap.set(s.querySelector('.ev-date'), { xPercent: 40, opacity: 0 });
      });
      gsap.set(q('.ev-slide')[0].querySelectorAll('.line-inner'), { yPercent: 115 });
      gsap.set(q('.ev-slide')[0].querySelector('.ev-date'), { xPercent: 40, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: `+=${slides.length * 110}%`, scrub: 1, pin: true, anticipatePin: 1 },
      });

      // first event
      tl.fromTo(slides[0].querySelector('.ev-img'), { clipPath: 'inset(22% 22% 22% 22% round 16px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.8, ease: 'power2.inOut',
      }, 0)
        .fromTo(slides[0].querySelectorAll('.ev-img img, .ev-img video'), { scale: 1.35 }, { scale: 1.05, duration: 0.8, ease: 'power2.inOut' }, 0)
        .to(slides[0].querySelector('.ev-date'), { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.35)
        .to(slides[0].querySelectorAll('.line-inner'), { yPercent: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' }, 0.45);

      slides.forEach((s: Element, i: number) => {
        if (i === 0) return;
        const prev = slides[i - 1];
        const at = 1.3 + (i - 1) * 1.3;
        tl.to(prev.querySelectorAll('.line-inner'), { yPercent: -115, duration: 0.35, stagger: 0.03, ease: 'power2.in' }, at)
          .to(prev.querySelector('.ev-date'), { xPercent: -40, opacity: 0, duration: 0.45, ease: 'power2.in' }, at)
          .to(prev.querySelectorAll('.ev-img img, .ev-img video'), { scale: 1.2, yPercent: -8, duration: 0.8 }, at)
          .to(s.querySelector('.ev-img'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power3.inOut' }, at + 0.1)
          .fromTo(s.querySelectorAll('.ev-img img, .ev-img video'), { scale: 1.3, yPercent: 8 }, { scale: 1.05, yPercent: 0, duration: 0.9, ease: 'power2.out' }, at + 0.1)
          .to(s.querySelector('.ev-date'), { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, at + 0.45)
          .to(s.querySelectorAll('.line-inner'), { yPercent: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' }, at + 0.55);
      });
      tl.to({}, { duration: 0.4 });
    },
    { scope: root },
  );

  return (
    <section id="events" ref={root} className="relative h-svh w-full overflow-hidden bg-ink" aria-label="Events">
      <div className="absolute left-5 top-24 z-40 md:left-10 md:top-28">
        <span className="eyebrow text-ivory/70">Events</span>
      </div>
      {events.map((ev, i) => (
        <div key={ev.title} className="ev-slide absolute inset-0" style={{ zIndex: 10 + i }}>
          <div className="ev-img absolute inset-0">
            <Frame img={ev.image} alt={ev.title} className="absolute inset-0" position="50% 30%" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/40" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-[9svh] md:px-10">
            <div className="ev-date display pointer-events-none absolute right-4 top-[14svh] text-right text-[14vw] leading-[0.85] text-ivory/90 md:right-10 md:text-[9vw]">
              {ev.dateMain}
              <div className="serif text-[6vw] italic normal-case tracking-normal text-fs-gold md:text-[3.2vw]">{ev.dateSub}</div>
            </div>
            <span className="line-mask mb-3">
              <span className={`line-inner eyebrow inline-block rounded-full px-3 py-1.5 text-[0.62rem] ${ev.status === 'Upcoming' ? 'bg-fs-gold text-ink' : 'border border-ivory/40 text-ivory/80'}`}>
                {ev.status}
              </span>
            </span>
            <span className="line-mask"><span className="line-inner eyebrow text-fs-gold">{ev.kicker}</span></span>
            <h3 className="mt-3">
              <span className="line-mask"><span className="line-inner display text-[13vw] text-ivory md:text-[7.5vw]">{ev.title}</span></span>
            </h3>
            <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:gap-10">
              <span className="line-mask"><span className="line-inner serif text-3xl italic text-ivory md:text-5xl">“{ev.theme}”</span></span>
              <span className="line-mask md:max-w-md"><span className="line-inner text-ivory/70">{ev.detail}</span></span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
