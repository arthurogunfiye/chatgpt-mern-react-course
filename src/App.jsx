import { useState } from 'react';
import CartSummary from './components/CartSummary';
import Footer from './components/Footer';
import Header from './components/Header';
import ProductCatalogue from './components/ProductCatalogue';
import ProductFilters from './components/ProductFilters';
import SearchBar from './components/SearchBar';
import { CartProvider, useCart } from './context/CartContext';
import { testProducts } from './data/sampleProducts';
import useSearchTerm from './hooks/useSearchTerm';
import selectVisibleProducts from './utils/selectVisibleProducts';

function AppContent() {
  const { cartItems, dispatch } = useCart();
  const { searchTerm, updateSearch, clearSearch } = useSearchTerm();
  const [category, setCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');

  function handleAddToCart(productId) {
    const selectedProduct = testProducts.find(
      product => product.id === productId
    );

    if (
      !selectedProduct ||
      !selectedProduct.inStock ||
      selectedProduct.quantity <= 0
    ) {
      console.warn(`Product with ID ${productId} is out of stock`);
      return;
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: selectedProduct
    });
  }

  function getCartCount() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  function getAvailableQuantity(productId) {
    const product = testProducts.find(product => product.id === productId);

    if (!product) return 0;

    const itemInCart = cartItems.find(item => item.id === productId);
    const quantityOfItemInCart = itemInCart ? itemInCart.quantity : 0;

    return product.quantity - quantityOfItemInCart;
  }

  function getCartTotal() {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  function handleResetCart() {
    dispatch({ type: 'RESET_CART' });
  }

  function handleClearFilters() {
    clearSearch();
    setCategory('all');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortOrder('default');
  }

  function increaseCartItemQuantity(productId) {
    dispatch({
      type: 'INCREASE_QUANTITY',
      payload: productId
    });
  }

  function decreaseCartItemQuantity(productId) {
    dispatch({
      type: 'DECREASE_QUANTITY',
      payload: productId
    });
  }

  function removeFromCart(productId) {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId
    });
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
      <Header cartCount={getCartCount()} onResetCart={handleResetCart} />
      <main id='products'>
        <SearchBar searchTerm={searchTerm} onSearchTerm={updateSearch} />
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
          getAvailableQuantity={getAvailableQuantity}
        />
        <CartSummary
          cartItems={cartItems}
          cartTotal={getCartTotal()}
          onResetCart={handleResetCart}
          onIncreaseQty={increaseCartItemQuantity}
          onDecreaseQty={decreaseCartItemQuantity}
          removeFromCart={removeFromCart}
          getAvailableQuantity={getAvailableQuantity}
        />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
