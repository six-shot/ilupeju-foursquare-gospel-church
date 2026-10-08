import type { Metadata } from 'next';
import Link from 'next/link';
import SmoothScroll from '@/components/SmoothScroll';
import YouthHero from '@/components/youth/YouthHero';
import YouthSignup from '@/components/youth/YouthSignup';
import { church } from '@/content/church';
import { youthWeek } from '@/content/youthWeek';

export const metadata: Metadata = {
  title: `Youth Week ${youthWeek.year}: ${youthWeek.theme} | Ilupeju Foursquare Gospel Church`,
  description: `Youth Week ${youthWeek.year}, “${youthWeek.theme}” — ${youthWeek.dates} at Ilupeju Foursquare Gospel Church. Sign up and tell us which merch you’d buy.`,
};

export default function YouthWeekPage() {
  return (
    <>
      <SmoothScroll />
      <main id="top" className="relative">
        <YouthHero />
        <YouthSignup />
      </main>
      <footer className="flex flex-col gap-3 border-t border-ivory/15 bg-ink px-5 py-8 text-xs text-ivory/50 md:flex-row md:items-center md:justify-between md:px-10">
        <Link href="/" className="underline decoration-fs-gold underline-offset-4">← {church.name.value}</Link>
        <span>{church.address.value} · {church.phone.value}</span>
      </footer>
      <div className="grain" aria-hidden />
    </>
  );
}
