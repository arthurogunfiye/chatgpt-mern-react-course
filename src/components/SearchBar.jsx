const SearchBar = ({ searchTerm, onSearchTerm }) => {
  function handleChange(event) {
    onSearchTerm(event.target.value);
  }

  return (
    <div className='search-bar'>
      <label htmlFor='product-search'>Search Products</label>
      <input
        id='product-search'
        type='search'
        value={searchTerm}
        onChange={handleChange}
        placeholder='Search MyStore...'
      />
      <p>Searching for: {searchTerm}</p>
    </div>
  );
};

export default SearchBar;
