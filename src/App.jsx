import { useState } from 'react';
import CartSummary from './components/CartSummary';
import Footer from './components/Footer';
import Header from './components/Header';
import ProductCatalogue from './components/ProductCatalogue';
import ProductFilters from './components/ProductFilters';
import SearchBar from './components/SearchBar';
import { testProducts } from './data/sampleProducts';
import selectVisibleProducts from './utils/selectVisibleProducts';
import getSalePrice from './utils/getSalePrice';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');

  function handleAddToCart(productId) {
    const selectedProduct = testProducts.find(
      product => product.id === productId
    );

    if (!selectedProduct) {
      console.log(`Product with ID ${productId} not found!`);
      return;
    }

    if (!selectedProduct.inStock || selectedProduct.quantity <= 0) {
      console.warn(`Product with ID ${productId} is out of stock`);
      return;
    }

    setCartItems(previousCartItems => {
      const existingCartItem = previousCartItems.find(
        item => item.id === productId
      );

      if (existingCartItem) {
        if (existingCartItem.quantity >= selectedProduct.quantity) {
          console.warn(
            `You have reached the maximum quantity of ${selectedProduct.name} in stock`
          );
          return previousCartItems;
        }

        return previousCartItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousCartItems,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: getSalePrice(selectedProduct),
          originalPrice: selectedProduct.price,
          quantity: 1
        }
      ];
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
    setCartItems([]);
  }

  function handleClearFilters() {
    setSearchTerm('');
    setCategory('all');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortOrder('default');
  }

  function increaseCartItemQuantity(productId) {
    const selectedProduct = testProducts.find(
      product => product.id === productId
    );

    if (!selectedProduct) return;
    if (!selectedProduct.inStock || selectedProduct.quantity === 0) return;

    setCartItems(previousCartItems =>
      previousCartItems.map(cartItem => {
        if (cartItem.id !== productId) return cartItem;
        if (cartItem.quantity >= selectedProduct.quantity) return cartItem;
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1
        };
      })
    );
  }

  function decreaseCartItemQuantity(productId) {
    setCartItems(previousCartItems =>
      previousCartItems
        .map(cartItem =>
          cartItem.id === productId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter(cartItem => cartItem.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCartItems(previousCartItems =>
      previousCartItems.filter(cartItem => cartItem.id !== productId)
    );
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

export default App;
