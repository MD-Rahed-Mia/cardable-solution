// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add these lines to handle Firebase and other potential bundling issues
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false; // Crucial for Firebase SDK v9.7.0+

module.exports = config;