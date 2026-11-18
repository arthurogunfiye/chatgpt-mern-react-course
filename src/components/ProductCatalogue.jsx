import ProductCard from './ProductCard';

const ProductCatalogue = ({ visibleProducts, allProducts, onAddToCart }) => {
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
