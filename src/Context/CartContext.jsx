import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:4000/ProductList');
        setProducts(res.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  

  useEffect(() => {
    if (currentUser?.email) {
      const savedCart = JSON.parse(localStorage.getItem(`cart_${currentUser.email}`)) || [];
      const savedWishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.email}`)) || [];
      setCartItems(savedCart);
      setWishlistItems(savedWishlist);
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [currentUser]);

  const persistData = (updatedCart, updatedWishlist) => {
    if (currentUser?.email) {
      localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(updatedCart));
      localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(updatedWishlist));
    }
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      persistData(updated, wishlistItems);
      return updated;
    });
    toast.success('Added to cart!');
  };

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      persistData(updated, wishlistItems);
      return updated;
    });
    toast.info('Removed from cart');
  };

  const increaseQuantity = (id) => {
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      persistData(updated, wishlistItems);
      return updated;
    });
  };

  const decreaseQuantity = (id) => {
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      );
      persistData(updated, wishlistItems);
      return updated;
    });
  };

  const addToWishlist = (product) => {
    const alreadyInWishlist = wishlistItems.some(item => item.id === product.id);
    if (!alreadyInWishlist) {
      const updated = [...wishlistItems, product];
      setWishlistItems(updated);
      persistData(cartItems, updated);
      toast.success('Added to wishlist!');
    } else {
      toast.warn('Product already in wishlist');
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      persistData(cartItems, updated);
      return updated;
    });
    toast.info('Removed from wishlist');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      wishlistItems,
      addToCart,
      addToWishlist,
      removeFromCart,
      removeFromWishlist,
      increaseQuantity,
      decreaseQuantity,
      products,
      setProducts,
      loading,
      error,
      currentUser,
      setCurrentUser
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
