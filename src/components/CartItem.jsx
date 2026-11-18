import formatPrice from '../utils/formatPrice';

const CartItem = ({
  cartItem,
  onIncreaseQty,
  onDecreaseQty,
  removeFromCart
}) => {
  const { id, name, price, quantity } = cartItem;

  return (
    <div className='cart-item'>
      <span className='cart-item-name'>{name}</span>
      <p className='cart-item-subtotal'>
        <span>{quantity} * </span>
        <span>{formatPrice(price)}</span>
        <span> = {formatPrice(quantity * price)}</span>
      </p>
      <button
        type='button'
        aria-label={`Increase quantity of ${name}`}
        onClick={() => onIncreaseQty(id)}
      >
        +
      </button>
      <button
        type='button'
        aria-label={`Decrease quantity of ${name}`}
        onClick={() => onDecreaseQty(id)}
      >
        -
      </button>
      <button
        type='button'
        aria-label={`Remove ${name}`}
        onClick={() => removeFromCart(id)}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
