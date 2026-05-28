'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartAction, setCartAction] = useState(null); // To track cart actions for toast notifications
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes and show toast notifications
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show toast notifications based on the last cart action
    if (cartAction) {
      switch (cartAction) {
        case 'added':
          toast.success('Added to cart!');
          break;
        case 'updated':
          toast.success('Cart updated!');
          break;
        case 'removed':
          toast.success('Item removed from cart');
          break;
        case 'cleared':
          toast.success('Cart cleared');
          break;
      }
      
      // Reset the cart action
      setCartAction(null);
    }
  }, [cart, cartAction]);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const toggleCart = () => setCartOpen(prev => !prev);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCart(prevCart => {
      // Check if product is already in cart
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product._id && 
        (selectedVariant ? item.variant?._id === selectedVariant._id : !item.variant)
      );

      // If product is already in cart, update quantity
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCartAction('updated');
        return updatedCart;
      }

      // Otherwise, add new item to cart
      setCartAction('added');
      return [...prevCart, {
        id: product._id,
        name: product.name,
        price: selectedVariant ? selectedVariant.price : product.price,
        image: product.images[0],
        quantity,
        variant: selectedVariant || null
      }];
    });
  };

  const removeFromCart = (itemId, variantId = null, grams = null) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => {
        if (item.id !== itemId) return true;
        // If variantId is provided and both variants have _id, compare _id
        if (variantId && item.variant && item.variant._id) {
          return item.variant._id !== variantId;
        }
        // If grams is provided, compare grams
        if (grams && item.variant && item.variant.grams) {
          return item.variant.grams !== grams;
        }
        // If no variant, remove if item.variant is falsy
        if (!variantId && !grams && !item.variant) {
          return false;
        }
        // Otherwise, keep item
        return true;
      });
      setCartAction('removed');
      return updatedCart;
    });
  };

  const updateQuantity = (itemId, quantity, variantId = null) => {
    if (quantity < 1) return;
    
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId && 
          (variantId ? item.variant?._id === variantId : !item.variant)) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartAction('cleared');
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const cartItemsCount = cart.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      cartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
}
