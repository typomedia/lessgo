"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _data = _interopRequireDefault(require("./data"));

var _tree = _interopRequireDefault(require("./tree"));

var _environment = _interopRequireDefault(require("./environment/environment"));

var _abstractFileManager = _interopRequireDefault(require("./environment/abstract-file-manager"));

var _abstractPluginLoader = _interopRequireDefault(require("./environment/abstract-plugin-loader"));

var _visitors = _interopRequireDefault(require("./visitors"));

var _parser = _interopRequireDefault(require("./parser/parser"));

var _functions = _interopRequireDefault(require("./functions"));

var _contexts = _interopRequireDefault(require("./contexts"));

var _sourceMapOutput = _interopRequireDefault(require("./source-map-output"));

var _sourceMapBuilder = _interopRequireDefault(require("./source-map-builder"));

var _parseTree = _interopRequireDefault(require("./parse-tree"));

var _importManager = _interopRequireDefault(require("./import-manager"));

var _render = _interopRequireDefault(require("./render"));

var _parse = _interopRequireDefault(require("./parse"));

var _lessError = _interopRequireDefault(require("./less-error"));

var _transformTree = _interopRequireDefault(require("./transform-tree"));

var utils = _interopRequireWildcard(require("./utils"));

var _pluginManager = _interopRequireDefault(require("./plugin-manager"));

var _logger = _interopRequireDefault(require("./logger"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _default = function _default(environment, fileManagers) {
  /**
   * @todo
   * This original code could be improved quite a bit.
   * Many classes / modules currently add side-effects / mutations to passed in objects,
   * which makes it hard to refactor and reason about. 
   */
  environment = new _environment["default"](environment, fileManagers);
  var SourceMapOutput = (0, _sourceMapOutput["default"])(environment);
  var SourceMapBuilder = (0, _sourceMapBuilder["default"])(SourceMapOutput, environment);
  var ParseTree = (0, _parseTree["default"])(SourceMapBuilder);
  var ImportManager = (0, _importManager["default"])(environment);
  var render = (0, _render["default"])(environment, ParseTree, ImportManager);
  var parse = (0, _parse["default"])(environment, ParseTree, ImportManager);
  var functions = (0, _functions["default"])(environment);
  /**
   * @todo
   * This root properties / methods need to be organized.
   * It's not clear what should / must be public and why.
   */

  var initial = {
    version: [3, 12, 2],
    data: _data["default"],
    tree: _tree["default"],
    Environment: _environment["default"],
    AbstractFileManager: _abstractFileManager["default"],
    AbstractPluginLoader: _abstractPluginLoader["default"],
    environment: environment,
    visitors: _visitors["default"],
    Parser: _parser["default"],
    functions: functions,
    contexts: _contexts["default"],
    SourceMapOutput: SourceMapOutput,
    SourceMapBuilder: SourceMapBuilder,
    ParseTree: ParseTree,
    ImportManager: ImportManager,
    render: render,
    parse: parse,
    LessError: _lessError["default"],
    transformTree: _transformTree["default"],
    utils: utils,
    PluginManager: _pluginManager["default"],
    logger: _logger["default"]
  }; // Create a public API

  var ctor = function ctor(t) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _construct(t, args);
    };
  };

  var t;
  var api = Object.create(initial);

  for (var n in initial.tree) {
    /* eslint guard-for-in: 0 */
    t = initial.tree[n];

    if (typeof t === 'function') {
      api[n.toLowerCase()] = ctor(t);
    } else {
      api[n] = Object.create(null);

      for (var o in t) {
        /* eslint guard-for-in: 0 */
        api[n][o.toLowerCase()] = ctor(t[o]);
      }
    }
  }
  /**
   * Some of the functions assume a `this` context of the API object,
   * which causes it to fail when wrapped for ES6 imports.
   * 
   * An assumed `this` should be removed in the future.
   */


  initial.parse = initial.parse.bind(api);
  initial.render = initial.render.bind(api);
  return api;
};

exports["default"] = _default;