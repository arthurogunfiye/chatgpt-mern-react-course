import useToggle from './useToggle';

function CartPanel() {
  // TODO 1:
  // Call useToggle().
  // Destructure isOpen and toggle.
  const { isOpen, toggle } = useToggle();

  return (
    <section>
      <h2>Shopping Cart</h2>

      {/* Display "Cart Visible" when open.
          Otherwise display "Cart Hidden". */}
      {isOpen ? 'Cart Visible' : 'Cart Hidden'}

      {/* Add a button that calls toggle. */}
      <button type='button' onClick={toggle}>
        Toggle
      </button>
    </section>
  );
}

function FiltersPanel() {
  // TODO 2:
  // Call useToggle() independently.
  // Destructure isOpen and toggle.
  const { isOpen, toggle } = useToggle();

  return (
    <section>
      <h2>Product Filters</h2>

      {/* Display "Filters Visible" when open.
          Otherwise display "Filters Hidden". */}
      {isOpen ? 'Filters Visible' : 'Filters Hidden'}

      {/* Add a button that calls toggle. */}
      <button type='button' onClick={toggle}>
        Toggle
      </button>
    </section>
  );
}

export default function IndependentTogglesPractice() {
  return (
    <main>
      {/* TODO 3: Render CartPanel. */}
      <CartPanel />

      {/* TODO 4: Render FiltersPanel. */}
      <FiltersPanel />
    </main>
  );
}
