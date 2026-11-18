import formatPrice from '../utils/formatPrice';

const ProductCard = ({ product, onAddToCart }) => {
  const { id, name, price, inStock, category, onSale } = product;

  return (
    <article id={`product-${id}`} className='product-card'>
      <h3 className='product-title'>{name}</h3>
      {onSale && <span className='sale-badge'>SALE</span>}
      <p className='product-category'>Category: {category}</p>
      <p className='product-price'>Price: {formatPrice(price)}</p>
      <p>{inStock ? 'In Stock' : 'Out of Stock'}</p>
      <button
        type='button'
        className='add-to-cart'
        data-product-id={id}
        disabled={!inStock}
        onClick={() => onAddToCart(id)}
      >
        {!inStock ? 'Unavailable' : 'Add To Cart'}
      </button>
    </article>
  );
};

export default ProductCard;
