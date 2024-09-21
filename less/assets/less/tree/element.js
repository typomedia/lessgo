"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _paren = _interopRequireDefault(require("./paren"));
var _combinator = _interopRequireDefault(require("./combinator"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
var Element = /*#__PURE__*/function (_Node) {
  function Element(combinator, value, isVariable, index, currentFileInfo, visibilityInfo) {
    var _this;
    _classCallCheck(this, Element);
    _this = _callSuper(this, Element);
    _this.combinator = combinator instanceof _combinator["default"] ? combinator : new _combinator["default"](combinator);
    if (typeof value === 'string') {
      _this.value = value.trim();
    } else if (value) {
      _this.value = value;
    } else {
      _this.value = '';
    }
    _this.isVariable = isVariable;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.copyVisibilityInfo(visibilityInfo);
    _this.setParent(_this.combinator, _this);
    return _this;
  }
  _inherits(Element, _Node);
  return _createClass(Element, [{
    key: "accept",
    value: function accept(visitor) {
      var value = this.value;
      this.combinator = visitor.visit(this.combinator);
      if (_typeof(value) === 'object') {
        this.value = visitor.visit(value);
      }
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      return new Element(this.combinator, this.value.eval ? this.value.eval(context) : this.value, this.isVariable, this.getIndex(), this.fileInfo(), this.visibilityInfo());
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Element(this.combinator, this.value, this.isVariable, this.getIndex(), this.fileInfo(), this.visibilityInfo());
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add(this.toCSS(context), this.fileInfo(), this.getIndex());
    }
  }, {
    key: "toCSS",
    value: function toCSS() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var value = this.value;
      var firstSelector = context.firstSelector;
      if (value instanceof _paren["default"]) {
        // selector in parens should not be affected by outer selector
        // flags (breaks only interpolated selectors - see #1973)
        context.firstSelector = true;
      }
      value = value.toCSS ? value.toCSS(context) : value;
      context.firstSelector = firstSelector;
      if (value === '' && this.combinator.value.charAt(0) === '&') {
        return '';
      } else {
        return this.combinator.toCSS(context) + value;
      }
    }
  }]);
}(_node["default"]);
Element.prototype.type = 'Element';
var _default = exports["default"] = Element;