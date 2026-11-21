import { useReducer } from 'react';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      // TODO 1:
      // Return state increased by 1.
      return state + 1;

    case 'REMOVE':
      // TODO 2:
      // Return state decreased by 1.
      // Do not allow the count below zero.
      return Math.max(0, state - 1);

    case 'RESET':
      // TODO 3:
      // Return zero.
      return 0;

    default:
      return state;
  }
}

function CartCounter() {
  // TODO 4:
  // Initialise useReducer with cartReducer
  // and initial state 0.
  const [count, dispatch] = useReducer(cartReducer, 0);

  return (
    <section>
      <p>Cart: {count}</p>

      {/* TODO 5:
          Add three buttons:
          Add -> dispatch ADD
          Remove -> dispatch REMOVE
          Reset -> dispatch RESET
      */}
      <button type='button' onClick={() => dispatch({ type: 'ADD' })}>
        Add
      </button>
      <button type='button' onClick={() => dispatch({ type: 'REMOVE' })}>
        Remove
      </button>
      <button type='button' onClick={() => dispatch({ type: 'RESET' })}>
        Reset
      </button>
    </section>
  );
}

export default CartCounter;
