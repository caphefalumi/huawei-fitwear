const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Bun symlinks some packages into a second physical React. Web hooks then
// crash with "Cannot read properties of null (reading 'useContext')".
// `expo` too: a second copy of expo/src/async-require/hmr.ts registers a second
// HMR client whose entry point is the bare page URL, which kills Metro's
// HMR server ("has an empty path and cannot be converted to a JSC-safe format").
const singleton = new Set(['react', 'react-dom', 'expo']);
const upstream = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = upstream ?? context.resolveRequest;
  if (
    singleton.has(moduleName) ||
    moduleName.startsWith('react/') ||
    moduleName.startsWith('react-dom/') ||
    moduleName.startsWith('expo/')
  ) {
    return resolve(
      { ...context, originModulePath: path.join(projectRoot, 'package.json') },
      moduleName,
      platform,
    );
  }
  return resolve(context, moduleName, platform);
};

module.exports = config;
