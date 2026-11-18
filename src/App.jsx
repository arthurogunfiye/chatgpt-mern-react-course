import { useState } from 'react';
import Header from './components/Header';
import ProductCatalogue from './components/ProductCatalogue';
import ProductFilters from './components/ProductFilters';
import SearchBar from './components/SearchBar';
import { testProducts } from './data/sampleProducts';
import selectVisibleProducts from './utils/selectVisibleProducts';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');

  function handleAddToCart(productId) {
    const selectedProduct = testProducts.find(
      product => product.id === productId
    );

    if (!selectedProduct || !selectedProduct.inStock) return;

    setCartCount(previousCount => previousCount + 1);
  }

  function handleResetCart() {
    setCartCount(0);
  }

  function handleClearFilters() {
    setSearchTerm('');
    setCategory('all');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortOrder('default');
  }

  const filters = {
    searchTerm,
    category,
    inStockOnly,
    onSaleOnly,
    sortOrder
  };

  const visibleProducts = selectVisibleProducts(testProducts, filters);

  return (
    <>
      <Header cartCount={cartCount} onResetCart={handleResetCart} />
      <main id='products'>
        <SearchBar searchTerm={searchTerm} onSearchTerm={setSearchTerm} />
        <ProductFilters
          category={category}
          inStockOnly={inStockOnly}
          onSaleOnly={onSaleOnly}
          sortOrder={sortOrder}
          onCategoryChange={setCategory}
          onStockChange={setInStockOnly}
          onSaleChange={setOnSaleOnly}
          onSortChange={setSortOrder}
          onClearFilters={handleClearFilters}
          visibleProducts={visibleProducts}
          allProducts={testProducts}
        />
        <ProductCatalogue
          visibleProducts={visibleProducts}
          allProducts={testProducts}
          onAddToCart={handleAddToCart}
        />
      </main>
    </>
  );
}

export default App;
