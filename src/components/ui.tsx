import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { images, type ImageKey, type ImageSlot } from '@/content/images';
import LoopVideo from './LoopVideo';

/** Splits text into per-character spans (kept inside word wrappers so lines break naturally). */
export function Chars({ text, className = '', charClass = 'char' }: { text: string; className?: string; charClass?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {word.split('').map((ch, ci) => (
            <span key={ci} className={`${charClass} inline-block will-change-transform`}>
              {ch}
            </span>
          ))}
          {wi < text.split(' ').length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/** A line inside an overflow mask; animate `.line-inner`. */
export function MaskLine({ children, className = '', innerClass = '' }: { children: ReactNode; className?: string; innerClass?: string }) {
  return (
    <span className={`line-mask ${className}`}>
      <span className={`line-inner ${innerClass}`}>{children}</span>
    </span>
  );
}

/**
 * Placeholder artwork (SVG data URI) shown until the church supplies a photo for a slot.
 * It is a real <img>, so every scroll animation that scales/moves `.frame img` still works.
 */
function placeholderSrc(label: string, shape: string) {
  const [w, h] = shape === 'portrait' ? [900, 1200] : shape === 'square' ? [900, 900] : [1600, 1000];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='xMidYMid slice'>
<defs><radialGradient id='g' cx='50%' cy='40%' r='75%'><stop offset='0' stop-color='#2a241c'/><stop offset='1' stop-color='#100e0b'/></radialGradient>
<pattern id='p' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><line x1='0' y1='0' x2='0' y2='28' stroke='#f3ede3' stroke-opacity='0.035' stroke-width='10'/></pattern></defs>
<rect width='100%' height='100%' fill='url(#g)'/><rect width='100%' height='100%' fill='url(#p)'/>
<text x='50%' y='50%' text-anchor='middle' font-family='Georgia,serif' font-style='italic' font-size='${Math.round(w / 18)}' fill='#f3ede3' fill-opacity='0.55'>${label}</text>
<text x='50%' y='${Math.round(h / 2 + w / 16)}' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-size='${Math.round(w / 55)}' letter-spacing='6' fill='#f6b826' fill-opacity='0.6'>PHOTO COMING SOON</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Cover image inside a clipping frame, by slot (see src/content/images.ts). The <img> is what gets parallaxed/scaled. */
export function Frame({
  img, alt, className = '', imgClass = '', sizes = '100vw', priority = false, style, position,
}: {
  img: ImageKey; alt?: string; className?: string; imgClass?: string; sizes?: string; priority?: boolean;
  style?: CSSProperties; position?: string;
}) {
  const slot: ImageSlot = images[img];
  const pos = `frame ${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} ${className}`;
  return (
    <div className={pos} style={style}>
      {slot.src && slot.srcMobile ? (
        <>
          {/* phones get the portrait crop, larger screens the wide one */}
          <Image src={slot.srcMobile} alt={alt ?? slot.label} fill sizes="100vw" priority={priority} quality={90}
            className={`md:hidden ${imgClass}`} style={{ objectFit: 'cover', objectPosition: 'center' }} />
          <Image src={slot.src} alt={alt ?? slot.label} fill sizes={sizes} priority={priority} quality={90}
            className={`hidden md:block ${imgClass}`} style={{ objectFit: 'cover', objectPosition: position ?? 'center' }} />
        </>
      ) : slot.src ? (
        <Image
          src={slot.src}
          alt={alt ?? slot.label}
          fill
          sizes={sizes}
          priority={priority}
          quality={90}
          className={imgClass}
          style={{ objectFit: 'cover', objectPosition: position ?? 'center' }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        !slot.video && <img src={placeholderSrc(slot.label, slot.shape)} alt="" aria-hidden className={`absolute inset-0 h-full w-full object-cover ${imgClass}`} />
      )}
      {slot.video && (
        // Plays over the photo, which shows until the first frame is ready. Phones get the portrait cut.
        <LoopVideo
          src={slot.video}
          srcMobile={slot.videoMobile}
          eager={priority}
          className={`absolute inset-0 h-full w-full object-cover ${imgClass}`}
          style={{ objectPosition: position ?? 'center' }}
        />
      )}
    </div>
  );
}

/** The four Foursquare parallelograms (colours from the church's Foursquare mark). */
export function FoursquareMark({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path d="M22 13h28l-4 25H18z" fill="#b3221b" />
      <path d="M58 5h37l-6 33H53z" fill="#0a6db5" />
      <path d="M12 42h38l-8 53H4z" fill="#f6b826" />
      <path d="M57 42h33l-7 48H50z" fill="#352c63" />
    </svg>
  );
}
