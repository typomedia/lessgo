"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _logger = _interopRequireDefault(require("../logger"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @todo Document why this abstraction exists, and the relationship between
 *       environment, file managers, and plugin manager
 */
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
  return _createClass(environment, [{
    key: "getFileManager",
    value: function getFileManager(filename, currentDirectory, options, _environment, isSync) {
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
        if (fileManager[isSync ? 'supportsSync' : 'supports'](filename, currentDirectory, options, _environment)) {
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
}();
var _default = exports["default"] = environment;