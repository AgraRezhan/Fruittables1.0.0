import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import useProductStore from "../../store/useProductStore";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Col, Row } from "react-bootstrap";

const index = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState(""); // Mulai dengan null untuk menunjukkan bahwa data belum diambil
  const [shippings, setShippings] = useState(""); // Mulai dengan null untuk menunjukkan bahwa data belum diambil

  const navigate = useNavigate();

  const {cancelOrder} = useProductStore();
  console.log("ini id", id);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.data);
      console.log("ini data", response.data.data);
    } catch (err) {
      console.log("Data tidak ditemukan", err);
      setOrders([]); // Set ke array kosong jika terjadi kesalahan
    }
  };

  console.log("ini orderan", orders);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchShippings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/shippings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShippings(response.data.data);
      console.log("ini data", response.data.data);
    } catch (err) {
      console.log("Data tidak ditemukan", err);
      setShippings([]); // Set ke array kosong jika terjadi kesalahan
    }
  };

  console.log("ini shippings", shippings);
  useEffect(() => {
    fetchShippings();
  }, []);

  const handleCancelOrder = (orderId) => {
    cancelOrder(orderId); 
    alert("pesanan berhasil di batalkan")
  };

  return (
    <>
      <Navbar />
      {orders.items &&
        orders?.items.map((order) => (
          <div className="d-flex justify-content-between align-items-center container border-top border-bottom pt-2 pb-2">
            <div className="d-flex align-items-center">
              <img
                src={order.img_url}
                className="img-fluid me-2 rounded-circle"
                style={{ width: 80, height: 80 }}
                alt=""
              />
              <div>
                <h5 className="ms-3">{order.title}</h5>
                <p className="ms-3 fw-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(order.price)}
                </p>
              </div>
            </div>
            <p>X {order.quantity}</p>
          </div>
        ))}
      <div className="container">
        <Row style={{ marginTop: "50px" }} className="border-bottom">
          <Col lg={2}>
            <div>
              <p>Alamat pengiriman</p>
              <p>Kota</p>
              <p>Nama group</p>
              <p>Catatan</p>
              <p className="fw-bold">Status pesanan</p>
            </div>
          </Col>
          <Col lg={10}>
            <div>
              <p>: {shippings.address}</p>
              <p>: {shippings.city}</p>
              <p>: {shippings.company_name}</p>
              <p>: {shippings.note}</p>
              <p className="fw-bold">: {orders.status}</p>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "50px" }}>
          <Col lg={8} className="d-flex justify-content-end">
            <div>
              <p>Biaya tambahan : </p>
              <p>Total harga : </p>
              <p className="fw-bold">Total : </p>
            </div>
          </Col>
          <Col lg={4} className="d-flex justify-content-end">
            <div>
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(shippings.total - orders.total)}
              </p>
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(orders.total)}
              </p>
              <p className="fw-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(shippings.total)}
              </p>
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-center ">
        <button
          onClick={() => navigate(`/update/${orders.id}`)}
          className="btn border border-secondary w-50 mb-3 rounded-pill px-3 text-primary btn-md rounded-circle bg-light border mt-4 me-3 ms-3"
        >
          Update
        </button>
        <button
          onClick={() => handleCancelOrder(orders.id)}
          // onClick={() => navigate(`/orderdetail/${order.id}`)}
          className="btn border border-secondary w-50 mb-3 rounded-pill px-3 text-primary btn-md rounded-circle bg-light border mt-4 me-3 ms-3"
        >
          cancel
        </button>
        </div>
        
      </div>
      <Footer />
    </>
  );
};

export default index;
