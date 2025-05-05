import HeroSection from "./components/HeroSection";
import FeaturedProperties from "./components/FeaturedProperties";
import ActiveServices from "./components/ActiveServices";
import ComingSoon from "./components/ComingSoon";
import About from "./components/About";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedProperties />
      <ActiveServices />
      <ComingSoon />
      <About />
    </main>
  );
}
