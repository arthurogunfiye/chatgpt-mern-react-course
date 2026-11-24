import { useEffect, useState } from 'react';

function EffectPractice() {
  const [cartCount, setCartCount] = useState(0);

  // TODO 1:
  // Write a useEffect that updates document.title
  // to "MyStore Cart: X" where X is cartCount.

  // TODO 2:
  // Add the correct dependency array.
  useEffect(() => {
    document.title = `MyStore Cart: ${cartCount}`;
  }, [cartCount]);

  function handleAdd() {
    // TODO 3:
    // Increase cartCount by 1 using
    // a functional state update.
    setCartCount(prevCount => prevCount + 1);
  }

  return (
    <section>
      <h2>Cart: {cartCount}</h2>

      {/* TODO 4:
          Render a button that calls
          handleAdd when clicked.
      */}
      <button type='button' onClick={handleAdd}>
        Add
      </button>
    </section>
  );
}

export default EffectPractice;
