import { createContext, useContext, useState } from 'react';

// TODO 1:
// Create CartContext with a default value of null.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  function addToCart() {
    // TODO 2:
    // Increment cartCount using a functional update.
    setCartCount(previousCartCount => previousCartCount + 1);
  }

  return (
    // TODO 3:
    // Wrap children in CartContext.Provider.
    // Provide cartCount and addToCart.
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  // TODO 4:
  // Read CartContext using useContext.
  // Return the context value.
  const context = useContext(CartContext);

  if (context === null)
    throw new Error('useCart hook must be used inside CartProvider');

  return context;
}

export function Header() {
  // TODO 5:
  // Use the useCart() custom hook to obtain cartCount.
  // Display "Cart: " followed by the count.
  const { cartCount } = useCart();
  return <header>Cart: {cartCount}</header>;
}
