import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar  } from 'react-icons/fa';
import { useCart } from '../Context/CartContext';
import axios from 'axios';
import './AddProduct.css';

const getRandomFutureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toDateString();
};

const ProductList = () => {
  const { products, setProducts } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',  
    price: '',
    rating: '',
    image: '',
    delivery: { free: '', fast: '' },
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  const renderStars = (rating) => {
  const safeRating = Math.min(Math.max(rating, 0), 5); // Clamp rating between 0 and 5
  const fullStars = Math.floor(safeRating);
  const halfStar = safeRating % 1 !== 0;
  const totalDisplayed = halfStar ? fullStars + 1 : fullStars;
  const emptyStars = 5 - totalDisplayed;

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} style={{ color: 'orange' }} />
      ))}
      {halfStar && <FaStarHalfAlt key="half" style={{ color: 'orange' }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} style={{ color: 'orange' }} />
      ))}
    </>
  );
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'free' || name === 'fast') {
      setNewProduct((prev) => ({
        ...prev,
        delivery: { ...prev.delivery, [name]: value },
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleAddOrUpdateProduct = async () => {
  const product = {
    ...newProduct,
    price: parseFloat(newProduct.price),
    rating: parseFloat(newProduct.rating),
    delivery: {
      free: getRandomFutureDate(5 + Math.floor(Math.random() * 5)),
      fast: getRandomFutureDate(1 + Math.floor(Math.random() * 2)),
    },
  };

  try {
    if (isUpdate) {

      await axios.put(`http://localhost:4000/ProductList/${currentProductId}`, product);
      setProducts(products.map((p) => (p.id === currentProductId ? { ...product, id: currentProductId } : p)));
    } else {
      const newId = String(products.length + 1); 
      await axios.post('http://localhost:4000/ProductList', { ...product, id: newId });
      setProducts([...products, { ...product, id: newId }]);
    }

    const res = await axios.get('http://localhost:4000/ProductList');
    setProducts(res.data || []);

    handleCancel(); 
  } catch (err) {
    console.error('Failed to add/update product:', err);
    alert('Error adding/updating product. Please try again.');
  }
};


const handleRemoveProduct = async (productId) => {
  try {
    await axios.delete(`http://localhost:4000/ProductList/${productId}`);
    setProducts(products.filter((product) => String(product.id) !== String(productId)));  // Ensure IDs are compared as strings
  } catch (err) {
    console.error('Failed to delete product:', err);
    alert('Error deleting product. Please try again.');
  }
};


 const handleEditProduct = (product) => {
  setIsUpdate(true);
  setCurrentProductId(product.id);  
  setNewProduct({
    title: product.title,
    price: product.price,
    rating: product.rating,
    image: product.image,
    delivery: { free: product.delivery.free, fast: product.delivery.fast },
  });
  setShowModal(true);
};


  const handleCancel = () => {
    setShowModal(false);
    setNewProduct({
      title: '',
      price: '',
      rating: '',
      image: '',
      delivery: { free: '', fast: '' },
    });
    setIsUpdate(false);
    setCurrentProductId(null); 
  };

  return (
    <>
    <div className="products-page">
     
      <div className="products">
        {products.map((product) => (
          <div className="cart-product" key={product.id}>
            <img src={product.image} alt={product.title} />
            <div className="product-content">
              <p>{product.title}</p>
              <div>{renderStars(product.rating)}</div>
              <h4>${product.price.toLocaleString()}</h4>
              <p>Free delivery by {product.delivery.free}</p>
              <p>Or fastest delivery: {product.delivery.fast}</p>
              <button className="remove-button" onClick={() => handleRemoveProduct(product.id)}>
                Remove Product
              </button>
              <button className="update-button" onClick={() => handleEditProduct(product)}>
                Edit Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div>
       <button className="add-button" onClick={() => setShowModal(true)}>
        + Add Product
      </button>
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2 className="modal-title">{isUpdate ? 'Update Product' : 'Add New Product'}</h2>

      {/* Product Title Input */}
      <div className="modal-field">
        <input
          className="modal-input"
          name="title"
          value={newProduct.title}
          onChange={handleInputChange}
          placeholder="Product Title"
          type="text"
        />
      </div>

      {/* Price Input */}
      <div className="modal-field">
        <input
          className="modal-input"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
          type="number"
        />
      </div>

      {/* Rating Input */}
      <div className="modal-field">
        <input
          className="modal-input"
          name="rating"
          value={newProduct.rating}
          onChange={handleInputChange}
          placeholder="Rating (0-5)"
          type="number"
          step="0.5"
        />
      </div>

      {/* Image URL Input */}
      <div className="modal-field">
        <input
          className="modal-input"
          name="image"
          value={newProduct.image}
          onChange={handleInputChange}
          placeholder="Image URL or File Name"
          type="text"
        />
      </div>

      {/* Image Preview */}
      {newProduct.image && (
        <div className="image-preview">
          <p>Image Preview:</p>
          <img className="preview-img" src={newProduct.image} alt="Preview" />
        </div>
      )}

      {/* File Upload Button */}
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setNewProduct((prev) => ({
                  ...prev,
                  image: reader.result,
                }));
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <button
          className="upload-btn"
          onClick={() => document.getElementById('image-upload').click()}
        >
          Upload Image from Device
        </button>
      </div>

      {/* Modal Action Buttons */}
      <div className="modal-buttons">
        <button className="modal-action" onClick={handleAddOrUpdateProduct}>
          {isUpdate ? 'Update' : 'Add'}
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  </>
  );
};

export default ProductList;
