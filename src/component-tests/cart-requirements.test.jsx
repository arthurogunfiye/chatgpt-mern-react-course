import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

// ---------- product fixtures (prices from sampleProducts + getSalePrice) ----------
const MONITOR = 'Samsung Monitor'; // £129.00, 10% off → £116.10, stock 7
const KEYBOARD = 'Toshiba Keyboard'; // £39.00, not on sale, stock 8
const OUT_OF_STOCK = [
  'Bose QuietComfort Ultra Headphones',
  'HDMI Cable',
  'Samsung Galaxy Tab S12 Ultra',
  'Google Pixel 11 Pro'
];

// ---------- helpers ----------
const cardFor = name =>
  screen.getByRole('heading', { level: 3, name }).closest('article');
const addButtonFor = name => within(cardFor(name)).getByRole('button');
const addToCart = (name, times = 1) => {
  for (let i = 0; i < times; i++) fireEvent.click(addButtonFor(name));
};

const cartRegion = () =>
  screen.getByRole('region', { name: 'Your Shopping Cart' });
const cartEntries = () =>
  within(cartRegion())
    .queryAllByRole('listitem')
    .map(li => ({
      name: li.querySelector('.cart-item-name').textContent,
      quantity: Number(li.querySelector('.item-quantity').textContent),
      subtotal: li.querySelector('.item-subtotal').textContent
    }));
const cartTotalText = () =>
  document.querySelector('#cart-total')?.textContent ?? null;

// Header renders the count twice (mobile + desktop); both must agree.
const expectHeaderCount = n => {
  const counters = screen.getAllByRole('status');
  expect(counters).toHaveLength(2);
  counters.forEach(c => expect(c).toHaveTextContent(`Cart: ${n}`));
};

// Cart line controls, e.g. cartButton('Remove', MONITOR)
const cartButton = (action, name) =>
  within(cartRegion()).getByRole('button', {
    name:
      action === 'Remove' ? `Remove ${name}` : `${action} quantity of ${name}`
  });
const availableText = name =>
  within(cardFor(name)).getByText(/^Available:/).textContent;

const cartSnapshot = () => ({
  entries: cartEntries(),
  total: cartTotalText(),
  counts: screen.getAllByRole('status').map(c => c.textContent)
});

// ---------- filter controls ----------
const search = term =>
  fireEvent.change(screen.getByLabelText('Search Products'), {
    target: { value: term }
  });
const pickCategory = value =>
  fireEvent.change(screen.getByLabelText('Category'), { target: { value } });
const pickSort = value =>
  fireEvent.change(screen.getByLabelText('Sort Products'), {
    target: { value }
  });
const cardTitles = () =>
  [...document.querySelectorAll('article.product-card')].map(
    c => within(c).getByRole('heading', { level: 3 }).textContent
  );

// =====================================================================
describe('CART-001: Add the same product three times', () => {
  test('one cart entry with quantity 3; header count 3', () => {
    render(<App />);
    expectHeaderCount(0);

    addToCart(MONITOR, 3);

    expect(cartEntries()).toEqual([
      { name: MONITOR, quantity: 3, subtotal: '£348.30' }
    ]);
    expectHeaderCount(3);
    expect(cartTotalText()).toBe('£348.30');
  });
});

// =====================================================================
describe('CART-002: Add different products', () => {
  test('correct quantities, count and total (2 × £116.10 + 1 × £39.00)', () => {
    render(<App />);

    addToCart(MONITOR, 2);
    addToCart(KEYBOARD, 1);

    expect(cartEntries()).toEqual([
      { name: MONITOR, quantity: 2, subtotal: '£232.20' },
      { name: KEYBOARD, quantity: 1, subtotal: '£39.00' }
    ]);
    expectHeaderCount(3);
    expect(cartTotalText()).toBe('£271.20');
  });
});

// =====================================================================
describe('CART-003: Attempt to add an out-of-stock product', () => {
  test.each(OUT_OF_STOCK)('%s: empty cart stays empty', name => {
    render(<App />);
    const btn = addButtonFor(name);

    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Unavailable');
    fireEvent.click(btn);

    expectHeaderCount(0);
    expect(within(cartRegion()).getByText('Your cart is empty.')).toBeInTheDocument();
  });

  test.each(OUT_OF_STOCK)('%s: existing cart is unchanged', name => {
    render(<App />);
    addToCart(MONITOR, 2);
    const before = cartSnapshot();

    fireEvent.click(addButtonFor(name));

    expect(cartSnapshot()).toEqual(before);
    expect(cartEntries().map(e => e.name)).not.toContain(name);
  });
});

// =====================================================================
describe('CART-004: Reset Cart', () => {
  const resetButtons = {
    'header (mobile)': () =>
      within(screen.getByRole('banner')).getAllByRole('button', {
        name: 'Reset Cart'
      })[0],
    'header (desktop)': () =>
      within(screen.getByRole('banner')).getAllByRole('button', {
        name: 'Reset Cart'
      })[1],
    'cart summary': () =>
      within(cartRegion()).getByRole('button', { name: 'Reset Cart' })
  };

  test.each(Object.keys(resetButtons))(
    'via %s button: cart empty, count 0, total £0.00',
    label => {
      render(<App />);
      addToCart(MONITOR, 2);
      addToCart(KEYBOARD, 1);
      expectHeaderCount(3);

      fireEvent.click(resetButtons[label]());

      // Soft assertions so every expected outcome is reported, not just the first failure.
      expect.soft(cartEntries()).toEqual([]);
      expect
        .soft(within(cartRegion()).queryByText('Your cart is empty.'))
        .toBeInTheDocument();
      screen
        .getAllByRole('status')
        .forEach(c => expect.soft(c).toHaveTextContent('Cart: 0'));
      expect.soft(cartTotalText(), 'cart total shown after reset').toBe('£0.00');

      // Cart keeps working after reset
      addToCart(KEYBOARD, 1);
      expectHeaderCount(1);
      expect(cartTotalText()).toBe('£39.00');
    }
  );
});

// =====================================================================
describe('CART-005: Search/filter/sort regression', () => {
  test('catalogue features work while the cart stays intact', () => {
    render(<App />);
    addToCart(MONITOR, 2);
    addToCart(KEYBOARD, 1);
    const before = cartSnapshot();
    expect(before.total).toBe('£271.20');

    // Search
    search('samsung');
    expect(cardTitles()).toEqual([
      'Samsung Monitor',
      'Samsung Galaxy S26 Ultra',
      'Samsung Galaxy Tab S12 Ultra'
    ]);
    expect(cartSnapshot()).toEqual(before);

    // Category filter
    pickCategory('Accessories');
    expect(cardTitles()).toEqual(['Samsung Monitor']);
    expect(cartSnapshot()).toEqual(before);

    // Stock + sale filters
    fireEvent.click(screen.getByLabelText('In Stock Only'));
    fireEvent.click(screen.getByLabelText('On Sale Only'));
    expect(cardTitles()).toEqual(['Samsung Monitor']);
    expect(cartSnapshot()).toEqual(before);

    // No-match search
    search('zzz-no-such-product');
    expect(
      screen.getByText('No products match your search or filters.')
    ).toBeInTheDocument();
    expect(cartSnapshot()).toEqual(before);

    // Clear filters restores the full catalogue, cart untouched
    fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));
    expect(cardTitles()).toHaveLength(14);
    expect(cartSnapshot()).toEqual(before);

    // Sort
    pickSort('price-asc');
    expect(cardTitles()[0]).toBe('HDMI Cable');
    expect(cardTitles().at(-1)).toBe('Dell Pro 16 Plus Laptop');
    expect(cartSnapshot()).toEqual(before);

    pickSort('price-desc');
    expect(cardTitles()[0]).toBe('Dell Pro 16 Plus Laptop');
    expect(cartSnapshot()).toEqual(before);

    // Adding from a filtered view updates the existing entry, not a duplicate
    search('monitor');
    addToCart(MONITOR, 1);
    expect(cartEntries()).toEqual([
      { name: MONITOR, quantity: 3, subtotal: '£348.30' },
      { name: KEYBOARD, quantity: 1, subtotal: '£39.00' }
    ]);
    expectHeaderCount(4);
    expect(cartTotalText()).toBe('£387.30');
  });
});

// =====================================================================
describe('CART-006: Stock limit (Samsung Monitor, stock 7)', () => {
  test('quantity stays at 7 and Add To Cart is disabled on an eighth attempt', () => {
    render(<App />);

    addToCart(MONITOR, 7);
    expect(cartEntries()).toEqual([
      { name: MONITOR, quantity: 7, subtotal: '£812.70' }
    ]);
    expectHeaderCount(7);
    expect(cartTotalText()).toBe('£812.70');

    // At the limit: catalogue and cart both block further adds
    const addBtn = addButtonFor(MONITOR);
    expect(addBtn).toBeDisabled();
    expect(addBtn).toHaveTextContent('Unavailable');
    expect(availableText(MONITOR)).toBe('Available: 0');
    expect(
      within(cardFor(MONITOR)).getByText('Maximum available quantity in cart')
    ).toBeInTheDocument();
    expect(cartButton('Increase', MONITOR)).toBeDisabled();

    // Eighth attempt, via both entry points
    const before = cartSnapshot();
    fireEvent.click(addBtn);
    fireEvent.click(cartButton('Increase', MONITOR));
    expect(cartSnapshot()).toEqual(before);
  });

  test('decrementing from 7 to 6 re-enables Add To Cart (and it can reach 7 again)', () => {
    render(<App />);
    addToCart(MONITOR, 7);
    expect(addButtonFor(MONITOR)).toBeDisabled();

    fireEvent.click(cartButton('Decrease', MONITOR));

    expect(cartEntries()[0].quantity).toBe(6);
    expectHeaderCount(6);
    expect(cartTotalText()).toBe('£696.60');
    expect(addButtonFor(MONITOR)).toBeEnabled();
    expect(addButtonFor(MONITOR)).toHaveTextContent('Add To Cart');
    expect(availableText(MONITOR)).toBe('Available: 1');
    expect(within(cardFor(MONITOR)).getByText('In Stock')).toBeInTheDocument();
    expect(cartButton('Increase', MONITOR)).toBeEnabled();

    // Round trip: re-adding the freed unit hits the limit again
    addToCart(MONITOR, 1);
    expect(cartEntries()[0].quantity).toBe(7);
    expect(addButtonFor(MONITOR)).toBeDisabled();
  });
});

// =====================================================================
describe('CART-007: Decrease quantity 3 → 2 → 1 → 0', () => {
  test('quantity, count and total update at each step; item removed at zero', () => {
    render(<App />);
    addToCart(MONITOR, 3);
    expectHeaderCount(3);
    expect(cartTotalText()).toBe('£348.30');

    const steps = [
      { quantity: 2, total: '£232.20' },
      { quantity: 1, total: '£116.10' }
    ];
    for (const { quantity, total } of steps) {
      fireEvent.click(cartButton('Decrease', MONITOR));
      expect(cartEntries()).toEqual([
        { name: MONITOR, quantity, subtotal: total }
      ]);
      expectHeaderCount(quantity);
      expect(cartTotalText()).toBe(total);
      expect(availableText(MONITOR)).toBe(`Available: ${7 - quantity}`);
    }

    // 1 → 0 removes the line entirely
    fireEvent.click(cartButton('Decrease', MONITOR));
    expect(cartEntries()).toEqual([]);
    expect(
      within(cartRegion()).getByText('Your cart is empty.')
    ).toBeInTheDocument();
    expectHeaderCount(0);
    expect(cartTotalText()).toBe('£0.00');
    expect(availableText(MONITOR)).toBe('Available: 7');
    expect(
      within(cartRegion()).queryByRole('button', { name: /Monitor/ })
    ).toBeNull();
  });

  test('removing at zero leaves other cart items untouched', () => {
    render(<App />);
    addToCart(KEYBOARD, 1);
    addToCart(MONITOR, 1);

    fireEvent.click(cartButton('Decrease', MONITOR));

    expect(cartEntries()).toEqual([
      { name: KEYBOARD, quantity: 1, subtotal: '£39.00' }
    ]);
    expectHeaderCount(1);
    expect(cartTotalText()).toBe('£39.00');
  });
});

// =====================================================================
describe('CART-008: Remove one of two different products', () => {
  // Remove the first and the last line, to catch position-dependent bugs
  test.each([
    {
      remove: MONITOR,
      keep: { name: KEYBOARD, quantity: 1, subtotal: '£39.00' },
      count: 1,
      total: '£39.00'
    },
    {
      remove: KEYBOARD,
      keep: { name: MONITOR, quantity: 2, subtotal: '£232.20' },
      count: 2,
      total: '£232.20'
    }
  ])(
    'removing $remove leaves only $keep.name, unchanged',
    ({ remove, keep, count, total }) => {
      render(<App />);
      addToCart(MONITOR, 2);
      addToCart(KEYBOARD, 1);
      expectHeaderCount(3);
      expect(cartTotalText()).toBe('£271.20');
      const keptAvailableBefore = availableText(keep.name);

      fireEvent.click(cartButton('Remove', remove));

      expect(cartEntries()).toEqual([keep]);
      expectHeaderCount(count);
      expect(cartTotalText()).toBe(total);

      // Removed product's stock is released; kept product's is not
      expect(availableText(remove)).toBe(
        remove === MONITOR ? 'Available: 7' : 'Available: 8'
      );
      expect(availableText(keep.name)).toBe(keptAvailableBefore);

      // Remaining line's controls still work
      fireEvent.click(cartButton('Increase', keep.name));
      expect(cartEntries()[0].quantity).toBe(keep.quantity + 1);
      expectHeaderCount(count + 1);
    }
  );
});
