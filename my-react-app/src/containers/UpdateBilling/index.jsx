import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import useProductStore from "../../store/useProductStore";


const Index = () => {
    const [company_name, setCompany_name] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postcode, setPostcode] = useState("");
    const [mobile, setMobile] = useState("");
    const [payment_method, setPayment_method] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const { id } = useParams(); // orderId dari URL
    const { fetchShippingByOrderId, updateShipping, fetchOrderById } = useProductStore();
    const navigate = useNavigate();
  
    useEffect(() => {
      // Ambil data pengiriman dan pesanan berdasarkan orderId saat komponen dimuat
      const fetchShippingData = async () => {
        try {
          // Mengambil data pengiriman
          const shippingData = await fetchShippingByOrderId(id);
          if (shippingData) {
            setCompany_name(shippingData.company_name || "");
            setAddress(shippingData.address || "");
            setCity(shippingData.city || "");
            setPostcode(shippingData.postcode || "");
            setMobile(shippingData.mobile || "");
            setPayment_method(shippingData.payment_method || "");
          } else {
            setError("No shipping data found");
          }
  
            
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data");
        }
      };
  
      fetchShippingData();
    }, [id, fetchShippingByOrderId, fetchOrderById]);
  
    const handlePaymentChange = (e) => {
      setPayment_method(e.target.value);
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
  
      if (isSubmitting) return;
      setIsSubmitting(true);
  
      const shippingData = {
        company_name,
        address,
        city,
        postcode,
        mobile,
        payment_method,
      };
  
      try {
        // Mengambil data pesanan (optional, jika diperlukan)
        const orderData = await fetchOrderById(id);
        console.log("Order data:", orderData.data.status);
        const data = orderData.data.status;
        // Jika ada data pesanan tambahan yang diperlukan, perbarui state di sini
        if(data == "cancelled"){
            alert("anda tidak dapat melakukan update data karena telah dilakukan pembatalan order")
            navigate(-1);
        }else{
            await updateShipping(id, shippingData, setError); // Pass orderId and shippingData
            navigate(-1);
        }
      } catch (error) {
        console.error("Error sending data:", error);
        setError("Failed to update shipping");
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
            <h1 className="mb-4 text-center">Billing details</h1>
            <form onSubmit={handleUpdate}>
              <div className="row g-5 d-flex justify-content-center">
                <div className="w-50">
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
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="TermsConditions"
                      required
                    />
                    <label className="form-check-label" htmlFor="TermsConditions">
                      I have read and agree to the terms and conditions
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating Shipping..." : "Save"}
                  </button>
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
  