import { testProducts } from '../data/sampleProducts';
import getSalePrice from '../utils/getSalePrice';

export const initialCart = [];

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.payload;

      // If an action is dispatched without a payload, it will throw a TypeError
      if (!product || typeof product !== 'object') return state;

      // TODO 1:
      // Reject invalid, unknown or out-of-stock products.
      const selectedProduct = testProducts.find(pdt => pdt.id === product.id);

      if (!selectedProduct) return state;

      if (!selectedProduct.inStock || selectedProduct.quantity <= 0)
        return state;

      // TODO 2:
      // Find an existing cart entry.
      const existingCartItem = state.find(item => item.id === product.id);

      // TODO 3:
      // If it exists, increase quantity by 1
      // without exceeding the stock limit.
      // Preserve immutability.
      if (existingCartItem) {
        if (existingCartItem.quantity >= selectedProduct.quantity) return state;

        return state.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // TODO 4:
      // If it does not exist, add an item
      // with the same structure as your
      // existing MyStore cart items.
      // Use getSalePrice(product).
      return [
        ...state,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: getSalePrice(selectedProduct),
          originalPrice: selectedProduct.price,
          quantity: 1
        }
      ];
    }

    case 'INCREASE_QUANTITY': {
      const productId = action.payload;

      // Find the product in testProducts catalogue.
      const selectedProduct = testProducts.find(
        product => product.id === productId
      );

      // Reject unknown or unavailable products.
      if (
        !selectedProduct ||
        !selectedProduct.inStock ||
        selectedProduct.quantity === 0
      )
        return state;

      // Check if the item exists in the cart.
      const existingCartItem = state.find(item => item.id === productId);

      // Reject missing items or exhausted stock.
      if (
        !existingCartItem ||
        existingCartItem.quantity >= selectedProduct.quantity
      ) {
        return state;
      }

      return state.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    }

    case 'DECREASE_QUANTITY': {
      // quantity and remove it at zero. // Decrease the matching cart item's // TODO 6:
      const productId = action.payload;
      return state
        .map(cartItem =>
          cartItem.id === productId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter(cartItem => cartItem.quantity > 0);
    }

    case 'REMOVE_ITEM': {
      // Remove the entire matching cart item. // TODO 7:
      const productId = action.payload;
      return state.filter(item => item.id !== productId);
    }

    case 'RESET_CART':
      // TODO 8:
      // Return an empty array.
      return [];

    default:
      return state;
  }
}
