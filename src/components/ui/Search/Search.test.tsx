import { render, screen, fireEvent } from '@testing-library/react';
import Search from './index';

describe('Search', () => {
  it('updates query on change', () => {
    const setQuery = jest.fn();
    render(<Search query="" setQuery={setQuery} />);

    fireEvent.change(screen.getByPlaceholderText(/pesquisar/i), {
      target: { value: 'abc' },
    });

    expect(setQuery).toHaveBeenCalledWith('abc');
  });

  it('submit does not reload', () => {
    const setQuery = jest.fn();
    render(<Search query="x" setQuery={setQuery} />);
    const form = screen.getByRole('search');
    fireEvent.submit(form);
    expect(setQuery).not.toHaveBeenCalled();
  });
});
