"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _contexts = _interopRequireDefault(require("./contexts"));

var _parser = _interopRequireDefault(require("./parser/parser"));

var _lessError = _interopRequireDefault(require("./less-error"));

var utils = _interopRequireWildcard(require("./utils"));

var _logger = _interopRequireDefault(require("./logger"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default = function _default(environment) {
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
      this.context = context; // Deprecated? Unused outside of here, could be useful.

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


    _createClass(ImportManager, [{
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
          var contents = loadedFile.contents.replace(/^\uFEFF/, ''); // Pass on an updated rootpath if path of imported file is relative and file
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

    return ImportManager;
  }();

  return ImportManager;
};

exports["default"] = _default;