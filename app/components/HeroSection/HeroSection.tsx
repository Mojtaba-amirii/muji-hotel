import ClientComponent from "./ClientComponent";
import { heading1, images } from "./ServerComponent";

const HeroSection = () => {
  return <ClientComponent heading1={heading1} images={images} />;
};

export default HeroSection;
