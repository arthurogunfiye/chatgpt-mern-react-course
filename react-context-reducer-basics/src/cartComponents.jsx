import { useCart } from './cartContext';

export function Header() {
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return <header>MyStore Cart: {cartCount}</header>;
}

export function ProductCard() {
  const { dispatch } = useCart();

  function handleAddToCart() {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: 101,
        name: 'Samsung Monitor'
      }
    });
  }

  return (
    <button type='button' onClick={handleAddToCart}>
      Add Samsung Monitor
    </button>
  );
}

export function CartSummary() {
  const { cartItems, dispatch } = useCart();

  function handleResetCart() {
    dispatch({ type: 'RESET_CART' });
  }

  function handleDecreaseQuantity(productId) {
    dispatch({
      type: 'DECREASE_QUANTITY',
      payload: productId
    });
  }

  return (
    <section>
      <h2>Cart Summary</h2>

      {cartItems.map(item => (
        <div key={item.id}>
          <span>
            {item.name} — Quantity: {item.quantity}
          </span>
          <button type='button' onClick={() => handleDecreaseQuantity(item.id)}>
            Remove
          </button>
        </div>
      ))}

      {cartItems.length > 0 && (
        <button type='button' onClick={handleResetCart}>
          Reset Cart
        </button>
      )}
    </section>
  );
}
