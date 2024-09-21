"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
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
var URL = /*#__PURE__*/function (_Node) {
  function URL(val, index, currentFileInfo, isEvald) {
    var _this;
    _classCallCheck(this, URL);
    _this = _callSuper(this, URL);
    _this.value = val;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.isEvald = isEvald;
    return _this;
  }
  _inherits(URL, _Node);
  return _createClass(URL, [{
    key: "accept",
    value: function accept(visitor) {
      this.value = visitor.visit(this.value);
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add('url(');
      this.value.genCSS(context, output);
      output.add(')');
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var val = this.value.eval(context);
      var rootpath;
      if (!this.isEvald) {
        // Add the rootpath if the URL requires a rewrite
        rootpath = this.fileInfo() && this.fileInfo().rootpath;
        if (typeof rootpath === 'string' && typeof val.value === 'string' && context.pathRequiresRewrite(val.value)) {
          if (!val.quote) {
            rootpath = escapePath(rootpath);
          }
          val.value = context.rewritePath(val.value, rootpath);
        } else {
          val.value = context.normalizePath(val.value);
        }

        // Add url args if enabled
        if (context.urlArgs) {
          if (!val.value.match(/^\s*data:/)) {
            var delimiter = val.value.indexOf('?') === -1 ? '?' : '&';
            var urlArgs = delimiter + context.urlArgs;
            if (val.value.indexOf('#') !== -1) {
              val.value = val.value.replace('#', "".concat(urlArgs, "#"));
            } else {
              val.value += urlArgs;
            }
          }
        }
      }
      return new URL(val, this.getIndex(), this.fileInfo(), true);
    }
  }]);
}(_node["default"]);
URL.prototype.type = 'Url';
function escapePath(path) {
  return path.replace(/[\(\)'"\s]/g, function (match) {
    return "\\".concat(match);
  });
}
var _default = exports["default"] = URL;