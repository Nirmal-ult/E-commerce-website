import React from 'react';
import { useCart } from '../Context/CartContext';
import './wishlist.css'
import { useNavigate } from 'react-router-dom';
const WishList = () => {
  const { wishlistItems, removeFromWishlist } = useCart();
  const navigate = useNavigate();

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div>
           <p>Your wishlist is empty.</p>
          <a onClick={()=>navigate()} className="shop-link">← Start Shopping</a>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div className="wishlist-item" key={item.id}>
              <img src={item.image} alt={item.title} />
              <h4>{item.title}</h4>
              <p>${item.price.toLocaleString()}</p>
              <button onClick={() => removeFromWishlist(item.id)} className="remove-btn">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
