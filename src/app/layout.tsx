import type { Metadata, Viewport } from 'next';
import { Anton, Bricolage_Grotesque, Inter_Tight, Libre_Caslon_Text } from 'next/font/google';
import './globals.css';

const serif = Libre_Caslon_Text({
  variable: '--font-caslon',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

const sans = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
});

/** Headline face for the redesigned sections. */
const display = Bricolage_Grotesque({
  variable: '--font-bricolage',
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
    <html lang="en" className={`${serif.variable} ${sans.variable} ${display.variable} ${poster.variable} antialiased`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
