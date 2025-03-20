import { Card, Stack, Text, Checkbox, Flex, Grid, Button, Inline, TextInput } from '@sanity/ui';
import { ArrayOfObjectsInputProps, insert, setIfMissing } from 'sanity';
import { useEffect, useState, useMemo } from 'react';
import { client } from '@lib/sanity.client';
import { FloppyDisk } from 'phosphor-react';
import { SanityAsset } from '@sanity/image-url/lib/types/types';

type Props = ArrayOfObjectsInputProps;

export function ImageAssetPicker({ ...props }: Props) {
    const { onChange } = props;

    const [imageAssets, setImageAssets] = useState<SanityAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageAssets, setSelectedImageAssets] = useState<Set<SanityAsset>>(new Set());
    const selectedImageAssetsArray = useMemo(() => [...selectedImageAssets], [selectedImageAssets]);

    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(80);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [searchString, setSearchString] = useState<string | null>(null);

    const queryProjection = `{
    assetId,
    originalFilename,
    url,  
    _id}`;

    const imageAssetQueryWithoutSearchString = `*[_type == "sanity.imageAsset"]`;

    const imageAssetQueryWithSearchString = `*[_type == "sanity.imageAsset" && defined('originalFilename') && originalFilename match $searchString]`;

    const imageAssetQueryBuilder = (queryString: string, start: number, end: number) =>
        `${queryString} | order(_createdAt desc) [${start}...${end}]${queryProjection}`;

    const toggleImageAsset = async (image: SanityAsset) => {
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
        const imageAssets: SanityAsset[] = selectedImageAssetsArray.map((image) => ({
            _key: image._id,
            _type: `figure`,
            asset: { _ref: image._id, _type: 'reference' },
        }));

        const imagePatches = imageAssets.map((image) => insert([image], 'after', [-1]));

        onChange([setIfMissing([]), ...imagePatches]);
        setSelectedImageAssets(new Set());
    };

    const handleSearchInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const totalQuery = `count(${imageAssetQueryWithSearchString})`;
        client.fetch(totalQuery, { searchString: searchString }).then((totalCount: number) => {
            setTotalPages(Math.ceil(totalCount / pageSize));
        });
        const query = imageAssetQueryBuilder(imageAssetQueryWithSearchString, 1, pageSize);
        client.fetch(query, { searchString: searchString }).then((images: SanityAsset[]) => {
            setImageAssets(images);
            setLoading(false);
        });
    };

    const handleSearchInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const nextValue = event.currentTarget.value;
        setSearchString(nextValue);
    };

    useEffect(() => {
        const totalQuery = `count(${imageAssetQueryWithoutSearchString})`;
        client.fetch(totalQuery).then((totalCount: number) => {
            setTotalPages(Math.ceil(totalCount / pageSize));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLoading(true);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const query = searchString
            ? imageAssetQueryBuilder(imageAssetQueryWithSearchString, start, end)
            : imageAssetQueryBuilder(imageAssetQueryWithoutSearchString, start, end);
        client.fetch(query, { searchString: searchString }).then((images: SanityAsset[]) => {
            setImageAssets(images);
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    return (
        <Stack space={6}>
            {props.renderDefault(props)}
            <Stack space={4}>
                <Text size={1} style={{ fontWeight: '500' }}>
                    Images
                </Text>
                <Stack space={6}>
                    <form onSubmit={handleSearchInputSubmit}>
                        <Flex direction={'column'} gap={2}>
                            <TextInput
                                width={'fill'}
                                type="text"
                                value={searchString || ''}
                                onChange={handleSearchInputChange}
                                placeholder="Search for images"
                            />
                            <Button type="submit" mode="ghost" padding={3} width={'fill'}>
                                <Flex justify="center" align="center">
                                    <Text size={1}>Search</Text>
                                </Flex>
                            </Button>
                        </Flex>
                    </form>

                    <Stack space={4}>
                        <Button onClick={handleSaveImagesClick} mode="ghost" padding={3} width={'fill'}>
                            <Flex justify="center" align="center">
                                <Inline space={2}>
                                    <FloppyDisk size={16} />
                                    <Text size={1}>Save selected images</Text>
                                </Inline>
                            </Flex>
                        </Button>
                        {loading ? (
                            <Text size={1}>Loading images...</Text>
                        ) : !imageAssets.length ? (
                            <Text size={1}>No images found</Text>
                        ) : (
                            <Stack space={2}>
                                <Grid columns={4} rows={Math.ceil(imageAssets.length / 4)} gap={1}>
                                    {imageAssets.map((image, index) => (
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
                                                        onChange={() => toggleImageAsset(image)}
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
        </Stack>
    );
}
