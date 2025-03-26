import { FormEvent, useEffect, useMemo, useState } from "react";
import { SanityAsset } from '@sanity/image-url/lib/types/types';
import { FormPatch, insert, PatchEvent, setIfMissing, useClient } from "sanity";
import { imageAssetQueryBuilder, imageAssetQueryWithSearchString, imageAssetQueryWithoutSearchString } from "../helpers/queryHelpers";
interface UseImageAssetPickerProps {
    onChange: (patches: FormPatch | FormPatch[] | PatchEvent) => void;
}

export const useImageAssetPicker = (props: UseImageAssetPickerProps) => {
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

    return {
        imageAssets,
        imageAssetsLoading,
        isImageAssetDialogueOpen,
        selectedImageAssets,
        totalPages,
        page,
        searchString,
        toggleImageAsset,
        handleSaveImagesClick,
        handleSearchInputSubmit,
        handleSearchInputChange,
        handleCheckboxChange,
        handleCloseImageAssetDialogue,
        setPage,
        setSearchString,
        setIsImageAssetDialogueOpen,
        setSelectedImageAssets,
        setImageAssets,
        setImageAssetsLoading,
        setTotalPages,
    }
}