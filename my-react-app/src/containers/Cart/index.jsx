import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useProductStore from "../../store/useProductStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
  const {
    cartItems,
    fetchCarts,
    removeCartItem,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    createOrder,
  } = useProductStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const flatRate = 3000; // Flat rate untuk shipping

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  useEffect(() => {
    console.log("cartItems:", cartItems);
  }, [cartItems]);

  const subtotal = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0) : 0;

  const total = subtotal + flatRate;

  const onRemoveItem = (productId) => {
    removeCartItem(productId);
  };

  const handleIncrease = (itemId) => {
    // Temukan item berdasarkan itemId
    const item = cartItems.find((item) => item.id === itemId);
  
    if (item) {
      // Jika stok produk sama dengan 0, munculkan alert
      if (item.product.stock === 0) {
        alert(`Stok produk ${item.product.title} tidak mencukupi!`);
      } else {
        // Jika stok mencukupi, tingkatkan jumlah item
        incrementCartItemQuantity(itemId);
      }
    } else {
      console.log("Item tidak ditemukan");
    }
  };

  const handleDecrease = (itemId) => {
    decrementCartItemQuantity(itemId);
  };

  const handleCheckout = () => {
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].product.stock < cartItems[i].quantity) {
        alert(`Stok produk ${cartItems[i].product.title} tidak mencukupi!`);
        return; // Hentikan proses jika stok tidak mencukupi
      }
    }

    navigate("/checkout");
  };

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
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cartItems) &&
                  cartItems.map((item) => (
                    <tr key={item.id}>
                      <th scope="row">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.product.img_url}
                            className="img-fluid me-5 rounded-circle"
                            style={{ width: 80, height: 80 }}
                            alt={item.product.title}
                          />
                        </div>
                      </th>
                      <td>
                        <p className="">{item.product.title}</p>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.product.price)}
                        </p>
                      </td>
                      <td>
                        <div
                          className="input-group quantity mt-4"
                          style={{ width: 100 }}
                        >
                          <div className="input-group-btn">
                            <button
                              onClick={() => handleDecrease(item.id)}
                              className="btn btn-sm btn-minus rounded-circle bg-light border"
                            >
                              <i className="fa fa-minus"></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm text-center border-0"
                            value={item.quantity}
                            readOnly
                          />
                          <div className="input-group-btn">
                            <button
                              onClick={() => handleIncrease(item.id)}
                              className="btn btn-sm btn-plus rounded-circle bg-light border"
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.product.price * item.quantity)}
                        </p>
                      </td>
                      <td>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="btn btn-md rounded-circle bg-light border mt-4"
                        >
                          <i className="fa fa-times text-danger"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <input
              type="text"
              className="border-0 border-bottom rounded me-5 py-3 mb-4"
              placeholder="Coupon Code"
            />
            <button
              className="btn border-secondary rounded-pill px-4 py-3 text-primary"
              type="button"
            >
              Apply Coupon
            </button>
          </div>
          <div className="row g-4 justify-content-end">
            <div className="col-8"></div>
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
              <div className="bg-light rounded">
                <div className="p-4">
                  <h1 className="display-6 mb-4">
                    Cart <span className="fw-normal">Total</span>
                  </h1>
                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="mb-0 me-4">Subtotal:</h5>
                    <p className="mb-0">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(subtotal.toFixed(2))}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-0 me-4">Shipping</h5>
                    <div className="">
                      <p className="mb-0">
                        Flat rate:
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(flatRate.toFixed(2))}
                      </p>
                    </div>
                  </div>
                  <p className="mb-0 text-end">Shipping to Ukraine.</p>
                </div>
                <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                  <h5 className="mb-0 ps-4 me-4">Total</h5>
                  <p className="mb-0 pe-4">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(total.toFixed(2))}
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  // onClick={() => navigate("/checkout")}
                  className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                  type="button"
                >
                  Proceed Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;