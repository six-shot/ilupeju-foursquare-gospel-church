import type { Metadata, Viewport } from 'next';
import { Anton, Instrument_Serif, Inter_Tight } from 'next/font/google';
import './globals.css';

const serif = Instrument_Serif({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const sans = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
});

/** Heavy condensed face, used only for the Youth Week "Sent Ones" scene. */
const poster = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Ilupeju Foursquare Gospel Church',
  description:
    'Ilupeju Foursquare Gospel Church — 33 Iseyin Street, Palm Grove, Lagos. A new class of people.',
};

export const viewport: Viewport = {
  themeColor: '#0d0c0a',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${poster.variable} antialiased`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
