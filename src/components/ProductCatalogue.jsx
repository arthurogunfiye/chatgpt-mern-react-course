import ProductCard from './ProductCard';

const ProductCatalogue = ({
  visibleProducts,
  allProducts,
  onAddToCart,
  getAvailableQuantity
}) => {
  if (allProducts.length === 0) {
    return <p>There are no products available.</p>;
  }

  return (
    <>
      <section>
        <h2>Product Catalogue</h2>
        {visibleProducts.length === 0 ? (
          <p>No products match your search or filters.</p>
        ) : (
          <div className='product-grid'>
            {visibleProducts.map(product => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  availableQuantity={getAvailableQuantity?.(product.id)}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default ProductCatalogue;
