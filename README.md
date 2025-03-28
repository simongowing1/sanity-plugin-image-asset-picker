> This is a **Sanity Studio v3** plugin.

# Sanity Image Asset Picker

A Sanity Studio plugin that enables users to browse and bulk-select image assets to add to an image array field.

## Installation

```bash
npm install sanity-plugin-image-asset-picker
```

## Usage

### As a Sanity Plugin

Add the plugin to your Sanity configuration:

```js
// sanity.config.js or sanity.config.ts
import {defineConfig} from 'sanity';
import {imageAssetPickerPlugin} from 'sanity-plugin-image-asset-picker';

export default defineConfig({
  // ...
  plugins: [imageAssetPickerPlugin()],
});
```

The plugin will register the `ImageAssetPicker` component to be used with `array` fields of type `image`. You do not need to use the component directly in schema definitions.

## Features

- Browse all image assets in your Sanity dataset
- Search for specific images by filename
- Select multiple images to add to an array field
- Pagination for browsing large image collections

## Requirements

- Sanity v3.x
- React 18+

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

## Release new version

Run ["CI & Release" workflow](https://github.com/simongowing1/sanity-plugin-image-asset-picker/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.

## License

[MIT](LICENSE) © Simon Gowing
