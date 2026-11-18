export default function selectProducts(products, filters) {
  const {
    searchTerm = '',
    category = 'all',
    inStockOnly = false,
    onSaleOnly = false,
    sortOrder = 'default'
  } = filters;

  const normalisedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(normalisedSearchTerm);

    const matchesCategory = category === 'all' || product.category === category;

    const matchesStock = !inStockOnly || product.inStock;

    const matchesSale = !onSaleOnly || product.onSale;

    return matchesSearch && matchesCategory && matchesStock && matchesSale;
  });

  if (sortOrder === 'price-asc') {
    return [...filteredProducts].sort((a, b) => a.price - b.price);
  }

  if (sortOrder === 'price-desc') {
    return [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  if (sortOrder === 'a-z') {
    return [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  return filteredProducts;
}
