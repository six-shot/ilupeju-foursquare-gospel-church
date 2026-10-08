import type { ReactNode } from 'react';
import type { MerchKey } from '@/content/youthWeek';

const POSTER = { fontFamily: 'var(--font-anton), Impact, sans-serif' } as const;
const CLOTH = '#1b1614';
const SEAM = '#4d423a';

/** "Sent Ones" chest print with its flame, centred on (x, y). */
function Print({ x, y, size = 22, dark = false }: { x: number; y: number; size?: number; dark?: boolean }) {
  return (
    <g>
      <path transform={`translate(${x - 5} ${y - size * 1.75}) scale(${size / 44})`} d="M10 0C15 9 20 15 20 23a10 10 0 0 1-20 0C0 16 6 13 10 0Z" fill="#ff8a1f" />
      <text x={x} y={y} textAnchor="middle" fontSize={size} style={POSTER} fill={dark ? '#1b1614' : '#f3ede3'}>SENT</text>
      <text x={x} y={y + size} textAnchor="middle" fontSize={size} style={POSTER} fill="#ff8a1f">ONES</text>
    </g>
  );
}

/**
 * Illustrated mockups, split into the item itself and its print so the print can sit
 * a little in front of the cloth and shift against it as the card turns.
 * These are placeholders for the look of the merch, not the final designs.
 */
const MOCKUPS: Record<MerchKey, { base: ReactNode; print: ReactNode }> = {
  tshirt: {
    base: (
      <>
        <path d="M70 30 40 42 12 78l24 20 16-16v94h96V82l16 16 24-20-28-36-30-12c-6 14-54 14-60 0Z" fill={CLOTH} stroke={SEAM} strokeWidth="2" strokeLinejoin="round" />
        <path d="M70 30c6 14 54 14 60 0" fill="none" stroke={SEAM} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
    print: <Print x={100} y={108} />,
  },
  hoodie: {
    base: (
      <>
        <path d="M66 46 34 60 10 152l26 8 16-54v78h96v-78l16 54 26-8-24-92-32-14Z" fill={CLOTH} stroke={SEAM} strokeWidth="2" strokeLinejoin="round" />
        <path d="M66 46c-6-34 74-34 68 0-10 18-58 18-68 0Z" fill="#120e0d" stroke={SEAM} strokeWidth="2" />
        <path d="M72 144h56l8 26H64Z" fill="none" stroke={SEAM} strokeWidth="2" strokeLinejoin="round" />
        <path d="M90 60v26M110 60v26" stroke="#f3ede3" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    print: <Print x={100} y={112} size={19} />,
  },
  cap: {
    base: (
      <>
        <path d="M28 128c-4-66 122-82 136-8v8Z" fill={CLOTH} stroke={SEAM} strokeWidth="2" strokeLinejoin="round" />
        <path d="M150 116c30 0 46 12 44 26-28-10-52-10-84-8Z" fill="#120e0d" stroke={SEAM} strokeWidth="2" strokeLinejoin="round" />
        <path d="M96 66c-10 18-14 40-12 62" fill="none" stroke={SEAM} strokeWidth="2" />
        <circle cx="98" cy="64" r="4" fill={SEAM} />
      </>
    ),
    print: <Print x={124} y={106} size={15} />,
  },
  tote: {
    base: (
      <>
        <path d="M70 84c0-58 60-58 60 0" fill="none" stroke="#b9a37c" strokeWidth="8" strokeLinecap="round" />
        <path d="M44 82h112l10 104H34Z" fill="#d9c7a3" stroke="#a8946f" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
    print: <Print x={100} y={142} size={21} dark />,
  },
};

/**
 * A merch choice as a card. The item floats in 3D; ticking it makes it spin once,
 * then sway under a fire glow. The checkbox stays native for keyboards and screen readers.
 */
export default function MerchCard({ item, label, checked, onChange }: { item: MerchKey; label: string; checked: boolean; onChange: () => void }) {
  const m = MOCKUPS[item];
  return (
    <label
      className={`merch-card group relative block cursor-pointer select-none overflow-hidden rounded-[18px] border px-3 pb-4 pt-3 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
        checked ? 'is-picked border-ink bg-white' : 'border-ink/15 bg-white/50 hover:border-ink/40'
      }`}
    >
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className="merch-glow pointer-events-none absolute inset-x-0 top-0 aspect-square" aria-hidden />
      <span className="merch-stage relative block aspect-square w-full" aria-hidden>
        <span className="merch-item absolute inset-[6%] block">
          <svg viewBox="0 0 200 200" className="merch-layer absolute inset-0 h-full w-full">{m.base}</svg>
          <svg viewBox="0 0 200 200" className="merch-layer merch-print absolute inset-0 h-full w-full">{m.print}</svg>
        </span>
        <span className="merch-shadow absolute inset-x-[22%] bottom-[2%] block h-[6%] rounded-[50%] bg-black/35 blur-md" />
      </span>
      <span className="relative mt-1 flex items-center justify-center gap-2 text-sm font-semibold">
        <span className={`grid h-5 w-5 place-items-center rounded-full border text-[0.7rem] leading-none transition-colors ${checked ? 'border-ink bg-ink text-ivory' : 'border-ink/35 text-transparent'}`} aria-hidden>✓</span>
        {label}
      </span>
    </label>
  );
}
