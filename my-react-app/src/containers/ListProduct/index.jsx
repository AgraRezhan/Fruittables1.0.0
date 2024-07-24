import Navbar from "../../components/NavbarSeller";
import Footer from "../../components/Footer";
import useProductStore from "../../store/useProductStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const index = () => {
  const { productSeller, fetchProductSeller, addCartItem, deleteProduct } =
    useProductStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Panggil fungsi fetchProducts untuk mengambil data produk saat komponen di-mount
    fetchProductSeller();
  }, [fetchProductSeller]);

  const handleDelete = (productId) => {
    deleteProduct(productId);
    alert("Produk berhasil dihapus")
  }

  console.log("ini produk tanpa user", productSeller);

  return (
    <>
      <Navbar />
      <div className="tab-content container mt-3 mb-3">
      <div className=" text-end">
                <ul className="nav nav-pills text-center mb-5">
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 bg-light rounded-pill active"
                      data-bs-toggle="pill"
                      href="#tab-1"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        All Products
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex py-2 m-2 bg-light rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-2"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Vegetables
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 bg-light rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-3"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Fruits
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 bg-light rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-4"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Bread
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 bg-light rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-5"
                    >
                      <span className="text-dark" style={{ width: 130 }}>
                        Meat
                      </span>
                    </a>
                  </li>
                  <div
                  className="d-flex justify-content-end w-25">
                    <button
                    onClick={() => navigate("/addproduct")}
                    className="bg-success p-3 fs-5"
                  >Add +</button>
                  </div>
                </ul>
              </div>
        <div id="tab-1" className="tab-pane fade show p-0 active">
          <div className="row g-4">
            <div className="col-lg-12">
              <div className="row g-4">
                {productSeller.length > 0 ? (
                  productSeller.map((product) => (
                    <div
                      className="col-md-6 col-lg-4 col-xl-3"
                      key={product.id}
                    >
                      <div className="rounded position-relative fruite-product border border-secondary">
                        <div className="fruite-img">
                          <button
                            onClick={() => navigate(`/detail/${product.id}`)}
                          >
                            <img
                              src={product.img_url}
                              className="img-fluid w-100 rounded-top"
                              alt=""
                            />
                          </button>
                        </div>
                        <div
                          className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                          style={{ top: 10, left: 10 }}
                        >
                          Fruits
                        </div>
                        <div className="p-4 fruite-product-content border-top-0 rounded-bottom">
                          <h4>{product.title}</h4>
                          <p>{product.description}</p>
                          <div className="fruite-product-footer">
                            <p className="text-dark fs-5 fw-bold mb-0">
                              {product.price} / kg
                            </p>
                          </div>
                          <p className="text-dark fs-5 mb-0 text-end">
                            Stock : {product.stock}
                          </p>
                        </div>
                        <div className="d-flex justify-content-center">
                          <button
                          onClick={() => handleDelete(product.id)}
                            style={{width: "35%"}}
                            className="btn border border-secondary rounded-pill px-3 text-primary ms-2 me-2 mb-3"
                          >
                            <i class="fa-solid fa-trash-can text-danger fs-3"></i>
                            
                          </button>
                          <button
                            onClick={() => navigate(`/updateproduct/${product.id}`)}
                            style={{width: "35%"}}
                            className="btn border border-secondary rounded-pill px-3 text-primary ms-2 me-2 mb-3"
                          >
                            <i class="fa-solid fa-pen-to-square text-success fs-3"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <h2 className="d-flex justify-content-center mt-3 mb-3">
                      Data tidak ditemukan
                    </h2>
                  </>
                )}
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
