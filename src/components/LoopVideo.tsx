'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

/**
 * Muted looping clip that only plays while it is on screen (keeps scrolling smooth
 * with many clips on the page). Phones get the portrait source when one is given.
 */
export default function LoopVideo({
  src, srcMobile, className = '', style, eager = false,
}: { src: string; srcMobile?: string; className?: string; style?: CSSProperties; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: '25% 25%' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video ref={ref} muted loop playsInline autoPlay={eager} preload={eager ? 'auto' : 'metadata'} aria-hidden className={className} style={style}>
      {srcMobile && <source src={srcMobile} media="(max-width: 767px)" type="video/mp4" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
