import { useEffect, useState } from "react";
import OrderDetail from "../../containers/detailOrders"
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
      }, 2000); // Misalnya 2 detik
    }, []);
  
    if (isLoading) {
      return <Loading />;
    }
    return(
        <>
        <OrderDetail />
        </>
    )
}

export default index;