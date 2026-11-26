import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

function CartDisplay() {
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return <p>Cart: {cartCount}</p>;
}

function AddButton() {
  const { dispatch } = useCart();

  function handleAdd() {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: 104,
        name: 'Samsung Monitor'
      }
    });
  }

  return (
    <button type='button' onClick={handleAdd}>
      Add Monitor
    </button>
  );
}

function UnwrappedConsumer() {
  useCart();
  return <p>Unwrapped consumer</p>;
}

describe('CartContext integration', () => {
  it('starts with an empty cart', () => {
    // TODO 1:
    // Render CartDisplay inside CartProvider.
    render(
      <CartProvider>
        <CartDisplay />
      </CartProvider>
    );
    // TODO 2:
    // Assert "Cart: 0" appears.
    const cartCountEl = screen.getByRole('paragraph');
    expect(cartCountEl).toHaveTextContent('Cart: 0');
  });

  it('shares cart updates between components', () => {
    // TODO 3:
    // Render CartDisplay and AddButton
    // inside the SAME CartProvider.
    render(
      <CartProvider>
        <CartDisplay />
        <AddButton />
      </CartProvider>
    );
    // TODO 4:
    // Click Add Monitor.
    const addButton = screen.getByRole('button', { name: 'Add Monitor' });
    fireEvent.click(addButton);
    // TODO 5:
    // Assert "Cart: 1" appears.
    const cartCountEl = screen.getByRole('paragraph');
    expect(cartCountEl).toHaveTextContent('Cart: 1');
  });

  it('throws an error for component without provider', () => {
    expect(() => {
      render(<UnwrappedConsumer />);
    }).toThrow('useCart hook has to be used within CartProvider');
  });
});
