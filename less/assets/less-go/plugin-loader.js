var AbstractPluginLoader = require('../less/environment/abstract-plugin-loader');

var PluginLoader = function(less) {
};

PluginLoader.prototype = AbstractPluginLoader;

PluginLoader.prototype.loadPlugin = function(filename, basePath, context, environment, fileManager) {
    return new Promise(function(fulfill, reject) {
        fileManager.loadFile(filename, basePath, context, environment)
            .then(fulfill).catch(reject);
    });
};

module.exports = PluginLoader;
