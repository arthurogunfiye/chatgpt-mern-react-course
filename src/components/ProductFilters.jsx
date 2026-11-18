const ProductFilters = ({
  category,
  inStockOnly,
  onSaleOnly,
  sortOrder,
  onCategoryChange,
  onStockChange,
  onSaleChange,
  onSortChange,
  onClearFilters,
  visibleProducts,
  allProducts
}) => {
  return (
    <div className='product-filters'>
      <label htmlFor='category-filter'>Category</label>

      <select
        id='category-filter'
        value={category}
        onChange={event => onCategoryChange(event.target.value)}
      >
        <option value='all'>All Categories</option>
        <option value='Laptops'>Laptops</option>
        <option value='Accessories'>Accessories</option>
        <option value='Smartphones'>Smartphones</option>
        <option value='Tablets'>Tablets</option>
      </select>

      <label>
        <input
          type='checkbox'
          checked={inStockOnly}
          onChange={event => onStockChange(event.target.checked)}
        />
        In Stock Only
      </label>

      <label>
        <input
          type='checkbox'
          checked={onSaleOnly}
          onChange={event => onSaleChange(event.target.checked)}
        />
        On Sale Only
      </label>

      <label htmlFor='sort-order'>Sort Products</label>

      <select
        id='sort-order'
        value={sortOrder}
        onChange={event => onSortChange(event.target.value)}
      >
        <option value='default'>Default Order</option>
        <option value='price-asc'>Price: Low to High</option>
        <option value='price-desc'>Price: High to Low</option>
        <option value='a-z'>A-Z</option>
      </select>

      <button type='button' onClick={onClearFilters}>
        Clear Filters
      </button>
      <p className='results-message'>
        Showing {visibleProducts.length} of {allProducts.length} products
      </p>
    </div>
  );
};

export default ProductFilters;
