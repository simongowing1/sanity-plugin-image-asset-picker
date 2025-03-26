import { SanityAsset } from '@sanity/image-url/lib/types/types';
import { Button, Card, Checkbox, Dialog, Flex, Grid, Inline, Stack, Text, TextInput } from '@sanity/ui';
import { FloppyDisk, FolderSimplePlus } from 'phosphor-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrayOfObjectsInputProps, insert, setIfMissing, useClient } from 'sanity';

type Props = ArrayOfObjectsInputProps

export function ImageAssetPicker({ ...props }: Props) {
    const { onChange } = props;

    const client = useClient({ apiVersion: '2022-11-15' });

    const [imageAssets, setImageAssets] = useState<SanityAsset[]>([]);
    const [imageAssetsLoading, setImageAssetsLoading] = useState(true);

    const [isImageAssetDialogueOpen, setIsImageAssetDialogueOpen] = useState(false);
    const [selectedImageAssets, setSelectedImageAssets] = useState<Set<SanityAsset>>(new Set());
    const selectedImageAssetsArray = useMemo(() => [...selectedImageAssets], [selectedImageAssets]);

    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(80);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [searchString, setSearchString] = useState<string | null>(null);

    const imageAssetQueryProjection = `{
    assetId,
    originalFilename,
    url,  
    _id
    }`;


    const imageAssetQueryWithoutSearchString = `*[_type == "sanity.imageAsset"]`;

    const imageAssetQueryWithSearchString = `*[_type == "sanity.imageAsset" && defined('originalFilename') && originalFilename match $searchString]`;

    const imageAssetQueryBuilder = (queryString: string, start: number, end: number) =>
        `${queryString} | order(_createdAt desc) [${start}...${end}]${imageAssetQueryProjection}`;

    const toggleImageAsset = async (image: SanityAsset) => {
        setSelectedImageAssets((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(image)) {
                newSet.delete(image)
            } else {
                newSet.add(image)
            }
            return newSet;
        })
    };

    const handleSaveImagesClick = () => {
        const savedImageAssets: SanityAsset[] = selectedImageAssetsArray.map((image) => ({
            _key: image._id,
            type: `image`,
            asset: { _ref: image._id, _type: 'reference' },
        }))

        const imagePatches = savedImageAssets.map((image) => insert([image], 'after', [-1]))

        onChange([setIfMissing([]), ...imagePatches]);
        setSelectedImageAssets(new Set());
        setIsImageAssetDialogueOpen(false);
    };

    function handleSearchInputSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setImageAssetsLoading(true)
        const totalQuery = `count(${imageAssetQueryWithSearchString})`
        client.fetch(totalQuery, { searchString: searchString }).then((totalCount: number) => {
            setTotalPages(Math.ceil(totalCount / pageSize))
        })
        const query = imageAssetQueryBuilder(imageAssetQueryWithSearchString, 1, pageSize)
        client.fetch(query, { searchString: searchString }).then((images: SanityAsset[]) => {
            setImageAssets(images)
            setImageAssetsLoading(false)
        })
    };

    const handleSearchInputChange = (event: FormEvent<HTMLInputElement>) => {
        const nextValue = event.currentTarget.value
        setSearchString(nextValue)
    };

    const handleCheckboxChange = (image: SanityAsset) => {
        toggleImageAsset(image)
    };

    const handleCloseImageAssetDialogue = () => {
        setIsImageAssetDialogueOpen(false)
        setSelectedImageAssets(new Set())
    }

    useEffect(() => {
        const totalQuery = `count(${imageAssetQueryWithoutSearchString})`
        client.fetch(totalQuery).then((totalCount: number) => {
            setTotalPages(Math.ceil(totalCount / pageSize))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isImageAssetDialogueOpen) return;
        setImageAssetsLoading(true)
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const query = searchString
            ? imageAssetQueryBuilder(imageAssetQueryWithSearchString, start, end)
            : imageAssetQueryBuilder(imageAssetQueryWithoutSearchString, start, end)
        client.fetch(query, { searchString: searchString }).then((images: SanityAsset[]) => {
            setImageAssets(images)
            setImageAssetsLoading(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, isImageAssetDialogueOpen]);

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
