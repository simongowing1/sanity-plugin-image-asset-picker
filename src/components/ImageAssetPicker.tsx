import { Button, Dialog, Flex, Grid, Inline, Stack, Text, TextInput } from '@sanity/ui';
import { FloppyDisk, FolderSimplePlus } from 'phosphor-react';
import { ArrayOfObjectsInputProps } from 'sanity';
import { ImageAssetCard } from './ImageAssetCard';
import { useImageAssetPicker } from '../../utils/hooks/useImageAssetPicker';

type Props = ArrayOfObjectsInputProps

export function ImageAssetPicker({ ...props }: Props) {
    const { onChange } = props;

    const {
        imageAssets,
        imageAssetsLoading,
        isImageAssetDialogueOpen,
        selectedImageAssets,
        totalPages,
        handleSaveImagesClick,
        handleSearchInputSubmit,
        handleSearchInputChange,
        handleCheckboxChange,
        handleCloseImageAssetDialogue,
        setPage,
        setIsImageAssetDialogueOpen,
        searchString,
    } = useImageAssetPicker({ onChange });

    return (
        <Stack space={6}>
            <Stack space={2}>
                {props.renderDefault(props)}
                <Button mode="ghost" padding={2} width={'fill'} onClick={() => setIsImageAssetDialogueOpen(true)}>
                    <Flex justify="center" align="center">
                        <Inline space={3}>
                            <FolderSimplePlus size={20} />
                            <Text size={1}>Select Uploaded Images</Text>
                        </Inline>
                    </Flex>
                </Button>
            </Stack>

            {isImageAssetDialogueOpen &&
                <Dialog id="image-asset-dialogue" width={100} header="Uploaded Images" onClose={handleCloseImageAssetDialogue}>
                    <Stack space={4} padding={4}>
                        <Stack space={6}>
                            <form onSubmit={handleSearchInputSubmit}>
                                <Flex direction={'column'} gap={2}>
                                    <TextInput
                                        width={'fill'}
                                        type="text"
                                        value={searchString || ''}
                                        onChange={handleSearchInputChange}
                                        placeholder="Search for images by filename"
                                    />
                                    <Button type="submit" mode="ghost" padding={3} width={'fill'}>
                                        <Flex justify="center" align="center">
                                            <Text size={1}>Search</Text>
                                        </Flex>
                                    </Button>
                                </Flex>
                            </form>

                            <Stack space={4}>
                                <Button onClick={handleSaveImagesClick} mode="ghost" padding={2} width={'fill'}>
                                    <Flex justify="center" align="center">
                                        <Inline space={3}>
                                            <FloppyDisk size={20} />
                                            <Text size={1}>Save selected images</Text>
                                        </Inline>
                                    </Flex>
                                </Button>
                                {imageAssetsLoading ? (
                                    <Text size={1}>Loading images...</Text>
                                ) : imageAssets.length === 0 ? (
                                    <Text size={1}>No images found</Text>
                                ) : (
                                    <Stack space={2}>
                                        <Grid columns={4} rows={Math.ceil(imageAssets.length / 4)} gap={1}>
                                            {imageAssets.map((image, index) => (
                                                <ImageAssetCard
                                                    key={image._id || index}
                                                    image={image}
                                                    selectedImageAssets={selectedImageAssets}
                                                    handleCheckboxChange={handleCheckboxChange}
                                                    index={index}
                                                />
                                            ))}
                                        </Grid>
                                        <Grid columns={12} rows={totalPages / 12} gap={1}>
                                            {[...Array(totalPages)].map((_, index) => (
                                                <Button
                                                    key={index}
                                                    mode="ghost"
                                                    padding={3}
                                                    width={'fill'}
                                                    onClick={() => setPage(index + 1)}
                                                >
                                                    <Flex justify="center" align="center">
                                                        <Text size={1}>{index + 1}</Text>
                                                    </Flex>
                                                </Button>
                                            ))}
                                        </Grid>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </Dialog>
            }
        </Stack>
    )
};
