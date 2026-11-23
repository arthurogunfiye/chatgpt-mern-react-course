import { describe, it, expect } from 'vitest';
import { cartReducer, initialCart } from '../reducers/cartReducer';
import { testProducts } from '../data/sampleProducts';

describe('MyStore cartReducer', () => {
  it('starts with an empty cart', () => {
    expect(initialCart).toEqual([]);
  });

  it('adds a Samsung Monitor with quantity 1', () => {
    // TODO:
    // Find Samsung Monitor in testProducts.
    // Dispatch ADD_ITEM with that product.
    // Assert quantity, name and sale price.
    const selectedProduct = testProducts.find(product => product.id === 104);

    expect(selectedProduct).toBeDefined();

    const result = cartReducer(initialCart, {
      type: 'ADD_ITEM',
      payload: selectedProduct
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(104);
    expect(result[0].name).toBe('Samsung Monitor');
    expect(result[0].quantity).toBe(1);
    expect(result[0].price).toBe(116.1);
    expect(result[0].originalPrice).toBe(129);
  });

  it('increases an existing product quantity to 2', () => {
    // ARRANGE
    const selectedProduct = testProducts.find(product => product.id === 104);

    expect(selectedProduct).toBeDefined();

    // ACT 1:
    // Call cartReducer with initialCart and ADD_ITEM.
    // Store the result in a variable named firstCart.
    const firstCart = cartReducer(initialCart, {
      type: 'ADD_ITEM',
      payload: selectedProduct
    });

    // ACT 2:
    // Call cartReducer again using firstCart as the state.
    // Dispatch ADD_ITEM with the same selectedProduct.
    // Store the result in a variable named secondCart.
    const secondCart = cartReducer(firstCart, {
      type: 'ADD_ITEM',
      payload: selectedProduct
    });

    // ASSERT:
    // 1. secondCart contains exactly one product.
    // 2. Its quantity is 2.
    // 3. Its name is Samsung Monitor.
    // 4. firstCart still has quantity 1.

    expect(secondCart).toHaveLength(1);
    expect(secondCart[0].id).toBe(104);
    expect(secondCart[0].quantity).toBe(2);
    expect(secondCart[0].name).toBe('Samsung Monitor');
    expect(firstCart).toHaveLength(1);
    expect(firstCart[0].quantity).toBe(1);
    expect(secondCart).not.toBe(firstCart);
  });

  it('does not exceed the product stock limit', () => {
    // TODO:
    // Add Samsung Monitor repeatedly.
    // Assert the quantity never exceeds 7.
    const selectedProduct = testProducts.find(product => product.id === 104);

    expect(selectedProduct).toBeDefined();

    let currentCart = initialCart;

    for (let i = 0; i < 8; i++) {
      currentCart = cartReducer(currentCart, {
        type: 'ADD_ITEM',
        payload: selectedProduct
      });
    }

    expect(currentCart.length).toBe(1);
    expect(currentCart[0].id).toBe(104);
    expect(currentCart[0].quantity).toBe(7);

    const cartAtLimit = [
      {
        id: 104,
        name: 'Samsung Monitor',
        price: 116.1,
        originalPrice: 129,
        quantity: 7
      }
    ];

    const result = cartReducer(currentCart, {
      type: 'ADD_ITEM',
      payload: selectedProduct
    });

    expect(result).toStrictEqual(cartAtLimit);
    expect(result).toBe(currentCart);
  });

  it('does not add item with no payload', () => {
    const result = cartReducer(initialCart, {
      type: 'ADD_ITEM'
    });

    expect(result.length).toBe(0);
    expect(initialCart.length).toBe(0);
    expect(result).toStrictEqual(initialCart);
    expect(result).toBe(initialCart);
  });

  it('does not add item with unknown product id', () => {
    const productWithUnknownId = {
      id: 199,
      name: 'Samsung Monitor',
      price: 116.1,
      originalPrice: 129,
      quantity: 2
    };

    const result = cartReducer(initialCart, {
      type: 'ADD_ITEM',
      payload: productWithUnknownId
    });

    expect(result.length).toBe(0);
    expect(initialCart.length).toBe(0);
    expect(result).toStrictEqual(initialCart);
  });

  it('does not add an out-of-stock item', () => {
    const outOfStockProduct = testProducts.find(pdt => pdt.id === 102);

    expect(outOfStockProduct).toBeDefined();

    const result = cartReducer(initialCart, {
      type: 'ADD_ITEM',
      payload: outOfStockProduct
    });

    expect(result.length).toBe(0);
    expect(initialCart.length).toBe(0);
    expect(result).toStrictEqual(initialCart);
    expect(result).toBe(initialCart);
  });

  it('increases quantity immutably', () => {
    const originalCart = [
      {
        id: 104,
        name: 'Samsung Monitor',
        price: 116.1,
        originalPrice: 129,
        quantity: 2
      }
    ];

    const updatedCart = cartReducer(originalCart, {
      type: 'INCREASE_QUANTITY',
      payload: 104
    });

    expect(updatedCart[0].quantity).toBe(3);
    expect(originalCart[0].quantity).toBe(2);
    expect(updatedCart).not.toBe(originalCart);
    expect(updatedCart[0]).not.toBe(originalCart[0]);
  });

  it('does not increase quantity at the stock limit', () => {
    const originalCart = [
      {
        id: 103,
        name: 'Toshiba Keyboard',
        price: 39,
        quantity: 8
      }
    ];

    const result = cartReducer(originalCart, {
      type: 'INCREASE_QUANTITY',
      payload: 103
    });

    expect(result[0].quantity).toBe(8);
    expect(originalCart[0].quantity).toBe(8);
    expect(result).toStrictEqual(originalCart);
    expect(result).toBe(originalCart);
  });

  it('returns existing state when item is absent from cart', () => {
    const originalCart = [
      {
        id: 104,
        name: 'Samsung Monitor',
        price: 116.1,
        originalPrice: 129,
        quantity: 2
      }
    ];

    // TODO 1:
    // Dispatch INCREASE_QUANTITY using
    // product ID 103 (Toshiba Keyboard).
    // The keyboard exists in the catalogue,
    // but not in this cart.
    const result = cartReducer(originalCart, {
      type: 'INCREASE_QUANTITY',
      payload: 103
    });

    // TODO 2:
    // Assert the returned cart is the
    // same array reference as originalCart.

    expect(result).toStrictEqual(originalCart);
    expect(result).toBe(originalCart);

    // TODO 3:
    // Assert the Samsung Monitor still
    // has quantity 2.
    expect(originalCart[0].quantity).toBe(2);
  });

  it('decreases quantity immutably', () => {
    // ARRANGE
    const originalCart = [
      {
        id: 104,
        name: 'Samsung Monitor',
        price: 116.1,
        originalPrice: 129,
        quantity: 3
      }
    ];

    // ACT
    // TODO 1:
    // Call cartReducer with originalCart
    // and DECREASE_QUANTITY.
    // Use 104 as the payload.
    // Save the result in updatedCart.

    const updatedCart = cartReducer(originalCart, {
      type: 'DECREASE_QUANTITY',
      payload: 104
    });

    // ASSERT
    // TODO 2:
    // Verify updatedCart has quantity 2.
    expect(updatedCart[0].quantity).toBe(2);

    // TODO 3:
    // Verify originalCart still has quantity 3.
    expect(originalCart[0].quantity).toBe(3);

    // TODO 4:
    // Verify updatedCart and originalCart
    // are different array references.
    expect(updatedCart).not.toBe(originalCart);

    // TODO 5:
    // Verify their product objects
    // are also different references.
    expect(updatedCart[0]).not.toBe(originalCart[0]);
  });

  it('removes the product when quantity is 1', () => {
    const originalCart = [
      {
        id: 105,
        name: 'Apple iPhone 18 Pro',
        price: 1199,
        quantity: 1
      },
      {
        id: 106,
        name: 'Dell Pro 16 Plus Laptop',
        price: 1975.2,
        quantity: 4
      }
    ];

    const result = cartReducer(originalCart, {
      type: 'DECREASE_QUANTITY',
      payload: 105
    });

    expect(result.length).toBe(1);
    expect(originalCart.length).toBe(2);
    expect(result[0].id).toBe(106);
    expect(originalCart[0].id).toBe(105);
  });

  it('removes a product completely', () => {
    const originalCart = [
      {
        id: 104,
        name: 'Samsung Monitor',
        price: 116.1,
        originalPrice: 129,
        quantity: 3
      },
      {
        id: 103,
        name: 'Toshiba Keyboard',
        price: 39,
        originalPrice: 39,
        quantity: 2
      }
    ];

    // TODO 1:
    // Call cartReducer with REMOVE_ITEM.
    // Use 104 as the action payload.
    const result = cartReducer(originalCart, {
      type: 'REMOVE_ITEM',
      payload: 104
    });

    // TODO 2:
    // Assert the result contains only one item.
    expect(result.length).toBe(1);

    // TODO 3:
    // Assert that remaining item's ID is 103.
    expect(result[0].id).toBe(103);
    expect(result[0].quantity).toBe(2);

    // TODO 4:
    // Verify originalCart still contains two items.
    expect(originalCart.length).toBe(2);
    expect(originalCart[0].quantity).toBe(3);
    expect(originalCart[1].quantity).toBe(2);
  });

  it('resets the cart', () => {
    const originalCart = [
      {
        id: 104,
        name: 'Samsung Monitor',
        price: 116.1,
        originalPrice: 129,
        quantity: 3
      }
    ];

    // TODO 1:
    // Dispatch RESET_CART.
    const result = cartReducer(originalCart, {
      type: 'RESET_CART'
    });

    // TODO 2:
    // Assert the returned cart is an empty array.
    expect(result.length).toBe(0);

    // TODO 3:
    // Assert originalCart is unchanged.
    expect(originalCart.length).toBe(1);
    expect(originalCart[0].id).toBe(104);

    // TODO 4:
    // Assert the returned array is not
    // the same reference as originalCart.
    expect(result).not.toBe(originalCart);
  });

  it('returns the same state for an unknown action', () => {
    const originalCart = [
      {
        id: 104,
        name: 'Samsung Monitor',
        price: 116.1,
        originalPrice: 129,
        quantity: 2
      }
    ];

    const result = cartReducer(originalCart, {
      type: 'UNKNOWN_ACTION'
    });

    expect(result).toBe(originalCart);
  });
});
