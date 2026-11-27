import { useState } from 'react';

export default function useSearchTerm() {
  // TODO 1:
  // Create a state variable named searchTerm.
  // Create its setter named setSearchTerm.
  // Initialise it to an empty string.
  const [searchTerm, setSearchTerm] = useState('');

  // TODO 2:
  // Create a function updateSearch(value).
  // It should update searchTerm to value.
  function updateSearch(value) {
    setSearchTerm(value);
  }

  // TODO 3:
  // Create a function clearSearch().
  // It should reset searchTerm to ''.
  function clearSearch() {
    setSearchTerm('');
  }

  // TODO 4:
  // Return an object containing:
  // searchTerm, updateSearch, clearSearch.
  return { searchTerm, updateSearch, clearSearch };
}
