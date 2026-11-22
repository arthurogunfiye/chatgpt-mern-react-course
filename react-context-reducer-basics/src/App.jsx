import { CartProvider } from './cartContext';
import { Header, ProductCard, CartSummary } from './cartComponents';

function App() {
  return (
    <CartProvider>
      <Header />
      <ProductCard />
      <CartSummary />
    </CartProvider>
  );
}

export default App;
