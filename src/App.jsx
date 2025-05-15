import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './Context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Buyer/Home';
import Products from './Buyer/Products';
import Cart from './Buyer/Cart';
import WishList from './Buyer/WishList';

import DashBoard from './Seller/DashBoard';
import ProductList from './Seller/ProductList';

import Login from './Form/Login';
import Signup from './Form/Signup';
import ProtectedRoute from './Context/ProtectedRoute';

import ForgotPassword from './Form/ForgotPassword';
import VerifyCode from './Form/VerifyCode';
import ResetPassword from './Form/ResetPassword';

const App = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation()
   useEffect(() => {
        const allowedRoutes = ['/verify-code', '/reset-password'];
        if (!allowedRoutes.includes(location.pathname)) {
            localStorage.removeItem('resetCode');
            localStorage.removeItem('lastOtpRequest');
            localStorage.removeItem('resetVerified')
        }
    }, [location]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(storedUser);
  }, []);
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'currentUser' && event.newValue === null) {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  const role = currentUser?.role;

  return (
    <CartProvider>
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} />
        <Routes>
          <Route
            path="/"
            element={
              currentUser
                ? <Navigate to={role === 'buyer' ? '/products' : '/myproduct'} />
                : <Login setCurrentUser={setCurrentUser} />
            }
          />
          <Route
            path="/signup"
            element={
              currentUser
                ? <Navigate to={role === 'buyer' ? '/products' : '/myproduct'} />
                : <Signup />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            element={
              <ProtectedRoute user={currentUser} allowedRoles={['buyer']}>
                <Home setCurrentUser={setCurrentUser} />
              </ProtectedRoute>
            }
          >
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<WishList />} />
          </Route>

          <Route
            element={
              <ProtectedRoute user={currentUser} allowedRoles={['seller']}>
                <DashBoard setCurrentUser={setCurrentUser} />
              </ProtectedRoute>
            }
          >
            <Route path="/productlist" element={<ProductList />} />
          </Route>

          <Route
            path="*"
            element={
              currentUser
                ? <Navigate to={role === 'buyer' ? '/products' : '/productlist'} />
                : <Navigate to="/" />
            }
          />
        </Routes>
     
    </CartProvider>
  );
};

export default App;
