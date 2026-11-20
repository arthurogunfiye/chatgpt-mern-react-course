import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

const expectCart = n =>
  screen
    .getAllByRole('status')
    .forEach(c => expect(c).toHaveTextContent(`Cart: ${n}`));
const addToCart = name =>
  fireEvent.click(
    within(
      screen.getByRole('heading', { level: 3, name }).closest('article')
    ).getByRole('button')
  );
const click = label =>
  fireEvent.click(screen.getByRole('button', { name: label }));

const LAPTOP = 'HP EliteBook 8 G1i Laptop'; // stock: 5

describe('CART: quantity controls', () => {
  test('+ increases quantity and stops at stock limit', () => {
    render(<App />);
    addToCart(LAPTOP);
    for (let i = 0; i < 4; i++) click(`Increase quantity of ${LAPTOP}`);
    expectCart(5);
    click(`Increase quantity of ${LAPTOP}`);
    expectCart(5); // capped
  });

  test('+ is disabled at the stock limit and re-enabled after -', () => {
    render(<App />);
    addToCart(LAPTOP); // 1
    for (let i = 0; i < 4; i++) click(`Increase quantity of ${LAPTOP}`); // 5
    const plus = screen.getByRole('button', {
      name: `Increase quantity of ${LAPTOP}`
    });
    expect(plus).toBeDisabled();
    click(`Decrease quantity of ${LAPTOP}`);
    expect(plus).toBeEnabled();
  });

  test('Available shows stock minus quantity in cart', () => {
    render(<App />);
    const card = screen
      .getByRole('heading', { level: 3, name: LAPTOP })
      .closest('article');
    expect(within(card).getByText('Available: 5')).toBeInTheDocument();
    addToCart(LAPTOP);
    expect(within(card).getByText('Available: 4')).toBeInTheDocument();
    click(`Remove ${LAPTOP}`);
    expect(within(card).getByText('Available: 5')).toBeInTheDocument();
  });

  test('- decreases quantity and removes the item at 1', () => {
    render(<App />);
    addToCart(LAPTOP);
    click(`Increase quantity of ${LAPTOP}`);
    expectCart(2);
    click(`Decrease quantity of ${LAPTOP}`);
    expectCart(1);
    click(`Decrease quantity of ${LAPTOP}`);
    expectCart(0);
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  test('Remove deletes only that item', () => {
    render(<App />);
    addToCart(LAPTOP);
    addToCart('Toshiba Keyboard');
    click(`Remove ${LAPTOP}`);
    expectCart(1);
    expect(
      screen.queryByRole('button', { name: `Remove ${LAPTOP}` })
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Remove Toshiba Keyboard' })
    ).toBeInTheDocument();
  });
});
