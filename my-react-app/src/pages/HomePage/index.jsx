import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Carousel from "../../components/Carousel";
import Feature from "../../components/Features";
import FruitShop from "../../components/Fruits-shop";
import Visitable from "../../components/Visitable-shop";
import Testimonial from "../../components/Testimonial";
import BestSeller from "../../components/BestSeller";
const index = () => {
  return (
    <>
      <Navbar />
      <Carousel />
      <Feature />
      <FruitShop />
      <Visitable />
      <BestSeller />
      <Testimonial />
      <Footer />
    </>
  );
};
export default index;
