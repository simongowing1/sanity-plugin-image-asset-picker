import {SanityAsset} from '@sanity/image-url/lib/types/types';
import {FormEvent, useEffect, useMemo, useState} from 'react';
import {FormPatch, insert, PatchEvent, setIfMissing, useClient} from 'sanity';

import {
  imageAssetQueryBuilder,
  imageAssetQueryWithoutSearchString,
  imageAssetQueryWithSearchString,
} from '../../utils/helpers/queryHelpers';

type UseImageAssetPickerProps = {
  onChange: (patch: FormPatch | FormPatch[] | PatchEvent) => void;
};

export const useImageAssetPicker = ({onChange}: UseImageAssetPickerProps) => {
  const client = useClient({apiVersion: '2022-11-15'});

  // UI State
  const [isImageAssetDialogueOpen, setIsImageAssetDialogueOpen] = useState(false);

  // Data State
  const [imageAssets, setImageAssets] = useState<SanityAsset[]>([]);
  const [imageAssetsLoading, setImageAssetsLoading] = useState(true);
  const [selectedImageAssets, setSelectedImageAssets] = useState<Set<SanityAsset>>(new Set());
  const selectedImageAssetsArray = useMemo(() => [...selectedImageAssets], [selectedImageAssets]);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(80);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Search State
  const [searchString, setSearchString] = useState<string | null>(null);

  const handleCheckboxChange = (image: SanityAsset) => {
    setSelectedImageAssets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(image)) {
        newSet.delete(image);
      } else {
        newSet.add(image);
      }
      return newSet;
    });
  };

  const handleSaveImagesClick = () => {
    const savedImageAssets: SanityAsset[] = selectedImageAssetsArray.map((image) => ({
      _key: image._id,
      _type: 'image',
      asset: {_ref: image._id, _type: 'reference'},
    }));

    const imagePatches = savedImageAssets.map((image) => insert([image], 'after', [-1]));
    onChange([setIfMissing([]), ...imagePatches]);
    setSelectedImageAssets(new Set());
    setIsImageAssetDialogueOpen(false);
  };

  const handleSearchInputSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setImageAssetsLoading(true);
    const totalQuery = `count(${imageAssetQueryWithSearchString(searchString)})`;
    client.fetch(totalQuery, {searchString}).then((totalCount: number) => {
      setTotalPages(Math.ceil(totalCount / pageSize));
    });
    const query = imageAssetQueryBuilder(
      imageAssetQueryWithSearchString(searchString),
      0,
      pageSize,
    );
    client.fetch(query).then((images: SanityAsset[]) => {
      setImageAssets(images);
      setImageAssetsLoading(false);
    });
  };

  const handleSearchInputChange = (event: FormEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    setSearchString(nextValue);
  };

  const handleCloseImageAssetDialogue = () => {
    setIsImageAssetDialogueOpen(false);
    setSearchString(null);
    setSelectedImageAssets(new Set());
  };

  // Load initial data
  useEffect(() => {
    const totalQuery = `count(${imageAssetQueryWithoutSearchString})`;
    client.fetch(totalQuery).then((totalCount: number) => {
      setTotalPages(Math.ceil(totalCount / pageSize));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data when page changes or dialog opens
  useEffect(() => {
    if (!isImageAssetDialogueOpen) return;

    setImageAssetsLoading(true);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const query = searchString
      ? imageAssetQueryBuilder(imageAssetQueryWithSearchString(searchString), start, end)
      : imageAssetQueryBuilder(imageAssetQueryWithoutSearchString, start, end);

    client.fetch(query).then((images: SanityAsset[]) => {
      setImageAssets(images);
      setImageAssetsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, isImageAssetDialogueOpen]);

  return {
    // State
    imageAssets,
    imageAssetsLoading,
    isImageAssetDialogueOpen,
    searchString,
    selectedImageAssets,
    totalPages,
    page,

    // Handlers
    handleCheckboxChange,
    handleSaveImagesClick,
    handleSearchInputSubmit,
    handleSearchInputChange,
    handleCloseImageAssetDialogue,
    setPage,
    setIsImageAssetDialogueOpen,
  };
};
