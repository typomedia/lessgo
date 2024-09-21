"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _paren = _interopRequireDefault(require("./paren"));
var _comment = _interopRequireDefault(require("./comment"));
var _dimension = _interopRequireDefault(require("./dimension"));
var Constants = _interopRequireWildcard(require("../constants"));
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
var MATH = Constants.Math;
var Expression = /*#__PURE__*/function (_Node) {
  function Expression(value, noSpacing) {
    var _this;
    _classCallCheck(this, Expression);
    _this = _callSuper(this, Expression);
    _this.value = value;
    _this.noSpacing = noSpacing;
    if (!value) {
      throw new Error('Expression requires an array parameter');
    }
    return _this;
  }
  _inherits(Expression, _Node);
  return _createClass(Expression, [{
    key: "accept",
    value: function accept(visitor) {
      this.value = visitor.visitArray(this.value);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var returnValue;
      var mathOn = context.isMathOn();
      var inParenthesis = this.parens && (context.math !== MATH.STRICT_LEGACY || !this.parensInOp);
      var doubleParen = false;
      if (inParenthesis) {
        context.inParenthesis();
      }
      if (this.value.length > 1) {
        returnValue = new Expression(this.value.map(function (e) {
          if (!e.eval) {
            return e;
          }
          return e.eval(context);
        }), this.noSpacing);
      } else if (this.value.length === 1) {
        if (this.value[0].parens && !this.value[0].parensInOp && !context.inCalc) {
          doubleParen = true;
        }
        returnValue = this.value[0].eval(context);
      } else {
        returnValue = this;
      }
      if (inParenthesis) {
        context.outOfParenthesis();
      }
      if (this.parens && this.parensInOp && !mathOn && !doubleParen && !(returnValue instanceof _dimension["default"])) {
        returnValue = new _paren["default"](returnValue);
      }
      return returnValue;
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      for (var i = 0; i < this.value.length; i++) {
        this.value[i].genCSS(context, output);
        if (!this.noSpacing && i + 1 < this.value.length) {
          output.add(' ');
        }
      }
    }
  }, {
    key: "throwAwayComments",
    value: function throwAwayComments() {
      this.value = this.value.filter(function (v) {
        return !(v instanceof _comment["default"]);
      });
    }
  }]);
}(_node["default"]);
Expression.prototype.type = 'Expression';
var _default = exports["default"] = Expression;