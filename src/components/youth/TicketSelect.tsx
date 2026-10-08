'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

/**
 * A select drawn to match the ticket: a boxed field that opens a tear-off list with
 * dashed dividers. Works with the keyboard (arrows, Home/End, Enter, Escape) and posts
 * its value through a hidden input, so the form reads it like any other field.
 */
export default function TicketSelect({ name, label, options, placeholder = 'Select' }: {
  name: string; label: string; options: readonly string[]; placeholder?: string;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Picking the current choice again clears it, since these fields are optional.
  const choose = (v: string) => {
    setValue((cur) => (cur === v ? '' : v));
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setActive(Math.max(0, options.indexOf(value)));
        setOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(options.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(options[active]); }
    else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false);
  };

  return (
    <div ref={root} className="relative">
      <span id={`${id}-label`} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        <span className="ml-2 font-normal text-ink/40">optional</span>
      </span>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => { setActive(Math.max(0, options.indexOf(value))); setOpen((v) => !v); }}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white/70 px-4 py-3.5 text-left text-base transition-colors focus:outline-none focus-visible:border-ink ${
          open ? 'border-ink bg-white' : 'border-ink/15 hover:border-ink/40'
        }`}
      >
        <span className={value ? 'text-ink' : 'text-ink/35'}>{value || placeholder}</span>
        <svg viewBox="0 0 12 8" className={`h-2 w-3 shrink-0 text-ink transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden>
          <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <ul
        id={`${id}-list`}
        role="listbox"
        aria-labelledby={`${id}-label`}
        className={`absolute inset-x-0 top-full z-20 mt-2 origin-top overflow-hidden rounded-xl border border-ink bg-white shadow-[0_24px_50px_-18px_rgba(13,12,10,0.45)] transition duration-200 ${
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        }`}
      >
        {options.map((o, i) => (
          <li
            key={o}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={value === o}
            onPointerMove={() => setActive(i)}
            onClick={() => choose(o)}
            className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5 ${i > 0 ? 'border-t border-dashed border-ink/20' : ''} ${
              open && active === i ? 'bg-ink text-ivory' : 'text-ink'
            }`}
          >
            {o}
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.7rem] leading-none ${value === o ? 'bg-fs-gold text-ink' : 'text-transparent'}`} aria-hidden>✓</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
