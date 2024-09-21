"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var _default = exports["default"] = function _default(environment, fileManagers) {
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
  };

  // Create a public API
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