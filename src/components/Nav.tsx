'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { church, nav } from '@/content/church';
import { Emblem } from './Emblem';

const ease = [0.76, 0, 0.24, 1] as const;

/** Minimal fixed bar (blend-difference so it reads over any scene) + full-screen menu. */
export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (open) lenis?.stop(); else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <a href="#top" className="fixed left-5 top-5 z-50 md:left-10" aria-label={church.name.value}>
        <Emblem className="h-9 w-9" colored />
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 mix-blend-difference md:px-10">
        <span className="block pl-12 text-[0.95rem] font-medium leading-tight text-ivory">
          Foursquare Gospel Church<br />Ilupeju, Lagos
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto ml-auto flex items-center gap-3 text-[0.95rem] font-medium text-ivory"
          aria-expanded={open}
          aria-controls="site-menu"
        >
          {open ? 'Close' : 'Menu'}
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 top-0 block h-px w-full bg-ivory transition-transform duration-500 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`absolute bottom-0 left-0 block h-px w-full bg-ivory transition-transform duration-500 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </span>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="site-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ivory px-5 pb-8 pt-28 text-ink md:px-10"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 0.9, ease }}
          >
            <ul className="flex flex-col">
              {nav.map((n, i) => (
                <li key={n.href} className="overflow-hidden">
                  <motion.a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="font-display group flex items-baseline gap-4 text-[11vw] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[6vw]"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-110%' }}
                    transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.05 }}
                  >
                    <span className="font-sans text-sm font-normal tracking-normal text-ink/40 md:text-base">0{i + 1}</span>
                    <span className="transition-transform duration-500 group-hover:translate-x-4">{n.label}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="flex flex-col gap-2 text-sm text-ink/70 md:flex-row md:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <span>{church.address.value}</span>
              <span>{church.phone.value} · {church.email.value}</span>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
