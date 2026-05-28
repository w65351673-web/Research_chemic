'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  cart: {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.id === newItem.id
      );
      
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.id === existItem.id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      
      // Save to local storage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      
      // Save to local storage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      localStorage.removeItem('cartItems');
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    case 'CART_RESET':
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const cartItems = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      const shippingAddress = localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        : {};
      const paymentMethod = localStorage.getItem('paymentMethod')
        ? JSON.parse(localStorage.getItem('paymentMethod'))
        : '';
      
      dispatch({
        type: 'CART_INIT',
        payload: {
          cartItems,
          shippingAddress,
          paymentMethod,
        },
      });
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
    }
  }, []);

  const addToCart = (product, quantity, selectedPriceVariant) => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        id: product._id,
        name: product.name,
        image: product.images[0],
        price: selectedPriceVariant.price,
        quantity,
        countInStock: product.countInStock,
        product: product._id,
        priceVariant: selectedPriceVariant,
      },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'CART_REMOVE_ITEM',
      payload: { id: productId },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CART_CLEAR' });
  };

  const saveShippingAddress = (data) => {
    dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: data });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const savePaymentMethod = (data) => {
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: data });
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  };

  const resetCart = () => {
    dispatch({ type: 'CART_RESET' });
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        addToCart,
        removeFromCart,
        clearCart,
        saveShippingAddress,
        savePaymentMethod,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
