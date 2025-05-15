import React, { useState } from 'react';
import './product.css';
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaRegStar } from 'react-icons/fa';
import { useCart } from '../Context/CartContext';

const Products = () => {
  const { addToCart, addToWishlist, products } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('default');

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
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

  // Create a new filtered and sorted array without mutating the original products array
  const filteredProducts = [...products]
    .filter((product) => product.rating >= minRating)
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') return a.price - b.price;
      if (sortOrder === 'highToLow') return b.price - a.price;
      return 0;
    });

  return (
    <div className='products-page'>
      {/* Sidebar */}
      <div className='sidebar'>
        <h3>Filter by Rating</h3>
        {[5, 4, 3, 2, 1].map(rating => (
          <label key={rating}>
            <input
              type='radio'
              name='rating'
              value={rating}
              checked={minRating === rating}
              onChange={(e) => setMinRating(Number(e.target.value))} // Update to number
            />
            {rating} Stars & up
          </label>
        ))}
        
        <h3>Sort by Price</h3>
        <label>
          <input
            type='radio'
            name='sortOrder'
            value='lowToHigh'
            checked={sortOrder === 'lowToHigh'}
            onChange={(e) => setSortOrder(e.target.value)} // Handle as a string
          />
          Low to High
        </label>
        <label>
          <input
            type='radio'
            name='sortOrder'
            value='highToLow'
            checked={sortOrder === 'highToLow'}
            onChange={(e) => setSortOrder(e.target.value)} // Handle as a string
          />
          High to Low
        </label>
        <button onClick={() => { setMinRating(0); setSortOrder('default'); }}>Clear Filters</button>
      </div>

      {/* Products Grid */}
      <div className={`products ${selectedProduct ? 'blurred' : ''}`}>
        {filteredProducts.map((product) => (
          <div
            className='cart-product'
            key={product.id} // Ensure the product ID is unique as the key
            onClick={() => setSelectedProduct(product)}
          >
            <img src={product.image} alt={product.title} />
            <div className='product-content'>
              <p>{product.title}</p>
              <div>{renderStars(product.rating)}</div>
              <h4>${product.price.toLocaleString()}</h4>
              <p>Free delivery by {product.delivery.free}</p>
              <p>Or fastest delivery: {product.delivery.fast}</p>
              <button onClick={(e) => { e.stopPropagation(); addToWishlist(product); }}>
                Add to wishlist
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              >
                Add to cart
                <FaShoppingCart style={{ marginLeft: '5px', color: 'white', fontSize: '18px' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedProduct.image} alt={selectedProduct.title} />
            <h2>{selectedProduct.title}</h2>
            <div>{renderStars(selectedProduct.rating)}</div>
            <h4>${selectedProduct.price.toLocaleString()}</h4>
            <p>Free delivery by {selectedProduct.delivery.free}</p>
            <p>Or fastest delivery: {selectedProduct.delivery.fast}</p>
            <button onClick={() => { addToWishlist(selectedProduct); setSelectedProduct(null); }}>
              Add to wishlist
            </button>
            <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
              Add to cart
            </button>
            <button className="close-button" onClick={() => setSelectedProduct(null)}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
