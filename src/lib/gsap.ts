'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** House easing — slow, cinematic in/out. */
gsap.defaults({ ease: 'power3.out', duration: 1.2 });

export const EASE_CINE = 'expo.inOut';

export { gsap, ScrollTrigger, useGSAP };

/** True when the user asked the OS for less motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
