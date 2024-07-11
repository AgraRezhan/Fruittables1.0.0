import React, { useEffect } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useCartStore from '../../store/useCartStore';

const index = () => {
  const { cartItems, fetchCarts, removeCartItem } = useCartStore();
  const flatRate = 3000; // Flat rate untuk shipping

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  // Hitung subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  // Hitung total dengan mengurangi flat rate dari subtotal
  const total = subtotal + flatRate;

  console.log("ini carts", cartItems);

  const onRemoveItem = (productId) => {
      removeCartItem(productId);
    
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
                {cartItems && cartItems.map((item) => (
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
                      <p className="mb-0 mt-4">{item.product.title}</p>
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
                          <button className="btn btn-sm btn-minus rounded-circle bg-light border">
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
                          <button className="btn btn-sm btn-plus rounded-circle bg-light border">
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
                      onClick={() => onRemoveItem(item.product.id)}
                      className="btn btn-md rounded-circle bg-light border mt-4">
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
                      <p className="mb-0">Flat rate: 
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

export default index;
