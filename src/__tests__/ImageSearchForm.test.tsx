import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {fireEvent, render, screen} from '@testing-library/react';

import {ImageSearchForm} from '../components/ImageSearchForm';

describe('ImageSearchForm', () => {
  const mockOnSearchSubmit = jest.fn();
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    mockOnSearchSubmit.mockClear();
    mockOnSearchChange.mockClear();
  });

  it('renders search input and button', () => {
    render(
      <ImageSearchForm
        onSearchSubmit={mockOnSearchSubmit}
        onSearchChange={mockOnSearchChange}
        searchString={null}
      />,
    );

    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByPlaceholderText('Search for images by filename')).toBeInTheDocument();
    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('handles search input change', () => {
    render(
      <ImageSearchForm
        onSearchSubmit={mockOnSearchSubmit}
        onSearchChange={mockOnSearchChange}
        searchString={null}
      />,
    );

    const input = screen.getByPlaceholderText('Search for images by filename');
    fireEvent.change(input, {target: {value: 'test'}});

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it('handles form submission', () => {
    render(
      <ImageSearchForm
        onSearchSubmit={mockOnSearchSubmit}
        onSearchChange={mockOnSearchChange}
        searchString={null}
      />,
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnSearchSubmit).toHaveBeenCalled();
  });

  it('displays existing search string', () => {
    render(
      <ImageSearchForm
        onSearchSubmit={mockOnSearchSubmit}
        onSearchChange={mockOnSearchChange}
        searchString="existing search"
      />,
    );

    const input = screen.getByPlaceholderText('Search for images by filename');
    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(input).toHaveValue('existing search');
  });
});
