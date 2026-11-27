import useSearchTerm from './useSearchTerm';

function SearchPractice() {
  // TODO 1:
  // Call useSearchTerm().
  // Destructure:
  // searchTerm, updateSearch, clearSearch.
  const { searchTerm, updateSearch, clearSearch } = useSearchTerm();

  return (
    <section>
      <h2>Search Practice</h2>

      {/* TODO 2:
          Create a text input.
          Its value must come from searchTerm.
          Its onChange must call updateSearch()
          with the latest input value.
      */}
      <label htmlFor='search-input'>Search</label>
      <input
        type='search'
        name='search-input'
        id='search-input'
        value={searchTerm}
        onChange={event => updateSearch(event.target.value)}
      />

      {/* TODO 3:
          Display the text:
          "Searching for: "
          followed by searchTerm.
      */}
      <p>Searching for: {searchTerm}</p>

      {/* TODO 4:
          Create a button labelled "Clear Search".
          It should call clearSearch on click.
      */}
      <button type='button' onClick={clearSearch}>
        Clear Search
      </button>
    </section>
  );
}

export default SearchPractice;
