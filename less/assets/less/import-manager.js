"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _contexts = _interopRequireDefault(require("./contexts"));
var _parser = _interopRequireDefault(require("./parser/parser"));
var _lessError = _interopRequireDefault(require("./less-error"));
var utils = _interopRequireWildcard(require("./utils"));
var _logger = _interopRequireDefault(require("./logger"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _default = exports["default"] = function _default(environment) {
  // FileInfo = {
  //  'rewriteUrls' - option - whether to adjust URL's to be relative
  //  'filename' - full resolved filename of current file
  //  'rootpath' - path to append to normal URLs for this node
  //  'currentDirectory' - path to the current file, absolute
  //  'rootFilename' - filename of the base file
  //  'entryPath' - absolute path to the entry file
  //  'reference' - whether the file should not be output and only output parts that are referenced
  var ImportManager = /*#__PURE__*/function () {
    function ImportManager(less, context, rootFileInfo) {
      _classCallCheck(this, ImportManager);
      this.less = less;
      this.rootFilename = rootFileInfo.filename;
      this.paths = context.paths || []; // Search paths, when importing
      this.contents = {}; // map - filename to contents of all the files
      this.contentsIgnoredChars = {}; // map - filename to lines at the beginning of each file to ignore
      this.mime = context.mime;
      this.error = null;
      this.context = context;
      // Deprecated? Unused outside of here, could be useful.
      this.queue = []; // Files which haven't been imported yet
      this.files = []; // List of files imported
    }

    /**
     * Add an import to be imported
     * @param path - the raw path
     * @param tryAppendExtension - whether to try appending a file extension (.less or .js if the path has no extension)
     * @param currentFileInfo - the current file info (used for instance to work out relative paths)
     * @param importOptions - import options
     * @param callback - callback for when it is imported
     */
    return _createClass(ImportManager, [{
      key: "push",
      value: function push(path, tryAppendExtension, currentFileInfo, importOptions, callback) {
        var importManager = this;
        var pluginLoader = this.context.pluginManager.Loader;
        this.queue.push(path);
        var fileParsedFunc = function fileParsedFunc(e, root, fullPath) {
          importManager.queue.splice(importManager.queue.indexOf(path), 1); // Remove the path from the queue

          var importedEqualsRoot = fullPath === importManager.rootFilename;
          if (importOptions.optional && e) {
            callback(null, {
              rules: []
            }, false, null);
            _logger["default"].info("The file ".concat(fullPath, " was skipped because it was not found and the import was marked optional."));
          } else {
            var files = importManager.files;
            if (files.indexOf(fullPath) === -1) {
              files.push(fullPath);
            }
            if (e && !importManager.error) {
              importManager.error = e;
            }
            callback(e, root, importedEqualsRoot, fullPath);
          }
        };
        var newFileInfo = {
          rewriteUrls: this.context.rewriteUrls,
          entryPath: currentFileInfo.entryPath,
          rootpath: currentFileInfo.rootpath,
          rootFilename: currentFileInfo.rootFilename
        };
        var fileManager = environment.getFileManager(path, currentFileInfo.currentDirectory, this.context, environment);
        if (!fileManager) {
          fileParsedFunc({
            message: "Could not find a file-manager for ".concat(path)
          });
          return;
        }
        var loadFileCallback = function loadFileCallback(loadedFile) {
          var plugin;
          var resolvedFilename = loadedFile.filename;
          var contents = loadedFile.contents.replace(/^\uFEFF/, '');

          // Pass on an updated rootpath if path of imported file is relative and file
          // is in a (sub|sup) directory
          //
          // Examples:
          // - If path of imported file is 'module/nav/nav.less' and rootpath is 'less/',
          //   then rootpath should become 'less/module/nav/'
          // - If path of imported file is '../mixins.less' and rootpath is 'less/',
          //   then rootpath should become 'less/../'
          newFileInfo.currentDirectory = fileManager.getPath(resolvedFilename);
          if (newFileInfo.rewriteUrls) {
            newFileInfo.rootpath = fileManager.join(importManager.context.rootpath || '', fileManager.pathDiff(newFileInfo.currentDirectory, newFileInfo.entryPath));
            if (!fileManager.isPathAbsolute(newFileInfo.rootpath) && fileManager.alwaysMakePathsAbsolute()) {
              newFileInfo.rootpath = fileManager.join(newFileInfo.entryPath, newFileInfo.rootpath);
            }
          }
          newFileInfo.filename = resolvedFilename;
          var newEnv = new _contexts["default"].Parse(importManager.context);
          newEnv.processImports = false;
          importManager.contents[resolvedFilename] = contents;
          if (currentFileInfo.reference || importOptions.reference) {
            newFileInfo.reference = true;
          }
          if (importOptions.isPlugin) {
            plugin = pluginLoader.evalPlugin(contents, newEnv, importManager, importOptions.pluginArgs, newFileInfo);
            if (plugin instanceof _lessError["default"]) {
              fileParsedFunc(plugin, null, resolvedFilename);
            } else {
              fileParsedFunc(null, plugin, resolvedFilename);
            }
          } else if (importOptions.inline) {
            fileParsedFunc(null, contents, resolvedFilename);
          } else {
            new _parser["default"](newEnv, importManager, newFileInfo).parse(contents, function (e, root) {
              fileParsedFunc(e, root, resolvedFilename);
            });
          }
        };
        var loadedFile;
        var promise;
        var context = utils.clone(this.context);
        if (tryAppendExtension) {
          context.ext = importOptions.isPlugin ? '.js' : '.less';
        }
        if (importOptions.isPlugin) {
          context.mime = 'application/javascript';
          if (context.syncImport) {
            loadedFile = pluginLoader.loadPluginSync(path, currentFileInfo.currentDirectory, context, environment, fileManager);
          } else {
            promise = pluginLoader.loadPlugin(path, currentFileInfo.currentDirectory, context, environment, fileManager);
          }
        } else {
          if (context.syncImport) {
            loadedFile = fileManager.loadFileSync(path, currentFileInfo.currentDirectory, context, environment);
          } else {
            promise = fileManager.loadFile(path, currentFileInfo.currentDirectory, context, environment, function (err, loadedFile) {
              if (err) {
                fileParsedFunc(err);
              } else {
                loadFileCallback(loadedFile);
              }
            });
          }
        }
        if (loadedFile) {
          if (!loadedFile.filename) {
            fileParsedFunc(loadedFile);
          } else {
            loadFileCallback(loadedFile);
          }
        } else if (promise) {
          promise.then(loadFileCallback, fileParsedFunc);
        }
      }
    }]);
  }();
  return ImportManager;
};