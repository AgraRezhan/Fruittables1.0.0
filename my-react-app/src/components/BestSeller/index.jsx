import { useNavigate } from "react-router-dom";
import useProductStore from "../../store/useProductStore";
import { useEffect } from "react";


const index = () => {


  const { user, productDesc,  fetchProductDescs, addCartItem } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Panggil fungsi  fetchProductDescs untuk mengambil data produk saat komponen di-mount
     fetchProductDescs();
  }, [ fetchProductDescs]);

  console.log("ini sold", productDesc);

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
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
            <h1 className="display-4">Bestseller Products</h1>
            <p>
              Latin words, combined with a handful of model sentence structures,
              to generate Lorem Ipsum which looks reasonable.
            </p>
          </div>
          <div className="row g-4">
            
            {productDesc && productDesc.map((product) => (
              <div className="col-lg-6 col-xl-4">
              <div className="p-4 rounded bg-light">
              <div className="row align-items-center">
                <div className="col-6">
                  <img
                    src={product.img_url}
                    className="img-fluid rounded-circle w-100"
                    alt=""
                  />
                </div>
                <div className="col-6">
                  <a href="#" className="h5">
                    {product.title}
                  </a>
                  <div className="d-flex my-3">
                    <i className="fas fa-star text-primary"></i>
                    <i className="fas fa-star text-primary"></i>
                    <i className="fas fa-star text-primary"></i>
                    <i className="fas fa-star text-primary"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <h4 className="mb-3">{product.price}</h4>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn border border-secondary rounded-pill px-3 text-primary"
                  >
                    <i className="fa fa-shopping-bag me-2 text-primary"></i>{" "}
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
            </div>
            
            ))}

          </div>
        </div>
      </div>

      <div className="container-fluid py-5">
        <div className="container">
          <div className="bg-light p-5 rounded">
            <div className="row g-4 justify-content-center">
              <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="counter bg-white rounded p-5">
                  <i className="fa fa-users text-secondary"></i>
                  <h4>satisfied customers</h4>
                  <h1>1963</h1>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="counter bg-white rounded p-5">
                  <i className="fa fa-users text-secondary"></i>
                  <h4>quality of service</h4>
                  <h1>99%</h1>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="counter bg-white rounded p-5">
                  <i className="fa fa-users text-secondary"></i>
                  <h4>quality certificates</h4>
                  <h1>33</h1>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="counter bg-white rounded p-5">
                  <i className="fa fa-users text-secondary"></i>
                  <h4>Available Products</h4>
                  <h1>789</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
