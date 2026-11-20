import formatPrice from '../utils/formatPrice';

const CartItem = ({
  cartItem,
  onIncreaseQty,
  onDecreaseQty,
  removeFromCart,
  canIncrease
}) => {
  const { id, name, price, quantity } = cartItem;

  return (
    <ul className='cart-items-list'>
      <li className='cart-item'>
        <span className='cart-item-name'>{name}</span>
        <p className='cart-item-subtotal'>
          <span className='item-quantity'>{quantity}</span>
          <span> * </span>
          <span className='item-price'>{formatPrice(price)}</span>
          <span> = </span>
          <span className='item-subtotal'>{formatPrice(quantity * price)}</span>
        </p>
        <button
          type='button'
          className='increment-btn'
          aria-label={`Increase quantity of ${name}`}
          disabled={!canIncrease}
          onClick={() => onIncreaseQty(id)}
        >
          +
        </button>
        <button
          type='button'
          className='decrement-btn'
          aria-label={`Decrease quantity of ${name}`}
          onClick={() => onDecreaseQty(id)}
        >
          -
        </button>
        <button
          type='button'
          className='remove-btn'
          aria-label={`Remove ${name}`}
          onClick={() => removeFromCart(id)}
        >
          Remove
        </button>
      </li>
    </ul>
  );
};

export default CartItem;
