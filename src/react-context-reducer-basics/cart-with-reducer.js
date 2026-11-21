import { useReducer } from 'react';

const initialCart = [];

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      const product = action.payload;
      const existingItemInCart = state.find(item => item.id === product.id);

      if (existingItemInCart) {
        return state.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...state,
        {
          id: product.id,
          name: product.name,
          quantity: 1
        }
      ];

    case 'REMOVE':
      return state.filter(item => item.id !== action.payload);

    case 'RESET':
      return [];

    default:
      return state;
  }
}

function App() {
  const [cartItems, dispatch] = useReducer(cartReducer, initialCart);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <section>
      <h2>MyStore Cart: {cartCount}</h2>
      <button
        type='button'
        onClick={() =>
          dispatch({
            type: 'ADD',
            payload: { id: 101, name: 'Samsung Monitor' }
          })
        }
      >
        ADD
      </button>

      <button
        type='button'
        onClick={() => dispatch({ type: 'REMOVE', payload: 101 })}
      >
        REMOVE
      </button>

      <button type='button' onClick={() => dispatch({ type: 'RESET' })}>
        RESET
      </button>
    </section>
  );
}

export default App;
