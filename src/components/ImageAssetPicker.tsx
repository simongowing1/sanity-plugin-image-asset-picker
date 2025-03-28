import {Button, Flex, Inline, Stack, Text} from '@sanity/ui';
import {FolderSimplePlus} from 'phosphor-react';
import {ArrayOfObjectsInputProps} from 'sanity';

import {useImageAssetPicker} from '../utils/hooks/useImageAssetPicker';
import {ImageAssetDialogue} from './ImageAssetDialogue';

type Props = ArrayOfObjectsInputProps;

export function ImageAssetPicker({...props}: Props) {
  const {onChange} = props;

  const {
    imageAssets,
    imageAssetsLoading,
    isImageAssetDialogueOpen,
    searchString,
    selectedImageAssets,
    totalPages,
    handleCheckboxChange,
    handleSaveImagesClick,
    handleSearchInputSubmit,
    handleSearchInputChange,
    handleCloseImageAssetDialogue,
    setPage,
    setIsImageAssetDialogueOpen,
  } = useImageAssetPicker({onChange});

  return (
    <Stack space={6}>
      <Stack space={2}>
        {props.renderDefault(props)}
        <Button
          mode="ghost"
          padding={2}
          width={'fill'}
          onClick={() => setIsImageAssetDialogueOpen(true)}
        >
          <Flex justify="center" align="center">
            <Inline space={3}>
              <FolderSimplePlus size={20} />
              <Text size={1}>Select Uploaded Images</Text>
            </Inline>
          </Flex>
        </Button>
      </Stack>

      {isImageAssetDialogueOpen && (
        <ImageAssetDialogue
          imageAssets={imageAssets}
          imageAssetsLoading={imageAssetsLoading}
          searchString={searchString}
          selectedImageAssets={selectedImageAssets}
          totalPages={totalPages}
          onCheckboxChange={handleCheckboxChange}
          onSave={handleSaveImagesClick}
          onSearchSubmit={handleSearchInputSubmit}
          onSearchChange={handleSearchInputChange}
          onClose={handleCloseImageAssetDialogue}
          onPageChange={setPage}
        />
      )}
    </Stack>
  );
}
