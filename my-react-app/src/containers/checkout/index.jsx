import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import useProductStore from "../../store/useProductStore";

const Index = () => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [company_name, setCompany_name] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [img_payment, setImg_payment] = useState("");
  const [note, setNote] = useState("");
  const [payment_method, setPayment_method] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cartItems, fetchCarts, createOrder } = useProductStore();

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const navigate = useNavigate();

  const [shippingOptions, setShippingOptions] = useState({
    freeShipping: false,
    flatRate: false,
    localPickup: false,
  });

  const handleShippingChange = (e) => {
    const { name, checked } = e.target;
    setShippingOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePaymentChange = (e) => {
    setPayment_method(e.target.value);
  };

  const flatRate = 15000;
  const localPickup = 25000;
  const freeShipping = 0;

  const subtotal = cartItems.reduce(
    (acc, product) => acc + product.quantity * product.product.price,
    0
  );
  const totalShippingCost =
    (shippingOptions.freeShipping ? freeShipping : 0) +
    (shippingOptions.flatRate ? flatRate : 0) +
    (shippingOptions.localPickup ? localPickup : 0);
  const totalShipping = subtotal + totalShippingCost;

  // console.log("total keseluruhan", totalShipping)
  const handleCreate = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const orderData = {
      items: cartItems,
      total: totalShipping,
      payment_method: payment_method,
      shipping: {
        company_name,
        address,
        city,
        postcode,
        mobile,
        img_payment,
        note,
        payment_method,
        total: totalShipping,
      },
    };

    try {
      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].product.stock < cartItems[i].quantity) {
          alert(`Stok produk ${cartItems[i].product.title} tidak mencukupi!`);
          return; // Hentikan proses jika stok tidak mencukupi
        }
      }
      await createOrder(orderData, navigate, setError);
      // console.log("Order and shipping created successfully: ", { orderData });

      navigate("/shop");
    } catch (error) {
      console.error("Error sending data:", error);
      setError("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <>
      <Navbar />
      <div className="container-fluid py-5">
        <div className="container py-5">
          {error && <p className="text-danger">{error}</p>}
          <h1 className="mb-4">Billing details</h1>
          <form onSubmit={handleCreate}>
            <div className="row g-5">
              <div className="col-md-12 col-lg-6">
                <div className="form-item">
                  <label className="form-label my-3">
                    Company Name<sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={company_name}
                    onChange={(e) => setCompany_name(e.target.value)}
                    required
                  />
                </div>
                <div className="form-item">
                  <label className="form-label my-3">
                    Address <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="House Number Street Name"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="form-item">
                  <label className="form-label my-3">
                    Town/City<sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-item">
                  <label className="form-label my-3">
                    Postcode/Zip<sup>*</sup>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-item">
                  <label className="form-label my-3">
                    Mobile<sup>*</sup>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-item">
                  <label className="form-label my-3">
                    Image of payment proof URL<sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={img_payment}
                    onChange={(e) => setImg_payment(e.target.value)}
                    required
                  />
                </div>
                <div className="form-check my-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="Account-1"
                    name="Accounts"
                    value="Accounts"
                  />
                  <label className="form-check-label" htmlFor="Account-1">
                    Create an account?
                  </label>
                </div>
                <hr />
                <div className="form-check my-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="Address-1"
                    name="Address"
                    value="Address"
                  />
                  <label className="form-check-label" htmlFor="Address-1">
                    Ship to a different address?
                  </label>
                </div>
                <div className="form-item">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                    name="text"
                    className="form-control"
                    spellCheck="false"
                    cols="30"
                    rows="11"
                    placeholder="Order Notes (Optional)"
                  ></textarea>
                </div>
              </div>
              <div className="col-md-12 col-lg-6 col-xl-5">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Products</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems &&
                        cartItems.map((product) => (
                          <tr key={product.product.id}>
                            <th scope="row">
                              <div className="d-flex align-items-center mt-2">
                                <img
                                  src={product.product.img_url}
                                  className="img-fluid rounded-circle"
                                  style={{ width: 90, height: 90 }}
                                  alt=""
                                />
                              </div>
                            </th>
                            <td className="text-capitalize ">
                              {product.product.title}
                            </td>
                            <td>
                              <i className="fa-solid fa-indian-rupee-sign"></i>
                              {product.product.price}
                            </td>
                            <td>{product.quantity}</td>
                            <td>
                              <i className="fa-solid fa-indian-rupee-sign"></i>
                              {product.quantity * product.product.price}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td colSpan="4">Subtotal:</td>
                        <td>{subtotal}</td>
                      </tr>
                      <tr>
                        <td colSpan="4">Shipping:</td>
                        <td>{totalShippingCost}</td>
                      </tr>
                      <tr>
                        <td colSpan="4">Total:</td>
                        <td>{totalShipping}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="FreeShipping"
                      name="freeShipping"
                      checked={shippingOptions.freeShipping}
                      onChange={handleShippingChange}
                    />
                    <label className="form-check-label" htmlFor="FreeShipping">
                      Free Shipping
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="FlatRate"
                      name="flatRate"
                      checked={shippingOptions.flatRate}
                      onChange={handleShippingChange}
                    />
                    <label className="form-check-label" htmlFor="FlatRate">
                      Flat Rate: $15.00
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="LocalPickup"
                      name="localPickup"
                      checked={shippingOptions.localPickup}
                      onChange={handleShippingChange}
                    />
                    <label className="form-check-label" htmlFor="LocalPickup">
                      Local Pickup: $25.00
                    </label>
                  </div>
                  <hr />
                  <h5 className="mb-4">Payment</h5>
                  <div className="form-check text-start my-3">
                    <input
                      type="radio"
                      className="form-check-input bg-primary border-0"
                      id="Transfer-1"
                      name="payment_method"
                      value="Transfer"
                      checked={payment_method === "Transfer"}
                      onChange={handlePaymentChange}
                    />
                    <label className="form-check-label" htmlFor="Transfer-1">
                      Direct Bank Transfer
                    </label>
                  </div>
                  <p className="text-start text-dark">
                    Make your payment directly into our bank account. Please use
                    your Order ID as the payment reference. Your order will not
                    be shipped until the funds have cleared in our account.
                  </p>
                  <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                    <div className="col-12">
                      <div className="form-check text-start my-3">
                        <input
                          type="radio"
                          className="form-check-input bg-primary border-0"
                          id="Payments-1"
                          name="payment_method"
                          value="Check Payments"
                          checked={payment_method === "Check Payments"}
                          onChange={handlePaymentChange}
                        />
                        <label className="form-check-label" htmlFor="Payments-1">
                          Check Payments
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                    <div className="col-12">
                      <div className="form-check text-start my-3">
                        <input
                          type="radio"
                          className="form-check-input bg-primary border-0"
                          id="Delivery-1"
                          name="payment_method"
                          value="Cash On Delivery"
                          checked={payment_method === "Cash On Delivery"}
                          onChange={handlePaymentChange}
                        />
                        <label className="form-check-label" htmlFor="Delivery-1">
                          Cash On Delivery
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="TermsConditions"
                      required
                    />
                    <label
                      className="form-check-label"
                      htmlFor="TermsConditions"
                    >
                      I have read and agree to the terms and conditions
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 
                    <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Placing Order...</span>
                  </div>
                     : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
