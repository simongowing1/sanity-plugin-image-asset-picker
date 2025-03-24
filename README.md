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

The plugin will register the `ImageAssetPicker` component to be used with array fields.

### As a Component

You can also use the `ImageAssetPicker` component directly in schema definitions:

```js
// In your schema definition
import {defineField} from 'sanity';
import {ImageAssetPicker} from 'sanity-plugin-image-asset-picker';

export default defineField({
  name: 'images',
  type: 'array',
  title: 'Images',
  of: [{type: 'image'}],
  components: {
    input: ImageAssetPicker,
  },
});
```

## Features

- Browse all image assets in your Sanity dataset
- Search for specific images by filename
- Select multiple images to add to an array field
- Pagination for browsing large image collections

## Requirements

- Sanity v3.x
- React 18+

## License

[MIT](LICENSE) © Simon Gowing

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
