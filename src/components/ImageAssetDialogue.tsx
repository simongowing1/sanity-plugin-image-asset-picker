import { Button, Dialog, Flex, Grid, Inline, Stack, Text, TextInput } from '@sanity/ui';
import { FloppyDisk } from 'phosphor-react';
import { FormEvent } from 'react';
import { SanityAsset } from '@sanity/image-url/lib/types/types';
import { ImageAssetCard } from './ImageAssetCard';
import { ImageSearchForm } from './ImageSearchForm';

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

                    <Stack space={4}>
                        <Button onClick={onSave} mode="ghost" padding={2} width={'fill'}>
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
                                            handleCheckboxChange={onCheckboxChange}
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
                                            onClick={() => onPageChange(index + 1)}
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
    );
};