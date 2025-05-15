import React, { useContext } from 'react';
import { FaShoppingCart, FaHome } from 'react-icons/fa';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { CartContext } from '../Context/CartContext';
import './Home.css';

const Home = ({ setCurrentUser }) => {
  const { cartItems, wishlistItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <>
      <nav className='home-header'>
        <ul>
          <Link to='/products'>
            <li>Products</li>
          </Link>
        </ul>
        <div className='home-wishlist'>
          <Link to='/wishlist'>
            <p>Wishlist ({wishlistItems.length})</p>
          </Link>
          <Link to='/cart'>
            <div className='home-nav'>
              <FaShoppingCart style={{ marginRight: '5px', color: 'white', fontSize: '26px', cursor: 'pointer' }} />
              <p>Cart ({cartItems.length})</p>
            </div>
          </Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Home;
