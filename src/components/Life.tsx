'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Frame } from './ui';
import { life } from '@/content/church';

/**
 * Church life — a horizontal gallery driven by vertical scroll. The track slides
 * sideways while each photograph drifts inside its frame; titles are revealed by a
 * mask as their panel reaches the centre, and panels overlap slightly for depth.
 */
export default function Life() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const distance = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0);
      // The pin lasts a little longer than the slide, so the last card comes to rest
      // on screen before the next section arrives.
      const hold = () => window.innerHeight * 0.45;
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${distance() + hold()}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      const slide = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      q('.lf-panel').forEach((panel: Element) => {
        const img = panel.querySelectorAll('img, video');
        gsap.fromTo(img, { xPercent: -12, scale: 1.18 }, {
          xPercent: 12, scale: 1.02, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
        });
        gsap.fromTo(panel.querySelector('.lf-frame'), { clipPath: 'inset(12% 0% 12% 0% round 14px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 14px)', ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left right', end: 'center center', scrub: true },
        });
        gsap.fromTo(panel.querySelectorAll('.lf-title .line-inner, .lf-line .line-inner'), { yPercent: 115 }, {
          yPercent: 0, stagger: 0.08, ease: 'power3.out', duration: 1,
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left 65%', toggleActions: 'play none none reverse' },
        });
        gsap.fromTo(panel.querySelector('.lf-num'), { xPercent: 60, opacity: 0 }, {
          xPercent: -40, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
        });
      });

      gsap.fromTo(q('.lf-intro .line-inner'), { yPercent: 115 }, {
        yPercent: 0, stagger: 0.1, ease: 'power3.out', duration: 1.2,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
    },
    { scope: root },
  );

  return (
    <section id="life" ref={root} className="relative h-svh w-full overflow-hidden bg-ink" aria-label="Church life">
      <div ref={track} className="flex h-full w-max items-center gap-[4vw] pl-[6vw] pr-[10vw] will-change-transform">
        <div className="lf-intro w-[80vw] shrink-0 md:w-[34vw]">
          <span className="line-mask"><span className="line-inner eyebrow text-fs-gold">Church life</span></span>
          <h2 className="mt-4">
            <span className="line-mask"><span className="line-inner display text-[16vw] text-ivory md:text-[8.5vw]">Life</span></span>
            <span className="line-mask"><span className="line-inner serif text-[12vw] italic text-ivory/90 md:text-[6vw]">together</span></span>
          </h2>
          <p className="mt-6 max-w-sm text-ivory/60">
            Moments from our gatherings — worship, prayer, the Word and the joy of the family of God.
          </p>
          <span className="eyebrow mt-10 inline-flex items-center gap-3 text-ivory/50">
            Keep scrolling <span className="inline-block h-px w-12 bg-ivory/40" />
          </span>
        </div>

        {life.map((item, i) => (
          <article
            key={item.title}
            className={`lf-panel relative shrink-0 ${i % 2 ? 'mt-[14vh] h-[58vh] w-[72vw] md:w-[36vw]' : '-mt-[10vh] h-[66vh] w-[78vw] md:w-[42vw]'} ${i > 0 ? '-ml-[2vw]' : ''}`}
          >
            <div className="lf-frame absolute inset-0 overflow-hidden rounded-[14px]">
              <Frame img={item.image} alt={item.title} className="absolute inset-0" sizes="(min-width: 768px) 42vw, 80vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            </div>
            <span className="lf-num display pointer-events-none absolute -top-[0.45em] right-2 text-[18vw] text-ivory/10 md:text-[9vw]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-8">
              <h3 className="lf-title">
                <span className="line-mask"><span className="line-inner display text-[9.5vw] leading-[0.92] text-ivory md:text-[4.6vw]">{item.title}</span></span>
              </h3>
              <p className="lf-line mt-1">
                <span className="line-mask"><span className="line-inner serif text-xl italic text-ivory/85 md:text-2xl">{item.line}</span></span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
