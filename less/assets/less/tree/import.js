"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _media = _interopRequireDefault(require("./media"));
var _url = _interopRequireDefault(require("./url"));
var _quoted = _interopRequireDefault(require("./quoted"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var utils = _interopRequireWildcard(require("../utils"));
var _lessError = _interopRequireDefault(require("../less-error"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
var Import = /*#__PURE__*/function (_Node) {
  function Import(path, features, options, index, currentFileInfo, visibilityInfo) {
    var _this;
    _classCallCheck(this, Import);
    _this = _callSuper(this, Import);
    _this.options = options;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.path = path;
    _this.features = features;
    _this.allowRoot = true;
    if (_this.options.less !== undefined || _this.options.inline) {
      _this.css = !_this.options.less || _this.options.inline;
    } else {
      var pathValue = _this.getPath();
      if (pathValue && /[#\.\&\?]css([\?;].*)?$/.test(pathValue)) {
        _this.css = true;
      }
    }
    _this.copyVisibilityInfo(visibilityInfo);
    _this.setParent(_this.features, _this);
    _this.setParent(_this.path, _this);
    return _this;
  }
  _inherits(Import, _Node);
  return _createClass(Import, [{
    key: "accept",
    value: function accept(visitor) {
      if (this.features) {
        this.features = visitor.visit(this.features);
      }
      this.path = visitor.visit(this.path);
      if (!this.options.isPlugin && !this.options.inline && this.root) {
        this.root = visitor.visit(this.root);
      }
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      if (this.css && this.path._fileInfo.reference === undefined) {
        output.add('@import ', this._fileInfo, this._index);
        this.path.genCSS(context, output);
        if (this.features) {
          output.add(' ');
          this.features.genCSS(context, output);
        }
        output.add(';');
      }
    }
  }, {
    key: "getPath",
    value: function getPath() {
      return this.path instanceof _url["default"] ? this.path.value.value : this.path.value;
    }
  }, {
    key: "isVariableImport",
    value: function isVariableImport() {
      var path = this.path;
      if (path instanceof _url["default"]) {
        path = path.value;
      }
      if (path instanceof _quoted["default"]) {
        return path.containsVariables();
      }
      return true;
    }
  }, {
    key: "evalForImport",
    value: function evalForImport(context) {
      var path = this.path;
      if (path instanceof _url["default"]) {
        path = path.value;
      }
      return new Import(path.eval(context), this.features, this.options, this._index, this._fileInfo, this.visibilityInfo());
    }
  }, {
    key: "evalPath",
    value: function evalPath(context) {
      var path = this.path.eval(context);
      var fileInfo = this._fileInfo;
      if (!(path instanceof _url["default"])) {
        // Add the rootpath if the URL requires a rewrite
        var pathValue = path.value;
        if (fileInfo && pathValue && context.pathRequiresRewrite(pathValue)) {
          path.value = context.rewritePath(pathValue, fileInfo.rootpath);
        } else {
          path.value = context.normalizePath(path.value);
        }
      }
      return path;
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var result = this.doEval(context);
      if (this.options.reference || this.blocksVisibility()) {
        if (result.length || result.length === 0) {
          result.forEach(function (node) {
            node.addVisibilityBlock();
          });
        } else {
          result.addVisibilityBlock();
        }
      }
      return result;
    }
  }, {
    key: "doEval",
    value: function doEval(context) {
      var ruleset;
      var registry;
      var features = this.features && this.features.eval(context);
      if (this.options.isPlugin) {
        if (this.root && this.root.eval) {
          try {
            this.root.eval(context);
          } catch (e) {
            e.message = 'Plugin error during evaluation';
            throw new _lessError["default"](e, this.root.imports, this.root.filename);
          }
        }
        registry = context.frames[0] && context.frames[0].functionRegistry;
        if (registry && this.root && this.root.functions) {
          registry.addMultiple(this.root.functions);
        }
        return [];
      }
      if (this.skip) {
        if (typeof this.skip === 'function') {
          this.skip = this.skip();
        }
        if (this.skip) {
          return [];
        }
      }
      if (this.options.inline) {
        var contents = new _anonymous["default"](this.root, 0, {
          filename: this.importedFilename,
          reference: this.path._fileInfo && this.path._fileInfo.reference
        }, true, true);
        return this.features ? new _media["default"]([contents], this.features.value) : [contents];
      } else if (this.css) {
        var newImport = new Import(this.evalPath(context), features, this.options, this._index);
        if (!newImport.css && this.error) {
          throw this.error;
        }
        return newImport;
      } else if (this.root) {
        ruleset = new _ruleset["default"](null, utils.copyArray(this.root.rules));
        ruleset.evalImports(context);
        return this.features ? new _media["default"](ruleset.rules, this.features.value) : ruleset.rules;
      } else {
        return [];
      }
    }
  }]);
}(_node["default"]);
Import.prototype.type = 'Import';
var _default = exports["default"] = Import;