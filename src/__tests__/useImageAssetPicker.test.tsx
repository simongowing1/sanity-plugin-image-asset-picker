import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {act, renderHook} from '@testing-library/react';
import {FormEvent} from 'react';

import {useImageAssetPicker} from '../utils/hooks/useImageAssetPicker';

// Mock Sanity client and functions
const mockFetch = jest.fn();
jest.mock('sanity', () => ({
  useClient: () => ({
    fetch: mockFetch,
  }),
  setIfMissing: (value: any) => ({type: 'setIfMissing', value}),
  insert: (items: any[], position: string, path: any[]) => ({
    type: 'insert',
    items,
    position,
    path,
  }),
}));

describe('useImageAssetPicker', () => {
  const mockOnChange = jest.fn();
  const mockImageAsset = {
    _id: 'test-id',
    url: 'https://example.com/test.jpg',
    title: 'Test Image',
    originalFilename: 'test.jpg',
  };

  beforeEach(() => {
    mockOnChange.mockClear();
    mockFetch.mockClear();
    mockFetch.mockImplementation(() => Promise.resolve([mockImageAsset]));
  });

  it('initializes with default values', async () => {
    const {result} = renderHook(() => useImageAssetPicker({onChange: mockOnChange}));

    // Wait for initial data fetch
    await act(async () => {
      await mockFetch.mock.results[0].value;
    });

    expect(result.current.imageAssets).toEqual([]);
    expect(result.current.imageAssetsLoading).toBe(true);
    expect(result.current.isImageAssetDialogueOpen).toBe(false);
    expect(result.current.searchString).toBeNull();
    expect(result.current.selectedImageAssets.size).toBe(0);
  });

  it('handles checkbox change', () => {
    const {result} = renderHook(() => useImageAssetPicker({onChange: mockOnChange}));

    act(() => {
      result.current.handleCheckboxChange(mockImageAsset);
    });

    expect(result.current.selectedImageAssets.has(mockImageAsset)).toBe(true);

    act(() => {
      result.current.handleCheckboxChange(mockImageAsset);
    });

    expect(result.current.selectedImageAssets.has(mockImageAsset)).toBe(false);
  });

  it('handles save images click', () => {
    const {result} = renderHook(() => useImageAssetPicker({onChange: mockOnChange}));

    act(() => {
      result.current.handleCheckboxChange(mockImageAsset);
      result.current.handleSaveImagesClick();
    });

    expect(mockOnChange).toHaveBeenCalled();
    expect(result.current.selectedImageAssets.size).toBe(0);
    expect(result.current.isImageAssetDialogueOpen).toBe(false);
  });

  it('handles search input change', () => {
    const {result} = renderHook(() => useImageAssetPicker({onChange: mockOnChange}));
    const mockEvent = {
      currentTarget: {value: 'test search'},
    } as FormEvent<HTMLInputElement>;

    act(() => {
      result.current.handleSearchInputChange(mockEvent);
    });

    expect(result.current.searchString).toBe('test search');
  });

  it('handles search submit', async () => {
    const {result} = renderHook(() => useImageAssetPicker({onChange: mockOnChange}));
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSearchInputSubmit(mockEvent);
      await mockFetch.mock.results[0].value;
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('handles dialog close', () => {
    const {result} = renderHook(() => useImageAssetPicker({onChange: mockOnChange}));

    act(() => {
      result.current.handleCheckboxChange(mockImageAsset);
      result.current.setIsImageAssetDialogueOpen(true);
      result.current.handleSearchInputChange({
        currentTarget: {value: 'test'},
      } as FormEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleCloseImageAssetDialogue();
    });

    expect(result.current.isImageAssetDialogueOpen).toBe(false);
    expect(result.current.searchString).toBeNull();
    expect(result.current.selectedImageAssets.size).toBe(0);
  });
});
