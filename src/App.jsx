import { useState } from 'react';
import CartSummary from './components/CartSummary';
import Header from './components/Header';
import ProductCatalogue from './components/ProductCatalogue';
import ProductFilters from './components/ProductFilters';
import SearchBar from './components/SearchBar';
import { testProducts } from './data/sampleProducts';
import selectVisibleProducts from './utils/selectVisibleProducts';

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

    setCartItems(previousItems => {
      const existingItem = previousItems.find(item => item.id === productId);

      if (existingItem) {
        if (existingItem.quantity >= selectedProduct.quantity) {
          console.warn(
            `You have reached the maximum quantity of ${selectedProduct.name} in stock`
          );
          return previousItems;
        }

        return previousItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousItems,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1
        }
      ];
    });
  }

  function getCartCount() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
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
    const itemInCart = cartItems.find(cartItem => cartItem.id === productId);

    if (!itemInCart) return;

    const product = testProducts.find(pdt => pdt.id === itemInCart.id);

    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return;
    }

    if (itemInCart.quantity >= product.quantity) {
      console.warn(
        `You have reached the maximum quantity of ${product.name} in stock`
      );
      return;
    }

    setCartItems(previousItems => {
      const existingItem = previousItems.find(item => item.id === productId);

      if (existingItem) {
        return previousItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
    });
  }

  function decreaseCartItemQuantity(productId) {
    const itemInCart = cartItems.find(cartItem => cartItem.id === productId);

    if (!itemInCart) return;

    if (itemInCart.quantity === 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(previousItems => {
      const existingItem = previousItems.find(item => item.id === productId);

      if (existingItem) {
        return previousItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  }

  function removeFromCart(productId) {
    setCartItems(previousItems =>
      previousItems.filter(item => item.id !== productId)
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
        />
        <CartSummary
          cartItems={cartItems}
          cartTotal={getCartTotal()}
          onResetCart={handleResetCart}
          onIncreaseQty={increaseCartItemQuantity}
          onDecreaseQty={decreaseCartItemQuantity}
          removeFromCart={removeFromCart}
        />
      </main>
    </>
  );
}

export default App;
