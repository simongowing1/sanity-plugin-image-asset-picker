import { Flex, Spinner, Text } from "@sanity/ui"
import { Grid } from "@sanity/ui"
import { Button } from "@sanity/ui"
import { Stack } from "@sanity/ui"
import { ImageAssetCard } from "./ImageAssetCard"
import { SanityAsset } from "@sanity/image-url/lib/types/types"
import { AddIcon } from "@sanity/icons"
interface ImageAssetGridProps {
    imageAssets: SanityAsset[];
    selectedImageAssets: Set<SanityAsset>;
    onSave: () => void;
    onCheckboxChange: (image: SanityAsset) => void;
    onPageChange: (page: number) => void;
    totalPages: number;
    imageAssetsLoading: boolean;
}

export const ImageAssetGrid = (props: ImageAssetGridProps) => {
    const { imageAssets, selectedImageAssets, onSave, onCheckboxChange, onPageChange, totalPages, imageAssetsLoading } = props;
    return (
        <Stack space={4}>
            <Button
                mode="ghost"
                paddingY={2}
                width={'fill'}
                onClick={onSave}
                icon={AddIcon}
                text="Insert Selected Images"
            />
            {imageAssetsLoading ? (
                <Flex align="center" gap={2} paddingY={2}>
                    <Spinner muted />
                    <Text size={1} muted>
                        Loading images...
                    </Text>
                </Flex>
            ) : imageAssets.length === 0 ? (
                <Text size={1}>No images found</Text>
            ) : (
                <Stack space={3}>
                    <Grid columns={4} rows={Math.ceil(imageAssets.length / 4)} gap={3}>
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
    )
}