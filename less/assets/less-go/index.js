var environment = require("./environment"),
    FileManager = require("./file-manager"),
    createFromEnvironment = require("../less").default;

var PluginLoader = require('./plugin-loader');

var less = createFromEnvironment(environment, [new FileManager()]);

less.PluginLoader = PluginLoader;

module.exports = less;
