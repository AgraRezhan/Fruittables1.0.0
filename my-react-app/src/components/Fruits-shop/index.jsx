import image1 from "../../assets/image/fruite-item-5.jpg";
import image2 from "../../assets/image/fruite-item-2.jpg";
import useProductStore from "../../store/useProductStore";
import { useEffect } from "react";
import { Button } from "bootstrap";
import { useNavigate } from "react-router-dom";
import "./style.css"

const Index = () => {
  const { user, productItems, fetchProducts, addCartItem } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Panggil fungsi fetchProducts untuk mengambil data produk saat komponen di-mount
    fetchProducts();
  }, [fetchProducts]);

  console.log("ini user", user);

  const handleAddToCart = (product) => {
    console.log("product", product)
    if (product.stock <= 0) {
      alert("produk tidak mencukupi")
    } else if(product && product.id) {
      addCartItem(product);
      alert("produk berhasil ditambahkan")
      // navigate("/cart")
    }else{
      console.error("Invalid product:", product);
    }
  };

  return (
    <>
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <div className="tab-className text-center">
            <div className="row g-4">
              <div className="col-lg-4 text-start">
                <h1>Our Organic Products</h1>
              </div>
              <div className="col-lg-8 text-end">
                <ul className="nav nav-pills d-inline-flex text-center mb-5">
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
                </ul>
              </div>
            </div>
            <div className="tab-content">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="row g-4">
                      {productItems &&
                        productItems.map((product) => (
                          <div className="col-md-6 col-lg-4 col-xl-3" key={product.id}>
                            <div className="rounded position-relative fruite-product border border-secondary">
                              <div className="fruite-img">
                                <button
                                  onClick={() =>
                                    navigate(`/detail/${product.id}`)
                                  }
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
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    href="#"
                                    className="btn border border-secondary rounded-pill px-3 text-primary"
                                  >
                                    <i className="fa fa-shopping-bag me-2 text-primary"></i>
                                    Add to cart
                                  </button>
                                </div>
                                <p className="text-dark fs-5 mb-0 text-end">
                                  Stock : {product.stock}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid service py-5">
        <div className="container py-5">
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4">
              <a href="#">
                <div className="service-item bg-secondary rounded border border-secondary">
                  <img
                    src={image1}
                    className="img-fluid rounded-top w-100"
                    alt=""
                  />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-primary text-center p-4 rounded">
                      <h5 className="text-white">Fresh Apples</h5>
                      <h3 className="mb-0">20% OFF</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4">
              <a href="#">
                <div className="service-item bg-dark rounded border border-dark">
                  <img
                    src={image1}
                    className="img-fluid rounded-top w-100"
                    alt=""
                  />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-light text-center p-4 rounded">
                      <h5 className="text-primary">Tasty Fruits</h5>
                      <h3 className="mb-0">Free delivery</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4">
              <a href="#">
                <div className="service-item bg-primary rounded border border-primary">
                  <img
                    src={image1}
                    className="img-fluid rounded-top w-100"
                    alt=""
                  />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-secondary text-center p-4 rounded">
                      <h5 className="text-white">Exotic Vegetable</h5>
                      <h3 className="mb-0">Discount 30$</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
