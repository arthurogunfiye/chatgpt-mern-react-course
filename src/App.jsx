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
  const [inStock, setInStockOnly] = useState(false);
  const [onSale, setOnSaleOnly] = useState(false);
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
    inStock,
    onSale,
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
          inStock={inStock}
          onSale={onSale}
          sortOrder={sortOrder}
          onCategoryChange={setCategory}
          onStockChange={setInStockOnly}
          onSaleChange={setOnSaleOnly}
          onSortChange={setSortOrder}
          onClearFilters={handleClearFilters}
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
