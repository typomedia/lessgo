"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _contexts = _interopRequireDefault(require("./contexts"));
var _parser = _interopRequireDefault(require("./parser/parser"));
var _pluginManager = _interopRequireDefault(require("./plugin-manager"));
var _lessError = _interopRequireDefault(require("./less-error"));
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var PromiseConstructor;
var _default = exports["default"] = function _default(environment, ParseTree, ImportManager) {
  var _parse = function parse(input, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = utils.copyOptions(this.options, {});
    } else {
      options = utils.copyOptions(this.options, options || {});
    }
    if (!callback) {
      var self = this;
      return new Promise(function (resolve, reject) {
        _parse.call(self, input, options, function (err, output) {
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
        };
        // add in a missing trailing slash
        if (rootFileInfo.rootpath && rootFileInfo.rootpath.slice(-1) !== '/') {
          rootFileInfo.rootpath += '/';
        }
      }
      var imports = new ImportManager(this, context, rootFileInfo);
      this.importManager = imports;

      // TODO: allow the plugins to be just a list of paths or names
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
  return _parse;
};