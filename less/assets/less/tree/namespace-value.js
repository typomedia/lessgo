"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _variable = _interopRequireDefault(require("./variable"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _selector = _interopRequireDefault(require("./selector"));
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
var NamespaceValue = /*#__PURE__*/function (_Node) {
  function NamespaceValue(ruleCall, lookups, index, fileInfo) {
    var _this;
    _classCallCheck(this, NamespaceValue);
    _this = _callSuper(this, NamespaceValue);
    _this.value = ruleCall;
    _this.lookups = lookups;
    _this._index = index;
    _this._fileInfo = fileInfo;
    return _this;
  }
  _inherits(NamespaceValue, _Node);
  return _createClass(NamespaceValue, [{
    key: "eval",
    value: function _eval(context) {
      var i;
      var j;
      var name;
      var rules = this.value.eval(context);
      for (i = 0; i < this.lookups.length; i++) {
        name = this.lookups[i];

        /**
         * Eval'd DRs return rulesets.
         * Eval'd mixins return rules, so let's make a ruleset if we need it.
         * We need to do this because of late parsing of values
         */
        if (Array.isArray(rules)) {
          rules = new _ruleset["default"]([new _selector["default"]()], rules);
        }
        if (name === '') {
          rules = rules.lastDeclaration();
        } else if (name.charAt(0) === '@') {
          if (name.charAt(1) === '@') {
            name = "@".concat(new _variable["default"](name.substr(1)).eval(context).value);
          }
          if (rules.variables) {
            rules = rules.variable(name);
          }
          if (!rules) {
            throw {
              type: 'Name',
              message: "variable ".concat(name, " not found"),
              filename: this.fileInfo().filename,
              index: this.getIndex()
            };
          }
        } else {
          if (name.substring(0, 2) === '$@') {
            name = "$".concat(new _variable["default"](name.substr(1)).eval(context).value);
          } else {
            name = name.charAt(0) === '$' ? name : "$".concat(name);
          }
          if (rules.properties) {
            rules = rules.property(name);
          }
          if (!rules) {
            throw {
              type: 'Name',
              message: "property \"".concat(name.substr(1), "\" not found"),
              filename: this.fileInfo().filename,
              index: this.getIndex()
            };
          }
          // Properties are an array of values, since a ruleset can have multiple props.
          // We pick the last one (the "cascaded" value)
          rules = rules[rules.length - 1];
        }
        if (rules.value) {
          rules = rules.eval(context).value;
        }
        if (rules.ruleset) {
          rules = rules.ruleset.eval(context);
        }
      }
      return rules;
    }
  }]);
}(_node["default"]);
NamespaceValue.prototype.type = 'NamespaceValue';
var _default = exports["default"] = NamespaceValue;