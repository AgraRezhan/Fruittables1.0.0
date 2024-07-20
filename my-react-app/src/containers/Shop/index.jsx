import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useProductStore from "../../store/useProductStore";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { fetchOrder, orders, cancelOrder, fetchShippingByOrderId, shippings } = useProductStore();
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    // Fetch shipping for each order
    orders.forEach(order => {
      fetchShippingByOrderId(order.id, setError);
    });
  }, [orders, fetchShippingByOrderId]);

  useEffect(() => {
    // console.log("Fetched shippings:", shippings); // Tambahkan log ini
  }, [shippings]);



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
                  <th scope="col">Total price</th>
                  <th scope="col">Order date</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Status</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.map((order) => {
                  const shipping = shippings.find(sh => sh.order_id === order.id);
                  return (
                    <tr key={order.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {order.items && order.items.length > 0 && (
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
                        <p className="mb-0 mt-4">{shipping ? shipping.address : 'Tidak ditemukan'}</p>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">
                          {shipping ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(shipping.total) : 'Tidak ditemukan'}
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
                        <button 
                          // onClick={() => handleCancelOrder(order.id)}
                          onClick={() =>
                            navigate(`/orderdetail/${order.id}`)
                          }
                          className="btn border border-secondary rounded-pill px-3 text-primary btn-md rounded-circle bg-light border mt-4">
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
