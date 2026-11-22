import { useReducer } from 'react';

const initialCart = [];

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
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
    }

    case 'REMOVE_ITEM': {
      return state
        .map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);
    }

    case 'RESET_CART':
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
            type: 'ADD_ITEM',
            payload: { id: 101, name: 'Samsung Monitor' }
          })
        }
      >
        ADD
      </button>

      <button
        type='button'
        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: 101 })}
      >
        REMOVE
      </button>

      <button type='button' onClick={() => dispatch({ type: 'RESET_CART' })}>
        RESET
      </button>
    </section>
  );
}

export default App;
