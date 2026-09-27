import Loader from '@/components/Loader';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import Hero from '@/components/Hero';
import YearTheme from '@/components/YearTheme';
import Foursquare from '@/components/Foursquare';
import Life from '@/components/Life';
import Media from '@/components/Media';
import Events from '@/components/Events';
import Services from '@/components/Services';
import Visit from '@/components/Visit';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <Nav />
      <Ticker />
      <main id="top">
        <Hero />
        <YearTheme />
        <Foursquare />
        <Life />
        <Media />
        <Events />
        <Services />
        <Visit />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  );
}
