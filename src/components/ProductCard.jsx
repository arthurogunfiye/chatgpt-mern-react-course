import formatPrice from '../utils/formatPrice';
import getSalePrice from '../utils/getSalePrice';

const ProductCard = ({
  product,
  onAddToCart,
  availableQuantity = product.quantity
}) => {
  const { id, name, price, inStock, category, onSale, discount } = product;

  const salePrice = getSalePrice(product);
  const canAddToCart = inStock && availableQuantity > 0;

  return (
    <article id={`product-${id}`} className='product-card'>
      <h3 className='product-title'>{name}</h3>
      {onSale && <span className='sale-badge'>SALE: {`${discount}% off`}</span>}
      <p className='product-category'>Category: {category}</p>
      {onSale ? (
        <p className='product-price'>
          <s>Original Price: {formatPrice(price)}</s>
        </p>
      ) : (
        <p className='product-price'>Price: {formatPrice(price)}</p>
      )}

      {onSale && (
        <p className='discount-price'>Sale Price: {formatPrice(salePrice)}</p>
      )}

      <p>
        {!inStock
          ? 'Out of Stock'
          : availableQuantity === 0
            ? 'Maximum available quantity in cart'
            : 'In Stock'}
      </p>
      {inStock && <p>Available: {availableQuantity}</p>}
      <button
        type='button'
        className='add-to-cart'
        data-product-id={id}
        disabled={!canAddToCart}
        onClick={() => onAddToCart(id)}
      >
        {canAddToCart ? 'Add To Cart' : 'Unavailable'}
      </button>
    </article>
  );
};

export default ProductCard;
