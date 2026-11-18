const ProductCard = ({ product, onAddToCart }) => {
  const { id, name, price, inStock, category, onSale } = product;

  function handleAddClick() {
    onAddToCart(id);
  }

  return (
    <article id={`product-${id}`} className='product-card'>
      <h3 className='product-title'>{name}</h3>
      {onSale && <span className='sale-badge'>SALE</span>}
      <p className='product-category'>Category: {category}</p>
      <p className='product-price'>Price: £{price.toFixed(2)}</p>
      <p>{inStock ? 'In Stock' : 'Out of Stock'}</p>
      <button
        type='button'
        className='add-to-cart'
        data-product-id={id}
        disabled={!inStock}
        onClick={handleAddClick}
      >
        {!inStock ? 'Unavailable' : 'Add To Cart'}
      </button>
    </article>
  );
};

export default ProductCard;
