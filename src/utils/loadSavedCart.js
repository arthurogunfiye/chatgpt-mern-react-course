import { testProducts } from '../data/sampleProducts';
import getSalePrice from './getSalePrice';

export default function loadSavedCart(initialCart) {
  try {
    const savedJSON = localStorage.getItem('mystore-cart');

    if (savedJSON === null) {
      return initialCart;
    }

    const parsedCart = JSON.parse(savedJSON);

    if (!Array.isArray(parsedCart)) {
      return initialCart;
    }

    // TODO 1:
    // Keep only saved items that have
    // valid product IDs in testProducts.
    const validCartItems = [];

    // TODO 2:
    // Reject saved quantities that are
    // not positive integers.
    for (const cartItem of parsedCart) {
      if (!cartItem || typeof cartItem !== 'object') continue;

      if (!Number.isSafeInteger(cartItem.quantity) || cartItem.quantity <= 0)
        continue;

      // TODO 3:
      // Ensure saved quantities do not exceed
      // the product's current stock.
      const product = testProducts.find(pdt => pdt.id === cartItem.id);

      if (!product) continue;

      if (
        !product.inStock ||
        !Number.isSafeInteger(product.quantity) ||
        product.quantity <= 0
      )
        continue;

      const validCartItem = validCartItems.find(
        validItem => validItem.id === product.id
      );

      const remainingStock = product.quantity - (validCartItem?.quantity ?? 0);

      const quantityToAdd = Math.min(cartItem.quantity, remainingStock);

      // TODO 4:
      // Reconstruct each cart item from the
      // trusted product catalogue.
      // Use getSalePrice(product).

      if (validCartItem) {
        validCartItem.quantity += quantityToAdd;
      } else {
        validCartItems.push({
          id: product.id,
          quantity: quantityToAdd,
          price: getSalePrice(product),
          originalPrice: product.price,
          name: product.name
        });
      }
    }

    // TODO 5:
    // Return the validated cart array.
    return validCartItems;
  } catch (error) {
    return initialCart;
  }
}
