import Navbar from "../../components/NavbarSeller";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import dayjs from "dayjs";

const Index = () => {
  const token = localStorage.getItem("token");
  const [shippings, setShippings] = useState([]); // Untuk menyimpan data shipping
  const [statusToUpdate, setStatusToUpdate] = useState({}); // Untuk menyimpan status yang akan diupdate
  const [show, setShow] = useState(null); // Untuk menyimpan shipping ID yang sedang diedit

  const fetchShippings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/shippings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      setShippings(data);
      console.log("Respons API shippings:", data);
    } catch (err) {
      console.log("Kesalahan saat mengambil data shippings:", err);
      setShippings([]); // Set ke array kosong jika terjadi kesalahan
    }
  };

  useEffect(() => {
    fetchShippings();
  }, []);

  const handleStatusChange = (e, orderId) => {
    const newStatus = e.target.value;
    setStatusToUpdate((prevState) => ({
      ...prevState,
      [orderId]: newStatus,
    }));
  };

  const updateStatus = async (orderId) => {
    const newStatus = statusToUpdate[orderId];
    console.log("Status baru:", newStatus);
  
    try {
      
  
      if (newStatus === "cancelled") {
        await axios.put(
          `http://localhost:8000/api/orders/${orderId}/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      fetchShippings(); // Refresh data setelah update
      alert("Status pesanan berhasil diperbarui");
    } catch (err) {
      console.log("Kesalahan saat mengupdate status:", err);
      alert("Kesalahan saat mengupdate status");
    }
  };
  
  

  const handleClick = (orderId) => {
    setShow((prevShow) => (prevShow === orderId ? null : orderId)); // Toggle show state untuk shipping ID tertentu
  };

  const isClick = () => {
    alert("Produk telah dicancel")
  }

  // Mengelompokkan shipping berdasarkan user ID dan waktu pemesanan
  const groupedShippings = shippings.reduce((acc, shipping) => {
    const userId = shipping.user_id;
    const orderDate = dayjs(shipping.order.order_date).format("YYYY-MM-DD");

    if (!acc[userId]) {
      acc[userId] = {};
    }

    if (!acc[userId][orderDate]) {
      acc[userId][orderDate] = [];
    }

    acc[userId][orderDate].push(shipping);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Data Produk</h2>
        
        {Object.keys(groupedShippings).map((userId) => (
          <div key={userId}>
            <h3>User ID: {userId}</h3>
            {Object.keys(groupedShippings[userId]).map((orderDate) => (
              <div key={orderDate}>
                <h4>Tanggal Pemesanan: {orderDate}</h4>
                {groupedShippings[userId][orderDate].map((shipping, index) => (
                  <div key={index} className="mb-4">
                    {shipping.order && shipping.order.order_detail ? (
                      shipping.order.order_detail.map((detail, index) => (
                        detail.product ? (
                          <ul 
                          style={{listStyleType: "none"}}
                          key={index}
                          >
                            <li className=" pt-2 pb-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={detail.product.img_url || 'default-image.jpg'}
                                    className="img-fluid me-2 rounded-circle"
                                    style={{ width: 80, height: 80 }}
                                    alt={detail.product.title || 'Produk Tanpa Nama'}
                                  />
                                  <div>
                                    <h5 className="ms-3">{detail.product.title || 'Judul Tidak Tersedia'}</h5>
                                    <p className="ms-3 fw-bold">
                                      {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                      }).format(detail.product.price || 0)}
                                    </p>
                                  </div>
                                </div>
                                <p>X {detail.quantity || 0}</p>
                              </div>
                            </li>
                          </ul>
                        ) : (
                          <li key={index}>Produk tidak ditemukan</li>
                        )
                      ))
                    ) : (
                      <li key={shipping.id}>Tidak ada detail pesanan</li>
                    )}
                    <Row style={{ marginTop: "50px" }} className="border-bottom">
                      <Col lg={2}>
                        <div>
                          <p>Nama Customer</p>
                          <p>Alamat pengiriman</p>
                          <p>Kota</p>
                          <p>Nama group</p>
                          <p>Catatan</p>
                          <p>Waktu pemesanan</p>
                          <p className="fw-bold">Status pesanan</p>
                        </div>
                      </Col>
                      <Col lg={10}>
                        <div>
                          <p>: {`${shipping.first_name || 'Nama Tidak Tersedia'} ${shipping.last_name || 'Nama Tidak Tersedia'}`}</p>
                          <p>: {shipping.address || 'Alamat Tidak Tersedia'}</p>
                          <p>: {shipping.city || 'Kota Tidak Tersedia'}</p>
                          <p>: {shipping.company_name || 'Nama Perusahaan Tidak Tersedia'}</p>
                          <p>: {shipping.note || 'Catatan Tidak Tersedia'}</p>
                          <p>: {dayjs(shipping.order.order_date).format('dddd, D MMMM YYYY') || 'Catatan Tidak Tersedia'}</p>
                          <div className="d-flex align-items-center">
                            <p className="fw-bold">: {shipping.order.status || 'Status Tidak Tersedia'}</p>

                            {
                              shipping.order.status !== "cancelled" ? (
                                <button className="p-1 ms-2" onClick={() => handleClick(shipping.order.id)}>
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            
                              ) : (
                                <button className="p-1 ms-2 mb-3" onClick={() => isClick()}>
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                              )
                            }
                            {show === shipping.order.id && shipping.order.status!== "cancelled" && (
                              <>
                                <select
                                  className="form-select ms-2"
                                  value={statusToUpdate[shipping.order.id] || shipping.order.status}
                                  onChange={(e) => handleStatusChange(e, shipping.order.id)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="cancelled">cancelled</option>
                                </select>
                                <button
                                  className="btn btn-primary ms-2"
                                  onClick={() => updateStatus(shipping.order.id)}
                                >
                                  Update
                                </button>
                                </>
                              
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row 
                    style={{marginBottom: "100px"}}
                    className="border-bottom d-flex justify-content-end ls-1 bg-light">
                        <Col lg={2}>
                            <p>Biaya Tambahan </p>
                            <p>Harga produk </p>
                            <p className="fw-bold">Total </p>
                        </Col>
                        <Col lg={2}>
                            <p>: {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(`${shipping.total - shipping.order.total}`)}</p>
                            <p>: {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(shipping.order.total)}</p>
                            <p className="fw-bold">: {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(shipping.total)} </p>
                        </Col>
                    </Row>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

      </div>
      <Footer />
    </>
  );
};

export default Index;
