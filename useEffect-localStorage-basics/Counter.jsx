import { useReducer } from 'react';

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;

    default:
      return state;
  }
}

function initialiseCount(initialValue) {
  return initialValue + 10;
}

export default function Counter() {
  const [count, dispatch] = useReducer(counterReducer, 0, initialiseCount);

  return (
    <section>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Add</button>
    </section>
  );
}
