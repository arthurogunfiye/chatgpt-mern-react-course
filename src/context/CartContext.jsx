import { createContext, useContext, useReducer } from 'react';
import { cartReducer } from '../reducers/cartReducer';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={{ cartItems, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === null)
    throw new Error('useCart hook has to be used with CartProvider');

  return context;
}

// Create context, provide context, use context
