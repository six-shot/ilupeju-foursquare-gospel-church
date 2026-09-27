'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Frame, MaskLine } from './ui';
import type { ImageKey } from '@/content/images';
import { church, denomination } from '@/content/church';

/**
 * About, told as a pinned sequence. It opens on the exact frame the hero ended on
 * (the hall, full screen), then:
 *   1. the image shrinks into a card while "A NEW" / "CLASS" slide in from both sides
 *   2. the words slide away; the full theme "A NEW CLASS / OF PEOPLE." rises, with photographs
 *      opening between the words
 *   3. the card clips away and the church's story is revealed line by line
 */
export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
        const mobile = ctx.conditions?.mobile;
        gsap.set(q('.s-a-left'), { xPercent: -120 });
        gsap.set(q('.s-a-right'), { xPercent: 120 });
        gsap.set(q('.s-b .line-inner'), { yPercent: 115 });
        gsap.set(q('.s-pill'), { width: 0 });
        gsap.set(q('.s-copy .line-inner'), { yPercent: 115 });
        gsap.set(q('.s-eyebrow .line-inner'), { yPercent: 115 });

        // The section sits over the last screen of the hero (see page.tsx) and only
        // becomes visible once it pins — its first frame is identical to the hero's last.
        const show = (on: boolean) => gsap.set(root.current, { autoAlpha: on ? 1 : 0 });
        show(false);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current, start: 'top top', end: '+=360%', scrub: 1.2, pin: true, anticipatePin: 1,
            onEnter: () => show(true), onLeaveBack: () => show(false),
          },
        });

        // 1 — image to card, statement A arrives
        tl.to(q('.s-card'), {
          clipPath: mobile ? 'inset(30% 12% 30% 12% round 14px)' : 'inset(26% 34% 26% 34% round 18px)',
          duration: 1, ease: 'power2.inOut',
        }, 0)
          .to(q('.s-card img, .s-card video'), { scale: 1.25, duration: 1, ease: 'power2.inOut' }, 0)
          .to(q('.s-card-shade'), { opacity: 0.1, duration: 1 }, 0)
          .to(q('.s-a-left'), { xPercent: 0, duration: 0.8, ease: 'power3.out' }, 0.35)
          .to(q('.s-a-right'), { xPercent: 0, duration: 0.8, ease: 'power3.out' }, 0.45)
          // 2 — A leaves, B rises with images between the words
          .to(q('.s-a-left'), { xPercent: -130, opacity: 0.2, duration: 0.8, ease: 'power2.in' }, 1.6)
          .to(q('.s-a-right'), { xPercent: 130, opacity: 0.2, duration: 0.8, ease: 'power2.in' }, 1.6)
          .to(q('.s-card'), { clipPath: 'inset(50% 50% 50% 50% round 18px)', duration: 0.8, ease: 'power2.in' }, 1.7)
          .to(q('.s-b .line-inner'), { yPercent: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, 2.2)
          .to(q('.s-pill'), { width: mobile ? '18vw' : '11vw', duration: 0.6, stagger: 0.15, ease: 'power3.inOut' }, 2.55)
          .fromTo(q('.s-pill img, .s-pill video'), { scale: 1.6 }, { scale: 1, duration: 0.8, stagger: 0.15 }, 2.55)
          // 3 — statement B lifts; the story is revealed
          .to(q('.s-b'), { yPercent: -38, scale: 0.72, opacity: 0.16, filter: 'blur(3px)', duration: 0.9, ease: 'power2.inOut' }, 3.6)
          .to(q('.s-eyebrow .line-inner'), { yPercent: 0, duration: 0.4, ease: 'power3.out' }, 3.95)
          .to(q('.s-copy .line-inner'), { yPercent: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }, 4.05)
          .to({}, { duration: 0.6 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pill = (img: ImageKey) => (
    <span className="s-pill relative mx-[0.12em] inline-block h-[0.72em] translate-y-[0.06em] overflow-hidden rounded-full align-baseline">
      <Frame img={img} className="absolute inset-0" sizes="20vw" />
    </span>
  );

  return (
    <section id="story" ref={root} className="invisible relative h-svh w-full overflow-hidden bg-ink" aria-label="Our story">
      {/* The hall — continues from the hero's final frame */}
      <div className="s-card absolute inset-0" style={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}>
        <Frame img="heroBackground" alt="The choir beneath the cross" className="absolute inset-0" position="50% 40%" />
        <div className="s-card-shade absolute inset-0 bg-ink/35" />
      </div>

      {/* Statement A */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-4 md:px-10">
        <div className="s-a-left display text-[19vw] text-ivory md:text-[13.5vw]">A new</div>
        <div className="s-a-right display self-end text-right text-[19vw] text-fs-gold md:text-[13.5vw]">class</div>
      </div>

      {/* Statement B */}
      <div className="s-b pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <MaskLine innerClass="display text-[14vw] text-ivory md:text-[10.5vw]">
          A new {pill('storyPill1')} class
        </MaskLine>
        <MaskLine innerClass="display text-[14vw] text-fs-gold md:text-[10.5vw]">
          of {pill('storyPill2')} people.
        </MaskLine>
      </div>

      {/* The story */}
      <div className="absolute inset-x-0 bottom-[9svh] mx-auto max-w-4xl px-6 text-center md:bottom-[12svh]">
        <div className="s-eyebrow">
          <MaskLine innerClass="eyebrow text-fs-gold">Our story</MaskLine>
        </div>
        <p className="s-copy serif mt-5 text-[1.55rem] leading-[1.15] text-ivory md:text-[2.6rem]">
          <MaskLine>{church.name.value} is a local assembly</MaskLine>
          <MaskLine>of {church.denomination.value} —</MaskLine>
          <MaskLine>a Pentecostal family founded on {denomination.founded.value},</MaskLine>
          <MaskLine>gathered in Lagos to worship, pray and grow in the Word.</MaskLine>
        </p>
      </div>
    </section>
  );
}
