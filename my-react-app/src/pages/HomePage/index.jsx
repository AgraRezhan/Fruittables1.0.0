import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Carousel from "../../components/Carousel";
import Feature from "../../components/Features";
import FruitShop from "../../components/Fruits-shop";
import Visitable from "../../components/Visitable-shop";
import Testimonial from "../../components/Testimonial";
import BestSeller from "../../components/BestSeller";
import "./style.css";

const Loading = () => (
  <div className="loader-container">
    <div className="spinner"></div>
  </div>
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi pemanggilan API atau data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Misalnya 2 detik
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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

export default Index;
