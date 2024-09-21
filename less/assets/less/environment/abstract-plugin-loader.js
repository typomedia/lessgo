"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _functionRegistry = _interopRequireDefault(require("../functions/function-registry"));

var _lessError = _interopRequireDefault(require("../less-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AbstractPluginLoader = /*#__PURE__*/function () {
  function AbstractPluginLoader() {
    _classCallCheck(this, AbstractPluginLoader);

    // Implemented by Node.js plugin loader
    this.require = function () {
      return null;
    };
  }

  _createClass(AbstractPluginLoader, [{
    key: "evalPlugin",
    value: function evalPlugin(contents, context, imports, pluginOptions, fileInfo) {
      var loader;
      var registry;
      var pluginObj;
      var localModule;
      var pluginManager;
      var filename;
      var result;
      pluginManager = context.pluginManager;

      if (fileInfo) {
        if (typeof fileInfo === 'string') {
          filename = fileInfo;
        } else {
          filename = fileInfo.filename;
        }
      }

      var shortname = new this.less.FileManager().extractUrlParts(filename).filename;

      if (filename) {
        pluginObj = pluginManager.get(filename);

        if (pluginObj) {
          result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);

          if (result) {
            return result;
          }

          try {
            if (pluginObj.use) {
              pluginObj.use.call(this.context, pluginObj);
            }
          } catch (e) {
            e.message = e.message || 'Error during @plugin call';
            return new _lessError["default"](e, imports, filename);
          }

          return pluginObj;
        }
      }

      localModule = {
        exports: {},
        pluginManager: pluginManager,
        fileInfo: fileInfo
      };
      registry = _functionRegistry["default"].create();

      var registerPlugin = function registerPlugin(obj) {
        pluginObj = obj;
      };

      try {
        loader = new Function('module', 'require', 'registerPlugin', 'functions', 'tree', 'less', 'fileInfo', contents);
        loader(localModule, this.require(filename), registerPlugin, registry, this.less.tree, this.less, fileInfo);
      } catch (e) {
        return new _lessError["default"](e, imports, filename);
      }

      if (!pluginObj) {
        pluginObj = localModule.exports;
      }

      pluginObj = this.validatePlugin(pluginObj, filename, shortname);

      if (pluginObj instanceof _lessError["default"]) {
        return pluginObj;
      }

      if (pluginObj) {
        pluginObj.imports = imports;
        pluginObj.filename = filename; // For < 3.x (or unspecified minVersion) - setOptions() before install()

        if (!pluginObj.minVersion || this.compareVersion('3.0.0', pluginObj.minVersion) < 0) {
          result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);

          if (result) {
            return result;
          }
        } // Run on first load


        pluginManager.addPlugin(pluginObj, fileInfo.filename, registry);
        pluginObj.functions = registry.getLocalFunctions(); // Need to call setOptions again because the pluginObj might have functions

        result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);

        if (result) {
          return result;
        } // Run every @plugin call


        try {
          if (pluginObj.use) {
            pluginObj.use.call(this.context, pluginObj);
          }
        } catch (e) {
          e.message = e.message || 'Error during @plugin call';
          return new _lessError["default"](e, imports, filename);
        }
      } else {
        return new _lessError["default"]({
          message: 'Not a valid plugin'
        }, imports, filename);
      }

      return pluginObj;
    }
  }, {
    key: "trySetOptions",
    value: function trySetOptions(plugin, filename, name, options) {
      if (options && !plugin.setOptions) {
        return new _lessError["default"]({
          message: "Options have been provided but the plugin ".concat(name, " does not support any options.")
        });
      }

      try {
        plugin.setOptions && plugin.setOptions(options);
      } catch (e) {
        return new _lessError["default"](e);
      }
    }
  }, {
    key: "validatePlugin",
    value: function validatePlugin(plugin, filename, name) {
      if (plugin) {
        // support plugins being a function
        // so that the plugin can be more usable programmatically
        if (typeof plugin === 'function') {
          plugin = new plugin();
        }

        if (plugin.minVersion) {
          if (this.compareVersion(plugin.minVersion, this.less.version) < 0) {
            return new _lessError["default"]({
              message: "Plugin ".concat(name, " requires version ").concat(this.versionToString(plugin.minVersion))
            });
          }
        }

        return plugin;
      }

      return null;
    }
  }, {
    key: "compareVersion",
    value: function compareVersion(aVersion, bVersion) {
      if (typeof aVersion === 'string') {
        aVersion = aVersion.match(/^(\d+)\.?(\d+)?\.?(\d+)?/);
        aVersion.shift();
      }

      for (var i = 0; i < aVersion.length; i++) {
        if (aVersion[i] !== bVersion[i]) {
          return parseInt(aVersion[i]) > parseInt(bVersion[i]) ? -1 : 1;
        }
      }

      return 0;
    }
  }, {
    key: "versionToString",
    value: function versionToString(version) {
      var versionString = '';

      for (var i = 0; i < version.length; i++) {
        versionString += (versionString ? '.' : '') + version[i];
      }

      return versionString;
    }
  }, {
    key: "printUsage",
    value: function printUsage(plugins) {
      for (var i = 0; i < plugins.length; i++) {
        var plugin = plugins[i];

        if (plugin.printUsage) {
          plugin.printUsage();
        }
      }
    }
  }]);

  return AbstractPluginLoader;
}();

var _default = AbstractPluginLoader;
exports["default"] = _default;