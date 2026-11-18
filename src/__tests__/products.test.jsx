import { describe, test, expect, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import ProductCatalogue from '../components/ProductCatalogue';
import { testProducts } from '../data/sampleProducts';

const byName = name => testProducts.find(p => p.name === name);
const cardFor = (product, onAddToCart = () => {}) => {
  const { container } = render(
    <ProductCard product={product} onAddToCart={onAddToCart} />
  );
  return container.querySelector('article');
};
const renderCatalogue = (visibleProducts, allProducts = testProducts) =>
  render(
    <ProductCatalogue
      visibleProducts={visibleProducts}
      allProducts={allProducts}
      onAddToCart={() => {}}
    />
  );

const inStock = testProducts.filter(p => p.inStock);
const outOfStock = testProducts.filter(p => !p.inStock);
const onSale = testProducts.filter(p => p.onSale);

describe('PROP-001: ProductCard displays correct name, category and price', () => {
  test.each([
    ['HP EliteBook 8 G1i Laptop', 'Laptops', '£1,713.59'],
    ['Samsung Monitor', 'Accessories', '£129.00'],
    ['HDMI Cable', 'Accessories', '£3.99'],
    ['Google Pixel Tablet', 'Tablets', '£599.00'],
    ['Dell Pro 16 Plus Laptop', 'Laptops', '£1,975.20']
  ])('%s', (name, category, price) => {
    const card = cardFor(byName(name));
    const q = within(card);
    expect(q.getByRole('heading', { level: 3 })).toHaveTextContent(name);
    expect(q.getByText(`Category: ${category}`)).toBeInTheDocument();
    expect(q.getByText(`Price: ${price}`)).toBeInTheDocument();
  });
});

describe('PROP-002: In-stock products have an enabled Add To Cart button', () => {
  test.each(inStock.map(p => [p.name, p]))('%s', (_name, product) => {
    const onAddToCart = vi.fn();
    const card = cardFor(product, onAddToCart);
    const btn = within(card).getByRole('button', { name: 'Add To Cart' });
    expect(btn).toBeEnabled();
    expect(within(card).getByText('In Stock')).toBeInTheDocument();

    fireEvent.click(btn);
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(product.id);
  });
});

describe('PROP-003: Out-of-stock products have a disabled Unavailable button', () => {
  test.each(outOfStock.map(p => [p.name, p]))('%s', (_name, product) => {
    const onAddToCart = vi.fn();
    const card = cardFor(product, onAddToCart);
    const btn = within(card).getByRole('button', { name: 'Unavailable' });
    expect(btn).toBeDisabled();
    expect(within(card).getByText('Out of Stock')).toBeInTheDocument();

    fireEvent.click(btn);
    expect(onAddToCart).not.toHaveBeenCalled();
  });

  test('there are exactly 4 out-of-stock products', () => {
    expect(outOfStock.map(p => p.name)).toEqual([
      'Bose QuietComfort Ultra Headphones',
      'HDMI Cable',
      'Samsung Galaxy Tab S12 Ultra',
      'Google Pixel 11 Pro'
    ]);
  });
});

describe('PROP-004: SALE badge appears only for sale products', () => {
  test.each(testProducts.map(p => [p.name, p.onSale, p]))(
    '%s (onSale=%s)',
    (_name, isOnSale, product) => {
      const card = cardFor(product);
      const badge = within(card).queryByText('SALE');
      if (isOnSale) expect(badge).toBeInTheDocument();
      else expect(badge).not.toBeInTheDocument();
    }
  );

  test('exactly 7 of the 14 products show a SALE badge in the catalogue', () => {
    renderCatalogue(testProducts);
    expect(onSale).toHaveLength(7);
    expect(screen.getAllByText('SALE')).toHaveLength(7);
  });
});

describe('PROP-005: Catalogue rendering and empty states', () => {
  test('renders all 14 product cards in source order', () => {
    const { container } = renderCatalogue(testProducts);
    const cards = container.querySelectorAll('article.product-card');
    expect(cards).toHaveLength(14);
    expect([...cards].map(c => c.querySelector('h3').textContent)).toEqual(
      testProducts.map(p => p.name)
    );
    expect(screen.queryByText('There are no products available.')).toBeNull();
    expect(screen.queryByText('No products match your search or filters.')).toBeNull();
  });

  test('renders only the visible products it is given', () => {
    const { container } = renderCatalogue(onSale);
    expect(container.querySelectorAll('article.product-card')).toHaveLength(7);
  });

  test('no products at all shows the "no products available" message', () => {
    const { container } = renderCatalogue([], []);
    expect(screen.getByText('There are no products available.')).toBeInTheDocument();
    expect(screen.queryByText('No products match your search or filters.')).toBeNull();
    expect(container.querySelectorAll('article.product-card')).toHaveLength(0);
  });

  test('products exist but none are visible shows the "no match" message', () => {
    const { container } = renderCatalogue([], testProducts);
    expect(screen.getByText('No products match your search or filters.')).toBeInTheDocument();
    expect(screen.queryByText('There are no products available.')).toBeNull();
    expect(container.querySelectorAll('article.product-card')).toHaveLength(0);
  });
});
