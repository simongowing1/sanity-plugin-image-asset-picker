const imageAssetQueryProjection = `{
    assetId,
    originalFilename,
    url,  
    _id
    }`;


export const imageAssetQueryWithoutSearchString = `*[_type == "sanity.imageAsset"]`;

export const imageAssetQueryWithSearchString = `*[_type == "sanity.imageAsset" && defined('originalFilename') && originalFilename match $searchString]`;

export const imageAssetQueryBuilder = (queryString: string, start: number, end: number) =>
    `${queryString} | order(_createdAt desc) [${start}...${end}]${imageAssetQueryProjection}`;