import { definePlugin } from 'sanity';
import { ImageAssetPicker } from './ImageAssetPicker';
import type { ArrayOfObjectsInputProps, ArraySchemaType, InputProps } from 'sanity';

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
 */

// Plugin definition - registers the component as a custom input component for array fields
export const imageAssetPickerPlugin = definePlugin(() => {
  return {
    name: 'sanity-plugin-image-asset-picker',
    form: {
      components: {
        input: (props: InputProps) => {
          if (!props.schemaType || props.schemaType.name !== 'array') {
            return props.renderDefault(props);
          }

          const arrayType = props.schemaType as ArraySchemaType;
          const containsImageType = arrayType.of?.some(
            member => typeof member.type?.name === 'string' && member.type?.name === 'image'
          );

          return containsImageType ? ImageAssetPicker({ ...props as ArrayOfObjectsInputProps }) : props.renderDefault(props);
        }
      },
    },
  };
});
