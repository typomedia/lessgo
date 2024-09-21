"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _variable = _interopRequireDefault(require("./variable"));
var _property = _interopRequireDefault(require("./property"));
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
var Quoted = /*#__PURE__*/function (_Node) {
  function Quoted(str, content, escaped, index, currentFileInfo) {
    var _this;
    _classCallCheck(this, Quoted);
    _this = _callSuper(this, Quoted);
    _this.escaped = escaped == null ? true : escaped;
    _this.value = content || '';
    _this.quote = str.charAt(0);
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.variableRegex = /@\{([\w-]+)\}/g;
    _this.propRegex = /\$\{([\w-]+)\}/g;
    _this.allowRoot = escaped;
    return _this;
  }
  _inherits(Quoted, _Node);
  return _createClass(Quoted, [{
    key: "genCSS",
    value: function genCSS(context, output) {
      if (!this.escaped) {
        output.add(this.quote, this.fileInfo(), this.getIndex());
      }
      output.add(this.value);
      if (!this.escaped) {
        output.add(this.quote);
      }
    }
  }, {
    key: "containsVariables",
    value: function containsVariables() {
      return this.value.match(this.variableRegex);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var that = this;
      var value = this.value;
      var variableReplacement = function variableReplacement(_, name) {
        var v = new _variable["default"]("@".concat(name), that.getIndex(), that.fileInfo()).eval(context, true);
        return v instanceof Quoted ? v.value : v.toCSS();
      };
      var propertyReplacement = function propertyReplacement(_, name) {
        var v = new _property["default"]("$".concat(name), that.getIndex(), that.fileInfo()).eval(context, true);
        return v instanceof Quoted ? v.value : v.toCSS();
      };
      function iterativeReplace(value, regexp, replacementFnc) {
        var evaluatedValue = value;
        do {
          value = evaluatedValue.toString();
          evaluatedValue = value.replace(regexp, replacementFnc);
        } while (value !== evaluatedValue);
        return evaluatedValue;
      }
      value = iterativeReplace(value, this.variableRegex, variableReplacement);
      value = iterativeReplace(value, this.propRegex, propertyReplacement);
      return new Quoted(this.quote + value + this.quote, value, this.escaped, this.getIndex(), this.fileInfo());
    }
  }, {
    key: "compare",
    value: function compare(other) {
      // when comparing quoted strings allow the quote to differ
      if (other.type === 'Quoted' && !this.escaped && !other.escaped) {
        return _node["default"].numericCompare(this.value, other.value);
      } else {
        return other.toCSS && this.toCSS() === other.toCSS() ? 0 : undefined;
      }
    }
  }]);
}(_node["default"]);
Quoted.prototype.type = 'Quoted';
var _default = exports["default"] = Quoted;