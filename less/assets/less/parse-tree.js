"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lessError = _interopRequireDefault(require("./less-error"));
var _transformTree = _interopRequireDefault(require("./transform-tree"));
var _logger = _interopRequireDefault(require("./logger"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _default = exports["default"] = function _default(SourceMapBuilder) {
  var ParseTree = /*#__PURE__*/function () {
    function ParseTree(root, imports) {
      _classCallCheck(this, ParseTree);
      this.root = root;
      this.imports = imports;
    }
    return _createClass(ParseTree, [{
      key: "toCSS",
      value: function toCSS(options) {
        var evaldRoot;
        var result = {};
        var sourceMapBuilder;
        try {
          evaldRoot = (0, _transformTree["default"])(this.root, options);
        } catch (e) {
          throw new _lessError["default"](e, this.imports);
        }
        try {
          var compress = Boolean(options.compress);
          if (compress) {
            _logger["default"].warn('The compress option has been deprecated. ' + 'We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.');
          }
          var toCSSOptions = {
            compress: compress,
            dumpLineNumbers: options.dumpLineNumbers,
            strictUnits: Boolean(options.strictUnits),
            numPrecision: 8
          };
          if (options.sourceMap) {
            sourceMapBuilder = new SourceMapBuilder(options.sourceMap);
            result.css = sourceMapBuilder.toCSS(evaldRoot, toCSSOptions, this.imports);
          } else {
            result.css = evaldRoot.toCSS(toCSSOptions);
          }
        } catch (e) {
          throw new _lessError["default"](e, this.imports);
        }
        if (options.pluginManager) {
          var postProcessors = options.pluginManager.getPostProcessors();
          for (var i = 0; i < postProcessors.length; i++) {
            result.css = postProcessors[i].process(result.css, {
              sourceMap: sourceMapBuilder,
              options: options,
              imports: this.imports
            });
          }
        }
        if (options.sourceMap) {
          result.map = sourceMapBuilder.getExternalSourceMap();
        }
        var rootFilename = this.imports.rootFilename;
        result.imports = this.imports.files.filter(function (file) {
          return file !== rootFilename;
        });
        return result;
      }
    }]);
  }();
  return ParseTree;
};