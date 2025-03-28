import { defineConfig } from '@sanity/pkg-utils';

export default defineConfig({
  dist: 'dist',
  tsconfig: 'tsconfig.dist.json',

  // Remove this block to enable strict export validation
  extract: {
    rules: {
      /**
       * "@deprecated as it's no longer needed since TypeScript 5.5 https://github.com/microsoft/TypeScript/issues/42873"
       * 'ae-forgotten-export': 'off',
       **/
      'ae-incompatible-release-tags': 'off',
      'ae-internal-missing-underscore': 'off',
      'ae-missing-release-tag': 'off',
    },
  },
});
