import CartItem from './CartItem';
import formatPrice from '../utils/formatPrice';

const CartSummary = ({
  cartItems,
  cartTotal,
  onResetCart,
  onIncreaseQty,
  onDecreaseQty,
  removeFromCart,
  saveForLater
}) => {
  if (cartItems.length === 0) {
    return (
      <section aria-label='Shopping cart summary'>
        <h2>Cart Summary</h2>
        <p>Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 id='cart-heading'>Your Shopping Cart</h2>
      {cartItems.map(cartItem => {
        return (
          <CartItem
            key={cartItem.id}
            cartItem={cartItem}
            onIncreaseQty={onIncreaseQty}
            onDecreaseQty={onDecreaseQty}
            removeFromCart={removeFromCart}
          />
        );
      })}
      <p>
        Total:
        <strong id='cart-total'>{formatPrice(cartTotal)}</strong>
      </p>
      <button type='button' onClick={onResetCart}>
        Reset Cart
      </button>
    </section>
  );
};

export default CartSummary;
