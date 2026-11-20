import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';
import { testProducts } from '../data/sampleProducts';
import selectVisibleProducts from '../utils/selectVisibleProducts';

// ---------- helpers (same conventions as state.test.jsx) ----------
const cards = () => document.querySelectorAll('article.product-card');
const cardTitles = () =>
  [...cards()].map(
    c => within(c).getByRole('heading', { level: 3 }).textContent
  );
const sourceOrder = testProducts.map(p => p.name);

const searchBox = () => screen.getByLabelText('Search Products');
const categorySelect = () => screen.getByLabelText('Category');
const sortSelect = () => screen.getByLabelText('Sort Products');
const inStockBox = () => screen.getByLabelText('In Stock Only');
const onSaleBox = () => screen.getByLabelText('On Sale Only');

const search = term =>
  fireEvent.change(searchBox(), { target: { value: term } });
const pickCategory = value =>
  fireEvent.change(categorySelect(), { target: { value } });
const pickSort = value => fireEvent.change(sortSelect(), { target: { value } });

const NO_MATCH = 'No products match your search or filters.';

const expectCart = n => {
  const counters = screen.getAllByRole('status');
  expect(counters).toHaveLength(2);
  counters.forEach(c => expect(c).toHaveTextContent(`Cart: ${n}`));
};

const expectDefaultFilterState = () => {
  expect(searchBox()).toHaveValue('');
  expect(categorySelect()).toHaveValue('all');
  expect(inStockBox()).not.toBeChecked();
  expect(onSaleBox()).not.toBeChecked();
  expect(sortSelect()).toHaveValue('default');
};

// ---------- FILTER-001 ----------
describe('FILTER-001: Category filtering', () => {
  test('Laptops shows exactly 3 laptop products, All Categories restores 14', () => {
    render(<App />);
    expect(cards()).toHaveLength(14);

    pickCategory('Laptops');
    expect(cardTitles()).toEqual([
      'HP EliteBook 8 G1i Laptop',
      'Dell Pro 16 Plus Laptop',
      'Acer Aspire 14 AI Laptop'
    ]);
    cards().forEach(c =>
      expect(within(c).getByText('Category: Laptops')).toBeInTheDocument()
    );
    expect(screen.queryByText(NO_MATCH)).toBeNull();

    pickCategory('all');
    expect(cardTitles()).toEqual(sourceOrder);
  });
});

// ---------- FILTER-002 ----------
describe('FILTER-002: Stock filtering', () => {
  test('In Stock Only shows exactly 10 purchasable products', () => {
    render(<App />);
    fireEvent.click(inStockBox());
    expect(inStockBox()).toBeChecked();

    expect(cards()).toHaveLength(10);
    cards().forEach(c => {
      expect(within(c).getByText('In Stock')).toBeInTheDocument();
      const btn = within(c).getByRole('button');
      expect(btn).toBeEnabled();
      expect(btn).toHaveTextContent('Add To Cart');
    });

    const titles = cardTitles();
    [
      'Bose QuietComfort Ultra Headphones',
      'HDMI Cable',
      'Samsung Galaxy Tab S12 Ultra',
      'Google Pixel 11 Pro'
    ].forEach(name => expect(titles).not.toContain(name));

    fireEvent.click(inStockBox());
    expect(cards()).toHaveLength(14);
  });
});

// ---------- FILTER-003 ----------
describe('FILTER-003: Sale filtering', () => {
  test('On Sale Only shows exactly 7 products, each with a SALE badge', () => {
    render(<App />);
    fireEvent.click(onSaleBox());
    expect(onSaleBox()).toBeChecked();

    expect(cardTitles()).toEqual([
      'HP EliteBook 8 G1i Laptop',
      'Samsung Monitor',
      'Samsung Galaxy S26 Ultra',
      'Google Pixel Tablet',
      'HDMI Cable',
      'Samsung Galaxy Tab S12 Ultra',
      'Google Pixel 11 Pro'
    ]);
    cards().forEach(c =>
      expect(within(c).getByText(/^SALE/)).toBeInTheDocument()
    );

    // Out-of-stock sale items are still listed, but not purchasable
    const hdmi = screen
      .getByRole('heading', { level: 3, name: 'HDMI Cable' })
      .closest('article');
    expect(within(hdmi).getByRole('button')).toBeDisabled();
    expect(within(hdmi).getByRole('button')).toHaveTextContent('Unavailable');

    fireEvent.click(onSaleBox());
    expect(cards()).toHaveLength(14);
  });
});

// ---------- FILTER-004 ----------
describe('FILTER-004: Combined filters', () => {
  test('Samsung + Smartphones + in-stock + on-sale returns only Samsung Galaxy S26 Ultra', () => {
    render(<App />);

    search('Samsung');
    expect(cardTitles()).toEqual([
      'Samsung Monitor',
      'Samsung Galaxy S26 Ultra',
      'Samsung Galaxy Tab S12 Ultra'
    ]);

    pickCategory('Smartphones');
    expect(cards()).toHaveLength(1);

    fireEvent.click(inStockBox());
    fireEvent.click(onSaleBox());

    expect(cardTitles()).toEqual(['Samsung Galaxy S26 Ultra']);
    const card = cards()[0];
    expect(
      within(card).getByText('Price: £1,529.00', { exact: false })
    ).toBeInTheDocument();
    expect(within(card).getByText(/^SALE/)).toBeInTheDocument();
    expect(within(card).getByText('In Stock')).toBeInTheDocument();
    expect(within(card).getByRole('button')).toBeEnabled();
  });

  test('filters combine with AND: Samsung + Tablets + in-stock + on-sale has no matches', () => {
    render(<App />);
    search('Samsung');
    fireEvent.click(inStockBox());
    fireEvent.click(onSaleBox());
    pickCategory('Tablets');

    // Galaxy Tab S12 Ultra is a Samsung tablet on sale, but out of stock
    expect(cards()).toHaveLength(0);
    expect(screen.getByText(NO_MATCH)).toBeInTheDocument();
  });
});

// ---------- FILTER-005 ----------
describe('FILTER-005: Sorting and reset regression', () => {
  const ascending = [
    'HDMI Cable',
    'Toshiba Keyboard',
    'Samsung Monitor',
    'Bose QuietComfort Ultra Headphones',
    'Google Pixel Tablet',
    'Acer Aspire 14 AI Laptop',
    'Google Pixel 11 Pro',
    'Huawei Mate XT Phone',
    'Apple iPhone 18 Pro',
    'Apple iPad Air',
    'Samsung Galaxy Tab S12 Ultra',
    'Samsung Galaxy S26 Ultra',
    'HP EliteBook 8 G1i Laptop',
    'Dell Pro 16 Plus Laptop'
  ];

  const descending = [
    'Dell Pro 16 Plus Laptop',
    'HP EliteBook 8 G1i Laptop',
    'Samsung Galaxy S26 Ultra',
    // £1199 ties keep source order
    'Apple iPhone 18 Pro',
    'Apple iPad Air',
    'Samsung Galaxy Tab S12 Ultra',
    'Huawei Mate XT Phone',
    'Google Pixel 11 Pro',
    'Acer Aspire 14 AI Laptop',
    'Google Pixel Tablet',
    'Bose QuietComfort Ultra Headphones',
    'Samsung Monitor',
    'Toshiba Keyboard',
    'HDMI Cable'
  ];

  const prices = () =>
    [...cards()].map(c =>
      Number(
        c.querySelector('.product-price').textContent.replace(/[^\d.]/g, '')
      )
    );

  test('ascending, descending and default orders are correct', () => {
    render(<App />);
    expect(cardTitles()).toEqual(sourceOrder);

    pickSort('price-asc');
    expect(cardTitles()).toEqual(ascending);
    const asc = prices();
    expect(asc).toEqual([...asc].sort((a, b) => a - b));

    pickSort('price-desc');
    expect(cardTitles()).toEqual(descending);
    const desc = prices();
    expect(desc).toEqual([...desc].sort((a, b) => b - a));

    pickSort('default');
    expect(cardTitles()).toEqual(sourceOrder);
  });

  test('sorting does not mutate the source array', () => {
    const before = testProducts.map(p => ({ ...p }));
    const sourceRef = testProducts;

    ['price-asc', 'price-desc', 'a-z'].forEach(sortOrder => {
      const result = selectVisibleProducts(testProducts, { sortOrder });
      expect(result).not.toBe(testProducts);
    });

    expect(testProducts).toBe(sourceRef);
    expect(testProducts).toEqual(before);
  });

  test('Clear Filters resets every control and leaves the cart unchanged', () => {
    render(<App />);
    const monitor = screen
      .getByRole('heading', { level: 3, name: 'Samsung Monitor' })
      .closest('article');
    fireEvent.click(within(monitor).getByRole('button'));
    fireEvent.click(within(monitor).getByRole('button'));
    expectCart(2);

    search('apple');
    pickCategory('Tablets');
    fireEvent.click(inStockBox());
    fireEvent.click(onSaleBox());
    pickSort('price-desc');
    expect(cards()).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

    expectDefaultFilterState();
    expect(cardTitles()).toEqual(sourceOrder);
    expect(screen.queryByText(NO_MATCH)).toBeNull();
    expectCart(2);
  });
});

// ---------- FILTER-006 ----------
describe('FILTER-006: Alphabetical (A-Z) ordering', () => {
  const alphabetical = [
    'Acer Aspire 14 AI Laptop',
    'Apple iPad Air',
    'Apple iPhone 18 Pro',
    'Bose QuietComfort Ultra Headphones',
    'Dell Pro 16 Plus Laptop',
    'Google Pixel 11 Pro',
    'Google Pixel Tablet',
    'HDMI Cable',
    'HP EliteBook 8 G1i Laptop',
    'Huawei Mate XT Phone',
    'Samsung Galaxy S26 Ultra',
    'Samsung Galaxy Tab S12 Ultra',
    'Samsung Monitor',
    'Toshiba Keyboard'
  ];

  const indexOf = name => cardTitles().indexOf(name);

  test('A-Z orders all 14 products alphabetically', () => {
    render(<App />);
    pickSort('a-z');
    expect(cardTitles()).toEqual(alphabetical);

    // Each adjacent pair is in non-descending locale order
    const titles = cardTitles();
    for (let i = 1; i < titles.length; i++) {
      expect(titles[i - 1].localeCompare(titles[i])).toBeLessThanOrEqual(0);
    }
  });

  test('handles shared prefixes, digits and mixed case', () => {
    render(<App />);
    pickSort('a-z');
    expect(indexOf('Apple iPad Air')).toBeLessThan(
      indexOf('Apple iPhone 18 Pro')
    );
    expect(indexOf('Google Pixel 11 Pro')).toBeLessThan(
      indexOf('Google Pixel Tablet')
    );
    expect(indexOf('HDMI Cable')).toBeLessThan(
      indexOf('HP EliteBook 8 G1i Laptop')
    );
    expect(indexOf('HP EliteBook 8 G1i Laptop')).toBeLessThan(
      indexOf('Huawei Mate XT Phone')
    );
  });

  test('A-Z is applied after category filtering', () => {
    render(<App />);
    pickSort('a-z');
    pickCategory('Laptops');
    expect(cardTitles()).toEqual([
      'Acer Aspire 14 AI Laptop',
      'Dell Pro 16 Plus Laptop',
      'HP EliteBook 8 G1i Laptop'
    ]);
  });

  test('A-Z is applied after search filtering', () => {
    render(<App />);
    pickSort('a-z');
    search('samsung');
    expect(cardTitles()).toEqual([
      'Samsung Galaxy S26 Ultra',
      'Samsung Galaxy Tab S12 Ultra',
      'Samsung Monitor'
    ]);
  });

  test('switching back to Default Order restores source order', () => {
    render(<App />);
    pickSort('a-z');
    expect(cardTitles()).toEqual(alphabetical);
    pickSort('default');
    expect(cardTitles()).toEqual(sourceOrder);
  });
});
