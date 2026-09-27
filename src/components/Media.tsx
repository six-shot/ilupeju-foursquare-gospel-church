'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Frame } from './ui';
import { church, sermons } from '@/content/church';

/**
 * Sermons / media. A small featured frame sits beside the headline; scrolling grows it
 * into a full-screen cinema frame, then the message details and play control arrive.
 * No sermons could be verified, so until `sermons` in church.ts is filled in the
 * featured slot points to the church's (verified) Facebook page.
 */
export default function Media() {
  const root = useRef<HTMLElement>(null);
  const featured = sermons[0];
  const fb = church.socials.find((s) => s.label === 'Facebook')!;
  const href = featured?.href ?? fb.href;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
        const mobile = ctx.conditions?.mobile;
        gsap.set(q('.md-frame'), { clipPath: mobile ? 'inset(38% 18% 30% 18% round 16px)' : 'inset(34% 8% 30% 60% round 16px)' });
        gsap.set(q('.md-detail .line-inner'), { yPercent: 115 });
        gsap.set(q('.md-play'), { scale: 0, rotate: -90 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=220%', scrub: 1, pin: true, anticipatePin: 1 },
        });
        tl.fromTo(q('.md-head .line-inner'), { yPercent: 115 }, { yPercent: 0, duration: 0.35, stagger: 0.08, ease: 'power3.out' }, 0)
          .fromTo(q('.md-frame img, .md-frame video'), { scale: 1.4 }, { scale: 1.05, duration: 1.2, ease: 'power2.inOut' }, 0.35)
          .to(q('.md-head'), { xPercent: -30, opacity: 0, filter: 'blur(6px)', duration: 0.6, ease: 'power2.in' }, 0.5)
          .to(q('.md-frame'), { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.9, ease: 'power2.inOut' }, 0.45)
          .to(q('.md-shade'), { opacity: 1, duration: 0.6 }, 0.9)
          .to(q('.md-play'), { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.4)' }, 1.25)
          .to(q('.md-detail .line-inner'), { yPercent: 0, duration: 0.4, stagger: 0.07, ease: 'power3.out' }, 1.3)
          .to({}, { duration: 0.4 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="media" ref={root} className="relative h-svh w-full overflow-hidden bg-ivory" aria-label="Sermons and media">
      <div className="md-head absolute left-5 top-[16svh] z-10 max-w-[90vw] text-ink md:left-10 md:top-[22svh] md:max-w-[50vw]">
        <span className="line-mask"><span className="line-inner eyebrow text-ink/60">Sermons &amp; media</span></span>
        <h2 className="mt-4">
          <span className="line-mask"><span className="line-inner display text-[15vw] md:text-[8vw]">The Word,</span></span>
          <span className="line-mask"><span className="line-inner serif text-[12vw] italic md:text-[6.4vw]">preached.</span></span>
        </h2>
      </div>

      <div className="md-frame absolute inset-0 z-20">
        <Frame img={featured?.image ?? 'sermon'} alt="Our pastor preaching at the pulpit" className="absolute inset-0" position="50% 40%" />
        <div className="md-shade absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10 opacity-0" />

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="md-play absolute left-1/2 top-[42%] grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory text-ink transition-transform duration-500 hover:scale-110 md:h-32 md:w-32"
          aria-label={featured ? `Play: ${featured.title}` : 'Watch our services on Facebook'}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4.5v15l13-7.5z" /></svg>
        </a>

        <div className="md-detail absolute inset-x-5 bottom-[8svh] text-ivory md:inset-x-10 md:flex md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="line-mask"><span className="line-inner eyebrow text-fs-gold">{featured ? 'Featured message' : 'Watch & listen'}</span></span>
            <h3 className="mt-3">
              <span className="line-mask">
                <span className="line-inner serif text-4xl italic md:text-7xl">
                  {featured ? featured.title : 'Services, moments & messages'}
                </span>
              </span>
            </h3>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:mt-0 md:text-right">
            {featured ? (
              <>
                <span className="line-mask"><span className="line-inner"><dt className="text-ivory/50">Speaker</dt><dd>{featured.speaker}</dd></span></span>
                <span className="line-mask"><span className="line-inner"><dt className="text-ivory/50">Date</dt><dd>{featured.date}</dd></span></span>
                {featured.scripture && (
                  <span className="line-mask col-span-2"><span className="line-inner"><dt className="text-ivory/50">Scripture</dt><dd>{featured.scripture}</dd></span></span>
                )}
              </>
            ) : (
              <span className="line-mask col-span-2">
                <span className="line-inner text-ivory/70">
                  Follow {church.shortName} on{' '}
                  <a href={fb.href} target="_blank" rel="noreferrer" className="underline decoration-fs-gold underline-offset-4">Facebook</a>
                </span>
              </span>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
