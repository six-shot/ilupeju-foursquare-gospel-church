'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Frame, MaskLine } from './ui';
import { church, leadership } from '@/content/church';

/**
 * Our pastors. The heading rises first; then the two portraits glide in from opposite
 * sides of the screen and settle side by side (the photos easing back inside their
 * frames), their names rise from masks beneath them, and a closing line lands.
 */
export default function Pastors() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q('.ps-card');
      gsap.set(q('.ps-name .line-inner, .ps-close .line-inner'), { yPercent: 115 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=200%', scrub: 1, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(q('.ps-head .line-inner'), { yPercent: 115 }, { yPercent: 0, duration: 0.35, stagger: 0.08, ease: 'power3.out' }, 0);
      cards.forEach((card: Element, i: number) => {
        const dir = i % 2 ? 1 : -1;
        tl.fromTo(card, { xPercent: dir * 140, rotate: dir * 6, opacity: 0 }, {
          xPercent: 0, rotate: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        }, 0.25 + i * 0.12)
          .fromTo(card.querySelector('img, video'), { scale: 1.35 }, { scale: 1, duration: 1, ease: 'power2.out' }, 0.25 + i * 0.12)
          .to(card.querySelectorAll('.ps-name .line-inner'), { yPercent: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, 0.85 + i * 0.1);
      });
      tl.to(q('.ps-head'), { yPercent: -30, opacity: 0.35, duration: 0.5 }, 1.2)
        .to(q('.ps-close .line-inner'), { yPercent: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, 1.3)
        .to({}, { duration: 0.3 });
    },
    { scope: root },
  );

  return (
    <section id="pastors" ref={root} className="relative h-svh w-full overflow-hidden bg-ivory text-ink" aria-label="Our pastors">
      <div className="ps-head absolute inset-x-0 top-[9svh] px-6 text-center md:top-[7svh]">
        <MaskLine innerClass="eyebrow text-ink/55">{church.name.value}</MaskLine>
        <h2 className="mt-2">
          <MaskLine innerClass="display text-[15vw] md:text-[7vw]">Our pastors</MaskLine>
        </h2>
      </div>

      <div className="absolute inset-x-0 top-[29svh] flex items-start justify-center gap-4 px-4 md:top-[27svh] md:gap-10">
        {leadership.map((p, i) => (
          <figure key={p.name} className={`ps-card w-[40vw] md:w-[17vw] ${i % 2 ? 'mt-[5svh]' : ''}`}>
            <Frame img={p.image} alt={`${p.title} ${p.name}`} className="aspect-[3/4] w-full overflow-hidden rounded-[14px]" sizes="(min-width: 768px) 17vw, 40vw" position="50% 25%" />
            <figcaption className="ps-name mt-4">
              <MaskLine innerClass="serif text-lg italic text-ink/60 md:text-2xl">{p.title}</MaskLine>
              <MaskLine innerClass="display whitespace-nowrap text-[5.2vw] leading-[0.9] md:text-[2vw]">{p.name}</MaskLine>
              <MaskLine innerClass="eyebrow mt-2 text-ink/50">{p.role}</MaskLine>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="ps-close absolute inset-x-0 bottom-[4svh] px-6 text-center">
        <MaskLine innerClass="serif text-2xl italic md:text-4xl">Shepherding {church.theme.value.toLowerCase()}.</MaskLine>
      </div>
    </section>
  );
}
