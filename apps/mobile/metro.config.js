const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Bun symlinks some packages into a second physical React. Web hooks then
// crash with "Cannot read properties of null (reading 'useContext')".
const singleton = new Set(['react', 'react-dom']);
const upstream = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = upstream ?? context.resolveRequest;
  if (
    singleton.has(moduleName) ||
    moduleName.startsWith('react/') ||
    moduleName.startsWith('react-dom/')
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
