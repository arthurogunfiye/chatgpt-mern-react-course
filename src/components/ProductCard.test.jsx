import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('disables Add to Cart for out-of-stock products', () => {
    const product = {
      id: 103,
      name: 'HDMI Cable',
      category: 'Accessories',
      price: 3.99,
      quantity: 0,
      inStock: false,
      onSale: true
    };

    render(<ProductCard product={product} onAddToCart={vi.fn()} />);

    const button = screen.getByRole('button', {
      name: /unavailable/i
    });

    expect(button).toBeDisabled();
  });

  it('calls onAddToCart with the product ID', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();

    const product = {
      id: 104,
      name: 'Samsung Monitor',
      category: 'Accessories',
      price: 129,
      quantity: 7,
      inStock: true,
      onSale: true
    };

    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledWith(104);
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });
});
