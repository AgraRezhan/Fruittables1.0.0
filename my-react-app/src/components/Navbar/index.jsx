<link href="css/style.css" rel="stylesheet" />;

import "../../../../Front-End/css/bootstrap.min.css";

import "../../../../Front-End/lib/lightbox/css/lightbox.min.css";
import "../../../../Front-End/lib/owlcarousel/assets/owl.carousel.min.css";
import "../../../../Front-End/css/style.css";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import useProductStore from "../../store/useProductStore";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"
const index = () => {

  const[show, setShow] = useState(false)
  const { fetchCarts, cartItems, logout } = useProductStore();
  const navigate = useNavigate()

  useEffect(() => {
    fetchCarts()
  },[fetchCarts])

  const handleLogout = () => {
    logout();
    navigate("/")
  };

  const handleClick = () => {
    setShow(prevShow => !prevShow); // Menggunakan toggle untuk menampilkan/menyembunyikan komponen "ini click"
  };
  

  return (
    <>
      {/* <div className="container-fluid "> */}
      <div className="container px-0">
        <div className="container d-none d-lg-block">
          <div className="d-flex justify-content-between align-items-center top ">
            <div className="top-info ps-2">
              <small className="me-3">
                <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                <a href="#" className="text-white">
                  123 Street, New York
                </a>
              </small>
              <small className="me-3">
                <i className="fas fa-envelope me-2 text-secondary"></i>
                <a href="#" className="text-white">
                  Email@Example.com
                </a>
              </small>
            </div>
            <div className="top-link pe-2">
              <a href="#" className="text-white">
                <small className="text-white mx-2">Privacy Policy</small>/
              </a>
              <a href="#" className="text-white">
                <small className="text-white mx-2">Terms of Use</small>/
              </a>
              <a href="#" className="text-white">
                <small className="text-white ms-2">Sales and Refunds</small>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-0 containerpx-0">
        <nav className="navbar navbar-light bg-white navbar-expand-xl">
          <a href="index.html" className="navbar-brand">
            <h1 className="text-primary display-6">Fruitables</h1>
          </a>
          <button
            className="navbar-toggler py-2 px-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-primary"></span>
          </button>
          <div
            className="collapse navbar-collapse bg-white"
            id="navbarCollapse"
          >
            <div className="navbar-nav mx-auto">
              <Link to={"/home"} className="nav-item nav-link active">
                Home
              </Link>
              <Link to={"/shop"} className="nav-item nav-link">
                Shop
              </Link>
              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Pages
                </a>
                <div className="dropdown-menu m-0 bg-secondary rounded-0">
                  <Link to={"/cart"} className="dropdown-item">
                    Cart
                  </Link>
                  <a href="#testimonial" className="dropdown-item">
                    Testimonial
                  </a>
                </div>
              </div>
              <a href="#contact" className="nav-item nav-link">
                Contact
              </a>
            </div>
            <div className="d-flex m-3 me-0">
            {
                show && <input
                className="form-control border-2 border-secondary w-50  px-4 rounded-pill"
                type="text"
                placeholder="Search"
              />
              }
              <button
              onClick={handleClick}
                className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
              >
                <i className="fas fa-search primary-color"></i>
              </button>
             
              
              <Link to="/cart" className="position-relative me-4 my-auto">
                <i className="fa fa-shopping-bag fa-2x primary-color"></i>
                <span
                  className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                  style={{ top: -5, left: 15, height: 20, minWidth: 20 }}
                >
                  {cartItems.length}
                </span>
              </Link>
              <a href="#" className="my-auto">
                <i className="fas fa-user fa-2x primary-color"></i>
              </a>
              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle mt-3 ms-2"
                  data-bs-toggle="dropdown"
                ></a>
                <div className="dropdown-menu m-0 bg-secondary rounded-0">
                  <button 
                  onClick={handleLogout}
                  className="w-100 border-success">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default index;
