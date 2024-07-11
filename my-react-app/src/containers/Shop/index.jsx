import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useProductStore from "../../store/useProductStore";
import { useEffect } from "react";
import dayjs from "dayjs";

const Index = () => {
  const { fetchOrder, orders } = useProductStore();

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Products</th>
                  <th scope="col">Address</th>
                  <th scope="col">Price</th>
                  <th scope="col">Order date</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Status</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="d-flex align-items-center">
                        {order.items &&
                            order.items.length > 0 && (
                              <img
                                src={order.items[0].img_url} // Mengambil gambar pertama dari items
                                className="img-fluid me-2 rounded-circle"
                                style={{ width: 80, height: 80 }}
                                alt=""
                              />
                            )}
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">{order.address}</p>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">
                        {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(order.total)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">
                        {dayjs(order.order_date).format('dddd, D MMMM YYYY')}
                        </p>
                      </td>
                      
                      <td>
                        <p className="mb-0 mt-4">
                            {order.quantity}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">
                            {order.status}
                        </p>
                      </td>
                      <td>
                        <button className="btn border border-secondary rounded-pill px-3 text-primary btn-md rounded-circle bg-light border mt-4">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
