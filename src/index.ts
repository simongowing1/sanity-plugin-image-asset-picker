import { definePlugin } from 'sanity';
import { ImageAssetPicker } from './ImageAssetPicker';

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import { defineConfig } from 'sanity'
 * import { imageAssetPickerPlugin } from 'sanity-plugin-image-asset-picker'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [imageAssetPickerPlugin()]
 * })
 * ```
 * 
 * Or use as a form component directly:
 * ```ts
 * import { defineField } from 'sanity'
 * import { ImageAssetPicker } from 'sanity-plugin-image-asset-picker'
 * 
 * defineField({
 *   name: 'images',
 *   type: 'array',
 *   title: 'Images',
 *   of: [{ type: 'image' }],
 *   components: {
 *     input: ImageAssetPicker
 *   }
 * })
 * ```
 */

// Plugin definition - registers the component as a custom input component for array fields
export const imageAssetPickerPlugin = definePlugin(() => {
  return {
    name: 'sanity-plugin-image-asset-picker',
    form: {
      components: {
        input: {
          'array:image[]': ImageAssetPicker,
        },
      },
    },
  };
});
