'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    
    if (user) {
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } else {
      dispatch({ type: 'AUTH_SUCCESS', payload: null });
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_REQUEST' });
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      localStorage.setItem('user', JSON.stringify(data));
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      
      return data;
    } catch (error) {
      dispatch({ type: 'AUTH_FAIL', payload: error.message });
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'AUTH_REQUEST' });
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      localStorage.setItem('user', JSON.stringify(data));
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      
      return data;
    } catch (error) {
      dispatch({ type: 'AUTH_FAIL', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
