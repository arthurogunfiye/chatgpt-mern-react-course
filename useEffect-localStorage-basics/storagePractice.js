const cartItems = [
  {
    id: 104,
    name: 'Samsung Monitor',
    quantity: 2
  }
];

// TODO 1:
// Convert cartItems into a JSON string.
// Store the result in a variable named cartJSON.
const cartJSON = JSON.stringify(cartItems);

// TODO 2:
// Save cartJSON to localStorage
// using the key 'mystore-practice-cart'.
localStorage.setItem('mystore-practice-cart', cartJSON);

// TODO 3:
// Retrieve the saved string using getItem().
// Store it in a variable named savedCartJSON.
const savedCartJSON = localStorage.getItem('mystore-practice-cart');

// TODO 4:
// Convert savedCartJSON back into
// a JavaScript array named restoredCart.
const restoredCart = JSON.parse(savedCartJSON);

// TODO 5:
// Log the quantity of the first item
// in restoredCart to the console.
console.log(restoredCart[0]);
console.log('Quantity:', restoredCart[0].quantity);
