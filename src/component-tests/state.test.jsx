import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';
import { testProducts } from '../data/sampleProducts';

beforeEach(() => {
  localStorage.removeItem('mystore-cart');
});

// The cart count renders twice (mobile + desktop nav). Both must agree.
const expectCart = n => {
  const counters = screen.getAllByRole('status');
  expect(counters).toHaveLength(2);
  counters.forEach(c => expect(c).toHaveTextContent(`Cart: ${n}`));
};

const cards = () => document.querySelectorAll('article.product-card');
const cardTitles = () =>
  [...cards()].map(
    c => within(c).getByRole('heading', { level: 3 }).textContent
  );
const cardFor = name =>
  screen.getByRole('heading', { level: 3, name }).closest('article');
const addButtonFor = name => within(cardFor(name)).getByRole('button');
const searchBox = () => screen.getByLabelText('Search Products');
const search = term =>
  fireEvent.change(searchBox(), { target: { value: term } });

describe('STATE-001: Initial render', () => {
  test('cart is 0 and all 16 products are visible', () => {
    render(<App />);
    expectCart(0);
    expect(cards()).toHaveLength(16);
    expect(cardTitles()).toEqual(testProducts.map(p => p.name));
    expect(searchBox()).toHaveValue('');
    expect(
      screen.queryByText('No products match your search or filters.')
    ).toBeNull();
  });
});

describe('STATE-002: Add an in-stock product twice', () => {
  test('cart goes 0 → 1 → 2 for Samsung Monitor', () => {
    render(<App />);
    const btn = addButtonFor('Samsung Monitor');
    expect(btn).toBeEnabled();
    expect(btn).toHaveTextContent('Add To Cart');

    expectCart(0);
    fireEvent.click(btn);
    expectCart(1);
    fireEvent.click(btn);
    expectCart(2);
  });
});

describe('STATE-003: Out-of-stock protection', () => {
  test.each(['HDMI Cable', 'Bose QuietComfort Ultra Headphones'])(
    'clicking %s does not change the cart',
    name => {
      render(<App />);
      // Put a known non-zero value in the cart first so "unchanged" is meaningful
      fireEvent.click(addButtonFor('Toshiba Keyboard'));
      expectCart(1);

      const btn = addButtonFor(name);
      expect(
        within(cardFor(name)).getByText('Out of Stock')
      ).toBeInTheDocument();
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent('Unavailable');

      fireEvent.click(btn);
      fireEvent.click(btn);
      expectCart(1);
    }
  );
});

describe('STATE-004: Mixed-case search with spaces', () => {
  test('"  sAmSuNg  " returns exactly the three Samsung products', () => {
    render(<App />);
    search('  sAmSuNg  ');
    expect(searchBox()).toHaveValue('  sAmSuNg  ');
    expect(cardTitles()).toEqual([
      'Samsung Monitor',
      'Samsung Galaxy S26 Ultra',
      'Samsung Galaxy Tab S12 Ultra'
    ]);
    expect(
      screen.queryByText('No products match your search or filters.')
    ).toBeNull();
  });
});

describe('STATE-005: No matches and search recovery', () => {
  test('empty message appears, then clearing restores 16 products', () => {
    render(<App />);
    search('xyz-no-such-product');
    expect(cards()).toHaveLength(0);
    expect(
      screen.getByText('No products match your search or filters.')
    ).toBeInTheDocument();
    // The "no products at all" message must NOT be shown — data still exists
    expect(screen.queryByText('There are no products available.')).toBeNull();

    search('');
    expect(cards()).toHaveLength(16);
    expect(
      screen.queryByText('No products match your search or filters.')
    ).toBeNull();
  });
});

describe('STATE-006: Reset Cart regression', () => {
  test.each([
    ['desktop', 1],
    ['mobile', 0]
  ])(
    '%s Reset Cart returns cart to 0 and cart keeps working',
    (_label, idx) => {
      render(<App />);
      fireEvent.click(addButtonFor('Samsung Monitor'));
      fireEvent.click(addButtonFor('Apple iPad Air'));
      fireEvent.click(addButtonFor('Samsung Monitor'));
      expectCart(3);

      const resetButtons = within(screen.getByRole('banner')).getAllByRole(
        'button',
        { name: 'Reset Cart' }
      );
      expect(resetButtons).toHaveLength(2);
      fireEvent.click(resetButtons[idx]);
      expectCart(0);

      // Reset on an empty cart stays at 0 (no negatives)
      expect(resetButtons[idx]).toBeDisabled();
      expectCart(0);

      // Cart still increments correctly after reset
      fireEvent.click(addButtonFor('Samsung Monitor'));
      expectCart(1);
    }
  );

  test('reset does not clear the search term or filtered results', () => {
    render(<App />);
    search('samsung');
    fireEvent.click(addButtonFor('Samsung Monitor'));
    expectCart(1);
    fireEvent.click(
      within(screen.getByRole('banner')).getAllByRole('button', {
        name: 'Reset Cart'
      })[0]
    );
    expectCart(0);
    expect(searchBox()).toHaveValue('samsung');
    expect(cards()).toHaveLength(3);
  });
});
