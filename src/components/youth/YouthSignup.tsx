'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import Confetti from './Confetti';
import MerchCard from './MerchCard';
import TicketSelect from './TicketSelect';
import { ageRanges, attendance, merch, youthWeek, type MerchKey } from '@/content/youthWeek';

const POSTER = { fontFamily: 'var(--font-anton), Impact, sans-serif' } as const;

const field =
  'w-full rounded-xl border border-ink/15 bg-white/70 px-4 py-3.5 text-base text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:bg-white focus:outline-none';

function Label({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <span className="mb-2 block text-sm font-semibold text-ink">
      {children}
      {optional && <span className="ml-2 font-normal text-ink/40">optional</span>}
    </span>
  );
}

/** Where the bottom pair of notches sits, measured up from the bottom edge of the ticket. */
const TEAR = '8.5rem';

/** Masks a notch out of both side edges at each given height (any CSS length or %). */
function notch(...heights: string[]) {
  const mask = heights
    .flatMap((y) => ['0%', '100%'].map((x) => `radial-gradient(circle at ${x} ${y}, transparent 27px, #000 28px)`))
    .join(', ');
  return { maskImage: mask, WebkitMaskImage: mask, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' } as const;
}

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

/**
 * Youth Week sign-up. Collects who is coming and their feedback on which merch
 * they would buy (no sizes, no orders, no payment), and posts it to /api/youth-signup.
 * Laid out as an event ticket: a dark stub with the event on it, a perforation, then the form.
 */
export default function YouthSignup() {
  const [picked, setPicked] = useState<MerchKey[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '');
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/youth-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: get('name'),
          phone: get('phone'),
          email: get('email'),
          ageRange: get('ageRange'),
          attendance: get('attendance'),
          merch: picked,
          note: get('note'),
          website: get('website'),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
      setFirstName(get('name').trim().split(/\s+/)[0]);
      setStatus('done');
      // The ticket is much shorter once the form is gone, so bring it back into view.
      requestAnimationFrame(() => {
        const lenis = (window as unknown as { __lenis?: { resize: () => void; scrollTo: (t: string, o?: object) => void } }).__lenis;
        if (lenis) { lenis.resize(); lenis.scrollTo('#signup', { duration: 0.9 }); }
        else document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('idle');
    }
  }

  return (
    <section id="signup" className="relative w-full overflow-hidden bg-ink px-4 py-[12svh] md:px-10" aria-label="Register for Youth Week">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(closest-side, rgba(240,96,12,0.22), rgba(150,22,8,0.1) 45%, transparent 75%)' }}
        aria-hidden
      />

      {/* The ticket is two pieces, each with quarter-circles masked out of the corners where they
          meet, so the notches are real holes that show whatever is behind the ticket. */}
      <div className="relative mx-auto max-w-3xl text-ink" style={{ filter: 'drop-shadow(0 40px 70px rgba(255,110,20,0.32))' }}>
        {/* stub */}
        <div
          className="flex flex-col gap-6 rounded-t-[28px] px-6 pb-9 pt-8 text-ivory md:flex-row md:items-end md:justify-between md:px-10"
          style={{
            background: 'radial-gradient(120% 140% at 50% 130%, #f2600c 0%, #8f1a08 38%, #1a0705 72%)',
            ...notch('100%'),
          }}
        >
          <div>
            <span className="eyebrow text-[0.66rem] text-fs-gold">Youth Week {youthWeek.year}</span>
            <h2 className="mt-2 text-[19vw] uppercase leading-[0.9] md:text-[6.5rem]" style={POSTER}>Register</h2>
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm md:grid-cols-1 md:text-right">
            <div>
              <dt className="eyebrow text-[0.58rem] text-ivory/60">Theme</dt>
              <dd className="mt-0.5 font-semibold">{youthWeek.theme}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.58rem] text-ivory/60">Dates</dt>
              <dd className="mt-0.5 font-semibold">{youthWeek.dates}</dd>
            </div>
          </dl>
        </div>

        <div className="relative rounded-b-[28px] bg-ivory px-6 pb-8 pt-9 md:px-10" style={notch('0%', `calc(100% - ${TEAR})`)}>
          {status === 'done' ? (
            <div className="pt-6 text-center" role="status">
              <Confetti />
              <p className="text-5xl uppercase leading-none md:text-6xl" style={POSTER}>Thank you{firstName ? `, ${firstName}` : ''}</p>
              <p className="mx-auto mt-5 max-w-md leading-relaxed text-ink/65">
                You are registered for Youth Week {youthWeek.year}, {youthWeek.dates}. Invite a friend to register too.
              </p>
              <button
                type="button"
                onClick={() => { setPicked([]); setStatus('idle'); }}
                className="mt-24 font-semibold underline decoration-fs-red decoration-2 underline-offset-4"
              >
                Register someone else
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-7">
              <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
                <label className="block">
                  <Label>Full name</Label>
                  <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={field} placeholder="Your name" />
                </label>
                <label className="block">
                  <Label>Phone / WhatsApp</Label>
                  <input name="phone" required type="tel" inputMode="tel" maxLength={30} autoComplete="tel" className={field} placeholder="0801 234 5678" />
                </label>
                <label className="block">
                  <Label optional>Email</Label>
                  <input name="email" type="email" maxLength={160} autoComplete="email" className={field} placeholder="you@example.com" />
                </label>
                <TicketSelect name="ageRange" label="Age range" options={ageRanges} />
              </div>

              <TicketSelect name="attendance" label="Where do you worship?" options={attendance} />

              <fieldset className="border-t border-ink/10 pt-7">
                <legend className="sr-only">Which Youth Week merch would you buy?</legend>
                <p className="text-2xl uppercase leading-none" style={POSTER} aria-hidden>Which merch would you buy?</p>
                <p className="mt-2 text-sm text-ink/55">Tick any you would pay for. Nothing is ordered or paid for here; it tells us what to produce.</p>
                <p className="mt-3 rounded-lg border border-ink/15 bg-ink/5 px-3.5 py-2.5 text-sm text-ink/80">
                  <span className="font-semibold text-ink">Please note:</span> the pictures below are not the final designs. We only want to know which items you would like.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {merch.map((m) => (
                    <MerchCard key={m.key} item={m.key} label={m.label} checked={picked.includes(m.key)} onChange={() => setPicked((v) => toggle(v, m.key))} />
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <Label optional>Anything you’d like us to know?</Label>
                <textarea name="note" rows={3} maxLength={1000} className={`${field} resize-none`} placeholder="Questions, ideas, other merch you’d love to see" />
              </label>

              {/* Honeypot — hidden from people, tempting for bots. */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              {error && <p role="alert" className="font-semibold text-fs-red">{error}</p>}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-16 h-16 w-full rounded-xl bg-ink text-2xl uppercase tracking-wide text-ivory transition-colors hover:bg-fs-red disabled:opacity-60"
                style={POSTER}
              >
                {status === 'sending' ? 'Sending…' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
