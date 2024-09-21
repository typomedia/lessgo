"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var environment = /*#__PURE__*/function () {
  function environment(externalEnvironment, fileManagers) {
    _classCallCheck(this, environment);

    this.fileManagers = fileManagers || [];
    externalEnvironment = externalEnvironment || {};
    var optionalFunctions = ['encodeBase64', 'mimeLookup', 'charsetLookup', 'getSourceMapGenerator'];
    var requiredFunctions = [];
    var functions = requiredFunctions.concat(optionalFunctions);

    for (var i = 0; i < functions.length; i++) {
      var propName = functions[i];
      var environmentFunc = externalEnvironment[propName];

      if (environmentFunc) {
        this[propName] = environmentFunc.bind(externalEnvironment);
      } else if (i < requiredFunctions.length) {
        this.warn("missing required function in environment - ".concat(propName));
      }
    }
  }

  _createClass(environment, [{
    key: "getFileManager",
    value: function getFileManager(filename, currentDirectory, options, environment, isSync) {
      if (!filename) {
        _logger["default"].warn('getFileManager called with no filename.. Please report this issue. continuing.');
      }

      if (currentDirectory == null) {
        _logger["default"].warn('getFileManager called with null directory.. Please report this issue. continuing.');
      }

      var fileManagers = this.fileManagers;

      if (options.pluginManager) {
        fileManagers = [].concat(fileManagers).concat(options.pluginManager.getFileManagers());
      }

      for (var i = fileManagers.length - 1; i >= 0; i--) {
        var fileManager = fileManagers[i];

        if (fileManager[isSync ? 'supportsSync' : 'supports'](filename, currentDirectory, options, environment)) {
          return fileManager;
        }
      }

      return null;
    }
  }, {
    key: "addFileManager",
    value: function addFileManager(fileManager) {
      this.fileManagers.push(fileManager);
    }
  }, {
    key: "clearFileManagers",
    value: function clearFileManagers() {
      this.fileManagers = [];
    }
  }]);

  return environment;
}();

var _default = environment;
exports["default"] = _default;