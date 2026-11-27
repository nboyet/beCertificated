const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: expoPreset.transformIgnorePatterns.map((pattern) =>
    pattern.replace('|react-native|', '|@rn-primitives|uniwind|react-native|'),
  ),
  testMatch: ['**/*.ui.tsx'],
};
