import CartItem from './CartItem';
import formatPrice from '../utils/formatPrice';

const CartSummary = ({
  cartItems,
  cartTotal,
  onResetCart,
  onIncreaseQty,
  onDecreaseQty,
  removeFromCart,
  getAvailableQuantity
}) => {
  return (
    <section aria-labelledby='cart-heading'>
      <h2 id='cart-heading'>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map(cartItem => {
          return (
            <CartItem
              key={cartItem.id}
              cartItem={cartItem}
              onIncreaseQty={onIncreaseQty}
              onDecreaseQty={onDecreaseQty}
              removeFromCart={removeFromCart}
              canIncrease={getAvailableQuantity(cartItem.id) > 0}
            />
          );
        })
      )}

      <p>
        Total:
        <strong id='cart-total'>{formatPrice(cartTotal)}</strong>
      </p>

      {cartItems.length > 0 && (
        <button type='button' onClick={onResetCart}>
          Reset Cart
        </button>
      )}
    </section>
  );
};

export default CartSummary;
