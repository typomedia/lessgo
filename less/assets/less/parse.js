"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _contexts = _interopRequireDefault(require("./contexts"));

var _parser = _interopRequireDefault(require("./parser/parser"));

var _pluginManager = _interopRequireDefault(require("./plugin-manager"));

var _lessError = _interopRequireDefault(require("./less-error"));

var utils = _interopRequireWildcard(require("./utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PromiseConstructor;

var _default = function _default(environment, ParseTree, ImportManager) {
  var parse = function parse(input, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = utils.copyOptions(this.options, {});
    } else {
      options = utils.copyOptions(this.options, options || {});
    }

    if (!callback) {
      var self = this;
      return new Promise(function (resolve, reject) {
        parse.call(self, input, options, function (err, output) {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        });
      });
    } else {
      var context;
      var rootFileInfo;
      var pluginManager = new _pluginManager["default"](this, !options.reUsePluginManager);
      options.pluginManager = pluginManager;
      context = new _contexts["default"].Parse(options);

      if (options.rootFileInfo) {
        rootFileInfo = options.rootFileInfo;
      } else {
        var filename = options.filename || 'input';
        var entryPath = filename.replace(/[^\/\\]*$/, '');
        rootFileInfo = {
          filename: filename,
          rewriteUrls: context.rewriteUrls,
          rootpath: context.rootpath || '',
          currentDirectory: entryPath,
          entryPath: entryPath,
          rootFilename: filename
        }; // add in a missing trailing slash

        if (rootFileInfo.rootpath && rootFileInfo.rootpath.slice(-1) !== '/') {
          rootFileInfo.rootpath += '/';
        }
      }

      var imports = new ImportManager(this, context, rootFileInfo);
      this.importManager = imports; // TODO: allow the plugins to be just a list of paths or names
      // Do an async plugin queue like lessc

      if (options.plugins) {
        options.plugins.forEach(function (plugin) {
          var evalResult;
          var contents;

          if (plugin.fileContent) {
            contents = plugin.fileContent.replace(/^\uFEFF/, '');
            evalResult = pluginManager.Loader.evalPlugin(contents, context, imports, plugin.options, plugin.filename);

            if (evalResult instanceof _lessError["default"]) {
              return callback(evalResult);
            }
          } else {
            pluginManager.addPlugin(plugin);
          }
        });
      }

      new _parser["default"](context, imports, rootFileInfo).parse(input, function (e, root) {
        if (e) {
          return callback(e);
        }

        callback(null, root, imports, options);
      }, options);
    }
  };

  return parse;
};

exports["default"] = _default;