// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Disable package exports resolution for Metro (fixes some require errors)
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
