"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _variable = _interopRequireDefault(require("./variable"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _detachedRuleset = _interopRequireDefault(require("./detached-ruleset"));
var _lessError = _interopRequireDefault(require("../less-error"));
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
var VariableCall = /*#__PURE__*/function (_Node) {
  function VariableCall(variable, index, currentFileInfo) {
    var _this;
    _classCallCheck(this, VariableCall);
    _this = _callSuper(this, VariableCall);
    _this.variable = variable;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.allowRoot = true;
    return _this;
  }
  _inherits(VariableCall, _Node);
  return _createClass(VariableCall, [{
    key: "eval",
    value: function _eval(context) {
      var rules;
      var detachedRuleset = new _variable["default"](this.variable, this.getIndex(), this.fileInfo()).eval(context);
      var error = new _lessError["default"]({
        message: "Could not evaluate variable call ".concat(this.variable)
      });
      if (!detachedRuleset.ruleset) {
        if (detachedRuleset.rules) {
          rules = detachedRuleset;
        } else if (Array.isArray(detachedRuleset)) {
          rules = new _ruleset["default"]('', detachedRuleset);
        } else if (Array.isArray(detachedRuleset.value)) {
          rules = new _ruleset["default"]('', detachedRuleset.value);
        } else {
          throw error;
        }
        detachedRuleset = new _detachedRuleset["default"](rules);
      }
      if (detachedRuleset.ruleset) {
        return detachedRuleset.callEval(context);
      }
      throw error;
    }
  }]);
}(_node["default"]);
VariableCall.prototype.type = 'VariableCall';
var _default = exports["default"] = VariableCall;