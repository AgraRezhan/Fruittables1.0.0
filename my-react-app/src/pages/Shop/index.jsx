import { useEffect, useState } from "react";
import Shop from "../../containers/Shop";
import "./style.css";

const Loading = () => (
  <div className="loader-container">
    <div className="spinner"></div>
  </div>
);

const index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi pemanggilan API atau data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Misalnya 2 detik
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Shop />
    </>
  );
};

export default index;
