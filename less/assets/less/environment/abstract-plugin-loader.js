"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _functionRegistry = _interopRequireDefault(require("../functions/function-registry"));
var _lessError = _interopRequireDefault(require("../less-error"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AbstractPluginLoader = /*#__PURE__*/function () {
  function AbstractPluginLoader() {
    _classCallCheck(this, AbstractPluginLoader);
    // Implemented by Node.js plugin loader
    this.require = function () {
      return null;
    };
  }
  return _createClass(AbstractPluginLoader, [{
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
        pluginObj.filename = filename;

        // For < 3.x (or unspecified minVersion) - setOptions() before install()
        if (!pluginObj.minVersion || this.compareVersion('3.0.0', pluginObj.minVersion) < 0) {
          result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);
          if (result) {
            return result;
          }
        }

        // Run on first load
        pluginManager.addPlugin(pluginObj, fileInfo.filename, registry);
        pluginObj.functions = registry.getLocalFunctions();

        // Need to call setOptions again because the pluginObj might have functions
        result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);
        if (result) {
          return result;
        }

        // Run every @plugin call
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
}();
var _default = exports["default"] = AbstractPluginLoader;