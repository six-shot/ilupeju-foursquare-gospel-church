'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Chars, Frame } from './ui';
import { church, services } from '@/content/church';

/**
 * Join us. "COME AS YOU ARE." fills the screen over a dim hall; scrolling pulls the
 * letters apart and pushes into the image, "LEAVE CHANGED." rises in its place,
 * and then the church's name and visiting details settle in.
 */
export default function Visit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q('.vs-b .char'), { yPercent: 120, rotate: 8, opacity: 0 });
      gsap.set(q('.vs-info .line-inner'), { yPercent: 115 });
      gsap.set(q('.vs-card'), { clipPath: 'inset(100% 0% 0% 0% round 18px)' });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=280%', scrub: 1.1, pin: true, anticipatePin: 1 },
      });
      const aChars = q('.vs-a .char');
      tl.fromTo(q('.vs-bg img'), { scale: 1.25 }, { scale: 1.05, duration: 2.6 }, 0)
        .fromTo(aChars, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.025, ease: 'power3.out' }, 0)
        .to(aChars, {
          xPercent: (i: number) => (i - aChars.length / 2) * 38,
          yPercent: (i: number) => (i % 2 ? -60 : 60),
          opacity: 0,
          filter: 'blur(10px)',
          duration: 0.6,
          stagger: { each: 0.01, from: 'center' },
          ease: 'power2.in',
        }, 0.8)
        .to(q('.vs-bg-shade'), { opacity: 0.35, duration: 0.6 }, 0.8)
        .to(q('.vs-b .char'), { yPercent: 0, rotate: 0, opacity: 1, duration: 0.55, stagger: 0.03, ease: 'power3.out' }, 1.6)
        .to(q('.vs-b'), { yPercent: -95, scale: 0.55, duration: 0.6, ease: 'power2.inOut' }, 2.35)
        .to(q('.vs-bg-shade'), { opacity: 0.8, duration: 0.5 }, 2.35)
        .to(q('.vs-card'), { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 0.55, ease: 'power3.inOut' }, 2.45)
        .to(q('.vs-info .line-inner'), { yPercent: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' }, 2.7)
        .to({}, { duration: 0.3 });
    },
    { scope: root },
  );

  return (
    <section id="visit" ref={root} className="relative h-svh w-full overflow-hidden bg-ink" aria-label="Visit us">
      <Frame img="visit" alt="Worship at Ilupeju Foursquare Gospel Church" className="vs-bg absolute inset-0" />
      <div className="vs-bg-shade absolute inset-0 bg-ink opacity-70" />

      <div className="vs-a display pointer-events-none absolute inset-0 grid place-items-center px-4 text-center text-[15vw] text-ivory md:text-[11.5vw]">
        <Chars text="Come as you are." />
      </div>
      <div className="vs-b pointer-events-none absolute inset-0 grid place-items-center px-4 text-center">
        <Chars text="Leave changed." className="serif text-[16vw] italic leading-none text-fs-gold md:text-[12vw]" />
      </div>

      <div className="vs-card absolute inset-x-4 bottom-[6svh] bg-ivory p-6 text-ink md:inset-x-auto md:bottom-[9svh] md:left-1/2 md:w-[min(920px,80vw)] md:-translate-x-1/2 md:p-10">
        <div className="vs-info grid gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
          <div>
            <span className="line-mask"><span className="line-inner eyebrow text-ink/50">Visit us</span></span>
            <h2 className="mt-3">
              <span className="line-mask"><span className="line-inner serif text-4xl leading-none md:text-6xl">Ilupeju Foursquare</span></span>
              <span className="line-mask"><span className="line-inner serif text-4xl italic leading-none md:text-6xl">Gospel Church</span></span>
            </h2>
            <span className="line-mask mt-4"><span className="line-inner text-ink/70">{church.address.value}</span></span>
          </div>
          <div className="flex flex-col justify-end gap-3 text-sm">
            <span className="line-mask">
              <span className="line-inner flex justify-between border-b border-ink/15 pb-2">
                <span>Sundays · First Service</span><span className="font-semibold">{services[0]?.time}</span>
              </span>
            </span>
            <span className="line-mask"><span className="line-inner text-ink/60"><a href="#services" className="underline decoration-fs-gold underline-offset-4">All service times</a></span></span>
            <span className="line-mask"><span className="line-inner"><a className="font-semibold underline decoration-fs-gold underline-offset-4" href={`tel:${church.phone.value.replace(/\s/g, '')}`}>{church.phone.value}</a></span></span>
            <span className="line-mask"><span className="line-inner"><a className="underline decoration-fs-gold underline-offset-4" href={`mailto:${church.email.value}`}>{church.email.value}</a></span></span>
            <span className="line-mask mt-2">
              <span className="line-inner">
                <a href={church.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-ivory transition-colors hover:bg-fs-purple">
                  Get directions <span aria-hidden>→</span>
                </a>
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
