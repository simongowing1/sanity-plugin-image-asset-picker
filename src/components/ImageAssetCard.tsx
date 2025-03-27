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
            padding={3}
            radius={2}
            tone={selectedImageAssets.has(image) ? 'primary' : 'default'}
            value={image._id}
            width={'fill'}
        >
            <Stack space={3} width={'fill'}>
                <Flex justify="space-between" align="center">
                    <Checkbox
                        id={image._id}
                        checked={selectedImageAssets.has(image)}
                        onChange={() => handleCheckboxChange(image)}
                    />
                    <Text size={1} muted>
                        {selectedImageAssets.has(image) ? 'Selected' : 'Not selected'}
                    </Text>
                </Flex>
                {image.url && (
                    <div style={{
                        width: '100%',
                        height: '150px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={`${image.url}?w=200`}
                            alt={image.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                        />
                    </div>
                )}
                <Stack space={2}>
                    <Text
                        size={1}
                        muted
                        textOverflow="ellipsis"
                        title={image.title || image.originalFilename}
                    >
                        {image.title || image.originalFilename}
                    </Text>
                </Stack>
            </Stack>
        </Card>
    )
}