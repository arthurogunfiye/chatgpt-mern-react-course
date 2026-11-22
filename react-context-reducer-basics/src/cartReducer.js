export function cartReducer(state, action) {
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

    case 'DECREASE_QUANTITY': {
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
