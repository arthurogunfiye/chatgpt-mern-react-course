import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useSearchTerm from '../hooks/useSearchTerm';

describe('useSearchTerm custom Hook', () => {
  it('initialises searchTerm to an empty string', () => {
    // TODO 1:
    // Call renderHook() with useSearchTerm.
    const { result } = renderHook(() => useSearchTerm());

    // TODO 2:
    // Assert that result.current.searchTerm
    // is an empty string.
    expect(result.current.searchTerm).toBe('');
  });

  it('updates searchTerm when updateSearch is called', () => {
    // TODO 3:
    // Render the Hook.
    const { result } = renderHook(() => useSearchTerm());

    // TODO 4:
    // Inside act(), call updateSearch('Samsung').
    act(() => result.current.updateSearch('Samsung'));
    // TODO 5:
    // Assert searchTerm is now 'Samsung'.
    expect(result.current.searchTerm).toBe('Samsung');
  });

  it('clears the current search term', () => {
    // TODO 1:
    // Render useSearchTerm using renderHook().
    const { result } = renderHook(() => useSearchTerm());

    // TODO 2:
    // Inside act(), call updateSearch('Laptop').
    act(() => result.current.updateSearch('Laptop'));

    // TODO 3:
    // Assert that searchTerm is 'Laptop'.
    expect(result.current.searchTerm).toBe('Laptop');

    // TODO 4:
    // Inside another act(), call clearSearch().
    act(() => result.current.clearSearch());

    // TODO 5:
    // Assert that searchTerm is now ''.
    expect(result.current.searchTerm).toBe('');
  });
});
