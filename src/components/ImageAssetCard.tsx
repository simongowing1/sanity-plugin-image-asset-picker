import { Flex, Checkbox, Stack, Card, Text } from "@sanity/ui";
import { SanityAsset } from '@sanity/image-url/lib/types/types';

interface ImageAssetCardProps {
    image: SanityAsset;
    selectedImageAssets: Set<SanityAsset>;
    handleCheckboxChange: (image: SanityAsset) => void;
    index: number;
}

export const ImageAssetCard = (props: ImageAssetCardProps) => {
    const { image, selectedImageAssets, handleCheckboxChange, index } = props;
    return (
        <Card
            key={image._id || index}
            padding={1}
            radius={2}
            tone="default"
            value={image._id}
        >
            <Stack space={3}>
                <Flex justify="space-between" align="center">
                    <Checkbox
                        id={image._id}
                        checked={selectedImageAssets.has(image)}
                        onChange={() => handleCheckboxChange(image)}
                    />
                    <Text size={1} muted>
                        {selectedImageAssets.has(image.uploadId) ? 'Selected' : 'Not selected'}
                    </Text>
                </Flex>
                {image.url && (
                    <img
                        src={`${image.url}?w=200`}
                        alt={image.title}
                        className="h-[150px] w-full object-cover"
                    />
                )}
                <Stack space={2}>
                    <Text size={1}>{image.title}</Text>
                    {image.artistName && (
                        <Text size={1} muted>
                            by {image.artistName}
                        </Text>
                    )}
                </Stack>
            </Stack>
        </Card>
    )
}