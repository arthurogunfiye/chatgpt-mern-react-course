import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import loadSavedCart from '../utils/loadSavedCart';

describe('loadSavedCart', () => {
  beforeEach(() => {
    localStorage.removeItem('mystore-cart');
  });

  it('returns initial cart when nothing is saved', () => {
    // TODO 1:
    // Call loadSavedCart([]).
    // Assert the result is [].
    const initialCart = [];

    const result = loadSavedCart(initialCart);

    expect(result).toBe(initialCart);
  });

  it('restores valid cart items', () => {
    // TODO 2:
    // Save this cart using localStorage.setItem:
    //
    // [{ id: 104, quantity: 2 }]
    //
    // Call loadSavedCart([]).
    // Assert that Samsung Monitor is restored
    // with quantity 2 and price 116.1.
    const cart = [{ id: 104, quantity: 2 }];
    const serialisedCart = JSON.stringify(cart);
    localStorage.setItem('mystore-cart', serialisedCart);

    const savedCart1 = loadSavedCart([]);

    expect(savedCart1).toHaveLength(1);
    expect(savedCart1[0].quantity).toBe(2);
    expect(savedCart1[0].price).toBe(116.1);
  });

  it('rejects corrupted JSON', () => {
    // TODO 3:
    // Save an invalid JSON string.
    // Call loadSavedCart([]).
    // Assert it returns [].
    const initialCart = [];
    const invalidJsonStr = '{ "id": 104, "quantity": 2 ';
    localStorage.setItem('mystore-cart', invalidJsonStr);

    const savedCart2 = loadSavedCart(initialCart);

    expect(savedCart2).toBe(initialCart);
  });

  it('combines duplicate products', () => {
    const cart = [
      { id: 104, quantity: 3 },
      { id: 104, quantity: 2 }
    ];
    const serialisedCart = JSON.stringify(cart);
    localStorage.setItem('mystore-cart', serialisedCart);

    const savedCart3 = loadSavedCart([]);

    expect(savedCart3).toHaveLength(1);
    expect(savedCart3[0].quantity).toBe(5);
  });

  it('ensures combined quantities does not exceed current stock', () => {
    const cart = [
      { id: 104, quantity: 7 },
      { id: 104, quantity: 3 }
    ];
    const serialisedCart = JSON.stringify(cart);
    localStorage.setItem('mystore-cart', serialisedCart);

    const savedCart4 = loadSavedCart([]);

    expect(savedCart4).toHaveLength(1);
    expect(savedCart4[0].quantity).toBe(7);
  });

  it('rejects valid JSON that is not an array', () => {
    const initialCart = [];

    // TODO 1:
    // Store the following object as JSON:
    // { id: 104, quantity: 2 }
    const invalidCartJson = { id: 104, quantity: 2 };
    localStorage.setItem('mystore-cart', JSON.stringify(invalidCartJson));

    // TODO 2:
    // Call loadSavedCart(initialCart).
    const result = loadSavedCart(initialCart);

    // TODO 3:
    // Assert that the result is initialCart.
    expect(result).toBe(initialCart);
  });

  afterEach(() => {
    localStorage.removeItem('mystore-cart');
  });
});
