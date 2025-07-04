import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {SanityAsset} from '@sanity/image-url/lib/types/types';
import {fireEvent, render, screen} from '@testing-library/react';

import {ImageAssetCard} from '../components/ImageAssetCard';

describe('ImageAssetCard', () => {
  const mockImage: SanityAsset = {
    _id: 'test-id',
    url: 'https://example.com/test.jpg',
    title: 'Test Image',
    originalFilename: 'test.jpg',
  };

  const mockHandleCheckboxChange = jest.fn();
  const mockSelectedImageAssets = new Set<SanityAsset>();

  beforeEach(() => {
    mockHandleCheckboxChange.mockClear();
  });

  it('renders correctly with unselected image', () => {
    render(
      <ImageAssetCard
        image={mockImage}
        selectedImageAssets={mockSelectedImageAssets}
        handleCheckboxChange={mockHandleCheckboxChange}
        index={0}
      />,
    );

    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByText('Not selected')).toBeInTheDocument();
    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByText('Test Image')).toBeInTheDocument();
  });

  it('renders correctly with selected image', () => {
    const selectedAssets = new Set([mockImage]);
    render(
      <ImageAssetCard
        image={mockImage}
        selectedImageAssets={selectedAssets}
        handleCheckboxChange={mockHandleCheckboxChange}
        index={0}
      />,
    );

    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByText('Selected')).toBeInTheDocument();
    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls handleCheckboxChange when checkbox is clicked', () => {
    render(
      <ImageAssetCard
        image={mockImage}
        selectedImageAssets={mockSelectedImageAssets}
        handleCheckboxChange={mockHandleCheckboxChange}
        index={0}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockHandleCheckboxChange).toHaveBeenCalledWith(mockImage);
  });

  it('displays fallback to originalFilename when title is not available', () => {
    const imageWithoutTitle = {
      ...mockImage,
      title: undefined,
    };

    render(
      <ImageAssetCard
        image={imageWithoutTitle}
        selectedImageAssets={mockSelectedImageAssets}
        handleCheckboxChange={mockHandleCheckboxChange}
        index={0}
      />,
    );

    // @ts-expect-error: Jest DOM matchers are not recognized by TS due to type config
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });
});
