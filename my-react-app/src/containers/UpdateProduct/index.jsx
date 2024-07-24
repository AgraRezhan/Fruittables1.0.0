import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/NavbarSeller";
import Footer from "../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import useProductStore from "../../store/useProductStore";

const Index = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [img_url, setImg_url] = useState("");
    const [imgPreview, setImgPreview] = useState(null); // State untuk URL pratinjau gambar
    const [stock, setStock] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false); // State untuk drag-and-drop
  
    const { id } = useParams(); // productId dari URL
    const { fetchProductById, updateProduct } = useProductStore();
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Reference to the hidden file input
  
    useEffect(() => {
      // Ambil data produk berdasarkan productId saat komponen dimuat
      const fetchProductData = async () => {
        try {
          const productData = await fetchProductById(id);
          console.log("Product data:", productData);
          if (productData) {
            setTitle(productData.title || "");
            setDescription(productData.description || "");
            setImg_url(productData.img_url || "");
            setStock(productData.stock || "");
            setImgPreview(productData.img_url || ""); // Set pratinjau gambar dari URL produk yang ada
          } else {
            setError("No Product data found");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data");
        }
      };
  
      fetchProductData();
    }, [id, fetchProductById]);
  
    const handleImageChange = (file) => {
      setImg_url(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result); // Set pratinjau gambar
      };
      reader.readAsDataURL(file);
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleImageChange(file);
      }
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImageChange(file);
      }
    };

    const handleClick = () => {
      fileInputRef.current.click(); // Click hidden file input when area is clicked
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
  
      if (isSubmitting) return;
      setIsSubmitting(true);
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("img_url", img_url);
      formData.append("stock", stock);
  
      try {
        await updateProduct(id, formData);
        navigate(-1);
      } catch (error) {
        console.error("Error sending data:", error);
        setError("Failed to update Product");
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
            <h1 className="mb-4 text-center">Edit Product</h1>
            <form onSubmit={handleUpdate}>
              <div className="row g-5 d-flex justify-content-center">
                <div className="w-50">
                  <div className="form-item">
                    <label className="form-label my-3">
                      Product Title<sup>*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-item">
                    <label className="form-label my-3">
                      Description <sup>*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-item">
                    <label className="form-label my-3">
                      Image<sup>*</sup>
                    </label>
                    <div
                      className={`form-control ${dragActive ? "drag-active" : ""}`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={handleClick} // Add onClick handler
                      style={{ cursor: "pointer" }} // Change cursor to pointer
                    >
                      <input
                        type="file"
                        className="d-none"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <p className="text-center my-3">
                        Drag & Drop your image here or click to upload
                      </p>
                    </div>
                    {imgPreview && (
                      <div className="mt-3">
                        <img
                          src={imgPreview}
                          alt="Image Preview"
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="form-item">
                    <label className="form-label my-3">
                      Stock<sup>*</sup>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary w-75 ms-2 me-2  mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating Product..." : "Save"}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger w-75 ms-2 me-2 mt-4"
                    onClick={() => navigate("/listproduct")}
                  >
                    Cancel
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
