import { getFeaturedRoom } from "@/libs/apis";
import Gallery from "../components/Gallery/Gallery";
import NewsLetter from "../components/NewsLetter/NewsLetter";
import PageSearch from "../components/PageSearch/PageSearch";
import HeroSection from "../components/HeroSection/HeroSection";
import FeaturedRoom from "../components/FeaturedRoom/FeaturedRoom";

const Home = async () => {
  const featuredRoom = await getFeaturedRoom();

  return (
    <>
      <HeroSection />
      <PageSearch />
      <FeaturedRoom featuredRoom={featuredRoom} />
      <Gallery />
      <NewsLetter />
    </>
  );
};

export default Home;
