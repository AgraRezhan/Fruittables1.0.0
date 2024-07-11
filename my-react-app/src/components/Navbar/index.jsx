<link href="css/style.css" rel="stylesheet" />

import "../../../../Front-End/css/bootstrap.min.css"

import "../../../../Front-End/lib/lightbox/css/lightbox.min.css"
import "../../../../Front-End/lib/owlcarousel/assets/owl.carousel.min.css"
import "../../../../Front-End/css/style.css"
import "./style.css"
import { Link } from "react-router-dom"
import useProductStore from "../../store/useProductStore"
// import { useNavigate } from "react-router-dom"
const index = () => {

  const { cartItems } = useProductStore();

    return(
        <>
        {/* <div class="container-fluid "> */}
        <div className="container px-0">
        <div dclass="container d-none d-lg-block">
            <div class="d-flex justify-content-between align-items-center top " >
              <div class="top-info ps-2">
                <small class="me-3"
                  ><i class="fas fa-map-marker-alt me-2 text-secondary"></i>
                  <a href="#" class="text-white">123 Street, New York</a></small
                >
                <small class="me-3"
                  ><i class="fas fa-envelope me-2 text-secondary"></i
                  ><a href="#" class="text-white">Email@Example.com</a></small
                >
              </div>
              <div class="top-link pe-2">
                <a href="#" class="text-white"
                  ><small class="text-white mx-2">Privacy Policy</small>/</a
                >
                <a href="#" class="text-white"
                  ><small class="text-white mx-2">Terms of Use</small>/</a
                >
                <a href="#" class="text-white"
                  ><small class="text-white ms-2">Sales and Refunds</small></a
                >
              </div>
            </div>
          </div>
        </div>
          
          <div class="container px-0 containerpx-0">
            <nav class="navbar navbar-light bg-white navbar-expand-xl">
              <a href="index.html" class="navbar-brand"
                ><h1 class="text-primary display-6">Fruitables</h1></a
              >
              <button
                class="navbar-toggler py-2 px-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
              >
                <span class="fa fa-bars text-primary"></span>
              </button>
              <div class="collapse navbar-collapse bg-white" id="navbarCollapse">
                <div class="navbar-nav mx-auto">
                  <Link to={'/home'} class="nav-item nav-link active">Home</Link>
                  <Link to={'/shop'} class="nav-item nav-link">Shop</Link>
                  <Link to={'/detail'} class="nav-item nav-link"
                    >Shop Detail</Link>
                  <div class="nav-item dropdown">
                    <a
                      href="#"
                      class="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                      >Pages</a>
                    <div class="dropdown-menu m-0 bg-secondary rounded-0">
                      <Link to={'/cart'} class="dropdown-item">Cart</Link>
                      <Link to={'/checkout'} class="dropdown-item">Chackout</Link>
                      <Link to={'/testimoni'} class="dropdown-item"
                        >Testimonial</Link>
                      <Link href="404.html" class="dropdown-item">404 Page</Link>
                    </div>
                  </div>
                  <a href="contact.html" class="nav-item nav-link">Contact</a>
                </div>
                <div class="d-flex m-3 me-0">
                  <button
                    class="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                    data-bs-toggle="modal"
                    data-bs-target="#searchModal"
                  >
                    <i class="fas fa-search primary-color"></i>
                  </button>
                  <a href="#" class="position-relative me-4 my-auto">
                    <i class="fa fa-shopping-bag fa-2x primary-color"></i>
                    <span
                      class="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                      style={{top: -5, left: 15, height: 20,minWidth: 20}}>{cartItems.length}</span>
                  </a>
                  <a href="#" class="my-auto">
                    <i class="fas fa-user fa-2x primary-color"></i>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        {/* </div> */}
        </>
    )
}

export default index;