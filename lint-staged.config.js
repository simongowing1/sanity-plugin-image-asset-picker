module.exports = {
  '**/*.{js,jsx}': ['eslint'],
  '**/*.{ts,tsx}': ['eslint', () => 'tsc --noEmit --project tsconfig.test.json'],
}
