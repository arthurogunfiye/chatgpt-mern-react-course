import { createContext, useContext, useReducer, useEffect } from 'react';
import { cartReducer, initialCart } from '../reducers/cartReducer';
import loadSavedCart from '../utils/loadSavedCart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(
    cartReducer,
    initialCart,
    loadSavedCart
  );

  useEffect(() => {
    localStorage.setItem('mystore-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === null)
    throw new Error('useCart hook has to be used within CartProvider');

  return context;
}

// Create context, provide context, use context
