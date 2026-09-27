'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MaskLine } from './ui';
import { services } from '@/content/church';

/**
 * Weekly programme. The heading rises, then each row draws its rule from the left
 * and its day, name and time rise from their masks — Sunday first, then the week.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(q('.sv-head .line-inner'), { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
      q('.sv-row').forEach((row: Element) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%' } });
        tl.fromTo(row.querySelector('.sv-rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'expo.out' }, 0)
          .fromTo(row.querySelectorAll('.line-inner'), { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out' }, 0.1);
      });
    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} className="relative w-full bg-ivory px-5 py-[16svh] text-ink md:px-10" aria-label="Service times">
      <div className="sv-head mx-auto max-w-6xl">
        <MaskLine innerClass="eyebrow text-ink/50">Service times</MaskLine>
        <h2 className="mt-3">
          <MaskLine innerClass="display text-[15vw] leading-[0.9] md:text-[7vw]">Gather</MaskLine>
          <MaskLine innerClass="serif text-[11vw] italic leading-none md:text-[5vw]">with us</MaskLine>
        </h2>
      </div>

      <ul className="mx-auto mt-[8svh] max-w-6xl">
        {services.map((s, i) => {
          const firstOfDay = i === 0 || services[i - 1].day !== s.day;
          return (
            <li key={s.name} className="sv-row relative grid grid-cols-[1fr_auto] items-end gap-x-6 gap-y-1 py-5 md:grid-cols-[14rem_1fr_auto] md:py-7">
              <span className="sv-rule absolute inset-x-0 top-0 block h-px origin-left bg-ink/20" />
              <span className="col-span-2 md:col-span-1">
                <MaskLine innerClass={`eyebrow ${firstOfDay ? 'text-fs-purple' : 'text-ink/30'}`}>{s.day}</MaskLine>
              </span>
              <span>
                <MaskLine innerClass="serif text-2xl leading-tight md:text-4xl">{s.name}</MaskLine>
                {s.note && <MaskLine innerClass="mt-1 text-sm text-ink/55">{s.note}</MaskLine>}
              </span>
              <MaskLine innerClass="whitespace-nowrap text-right text-base font-semibold tabular-nums md:text-xl">{s.time}</MaskLine>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
