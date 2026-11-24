function loadSavedCart() {
  try {
    // TODO 1:
    // Retrieve 'mystore-practice-cart'
    // from localStorage.
    const savedCart = localStorage.getItem('mystore-practice-cart');

    // TODO 2:
    // If nothing was saved, return [].
    if (savedCart === null) return [];

    // TODO 3:
    // Parse the saved JSON.
    const parsedSavedCart = JSON.parse(savedCart);

    // TODO 4:
    // Check that the result is an array.
    // If it isn't, return [].
    if (!Array.isArray(parsedSavedCart)) return [];

    // TODO 5:
    // Return the restored array.
    return parsedSavedCart;
  } catch (error) {
    return [];
  }
}
