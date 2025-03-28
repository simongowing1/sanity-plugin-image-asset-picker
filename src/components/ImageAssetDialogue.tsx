import {SanityAsset} from '@sanity/image-url/lib/types/types';
import {Dialog, Stack} from '@sanity/ui';
import {FormEvent} from 'react';

import {ImageAssetGrid} from './ImageAssetGrid';
import {ImageSearchForm} from './ImageSearchForm';
type ImageAssetDialogueProps = {
  imageAssets: SanityAsset[];
  imageAssetsLoading: boolean;
  searchString: string | null;
  selectedImageAssets: Set<SanityAsset>;
  totalPages: number;
  page: number;
  onCheckboxChange: (image: SanityAsset) => void;
  onSave: () => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSearchChange: (event: FormEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onPageChange: (page: number) => void;
};

export function ImageAssetDialogue({
  imageAssets,
  imageAssetsLoading,
  searchString,
  selectedImageAssets,
  totalPages,
  onCheckboxChange,
  onSave,
  onSearchSubmit,
  onSearchChange,
  onClose,
  onPageChange,
}: ImageAssetDialogueProps) {
  return (
    <Dialog id="image-asset-dialogue" width={100} header="Uploaded Images" onClose={onClose}>
      <Stack space={4} padding={4}>
        <Stack space={6}>
          <ImageSearchForm
            onSearchSubmit={onSearchSubmit}
            onSearchChange={onSearchChange}
            searchString={searchString}
          />
          <ImageAssetGrid
            imageAssets={imageAssets}
            selectedImageAssets={selectedImageAssets}
            onSave={onSave}
            onCheckboxChange={onCheckboxChange}
            onPageChange={onPageChange}
            totalPages={totalPages}
            imageAssetsLoading={imageAssetsLoading}
          />
        </Stack>
      </Stack>
    </Dialog>
  );
}
