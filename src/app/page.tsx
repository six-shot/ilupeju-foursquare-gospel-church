import Loader from '@/components/Loader';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Identity from '@/components/Identity';
import Foursquare from '@/components/Foursquare';
import Pastors from '@/components/Pastors';
import Life from '@/components/Life';
import Media from '@/components/Media';
import Events from '@/components/Events';
import Visit from '@/components/Visit';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <Nav />
      <main id="top">
        <Hero />
        {/* Story overlaps the hero's final screen so the hand-over is seamless */}
        <div className="relative z-10 -mt-[100svh]">
          <Story />
        </div>
        <Identity />
        <Foursquare />
        <Pastors />
        <Life />
        <Media />
        <Events />
        <Visit />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  );
}
