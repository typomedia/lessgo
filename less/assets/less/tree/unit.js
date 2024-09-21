"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _unitConversions = _interopRequireDefault(require("../data/unit-conversions"));
var utils = _interopRequireWildcard(require("../utils"));
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
var Unit = /*#__PURE__*/function (_Node) {
  function Unit(numerator, denominator, backupUnit) {
    var _this;
    _classCallCheck(this, Unit);
    _this = _callSuper(this, Unit);
    _this.numerator = numerator ? utils.copyArray(numerator).sort() : [];
    _this.denominator = denominator ? utils.copyArray(denominator).sort() : [];
    if (backupUnit) {
      _this.backupUnit = backupUnit;
    } else if (numerator && numerator.length) {
      _this.backupUnit = numerator[0];
    }
    return _this;
  }
  _inherits(Unit, _Node);
  return _createClass(Unit, [{
    key: "clone",
    value: function clone() {
      return new Unit(utils.copyArray(this.numerator), utils.copyArray(this.denominator), this.backupUnit);
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      // Dimension checks the unit is singular and throws an error if in strict math mode.
      var strictUnits = context && context.strictUnits;
      if (this.numerator.length === 1) {
        output.add(this.numerator[0]); // the ideal situation
      } else if (!strictUnits && this.backupUnit) {
        output.add(this.backupUnit);
      } else if (!strictUnits && this.denominator.length) {
        output.add(this.denominator[0]);
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      var i;
      var returnStr = this.numerator.join('*');
      for (i = 0; i < this.denominator.length; i++) {
        returnStr += "/".concat(this.denominator[i]);
      }
      return returnStr;
    }
  }, {
    key: "compare",
    value: function compare(other) {
      return this.is(other.toString()) ? 0 : undefined;
    }
  }, {
    key: "is",
    value: function is(unitString) {
      return this.toString().toUpperCase() === unitString.toUpperCase();
    }
  }, {
    key: "isLength",
    value: function isLength() {
      return RegExp('^(px|em|ex|ch|rem|in|cm|mm|pc|pt|ex|vw|vh|vmin|vmax)$', 'gi').test(this.toCSS());
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.numerator.length === 0 && this.denominator.length === 0;
    }
  }, {
    key: "isSingular",
    value: function isSingular() {
      return this.numerator.length <= 1 && this.denominator.length === 0;
    }
  }, {
    key: "map",
    value: function map(callback) {
      var i;
      for (i = 0; i < this.numerator.length; i++) {
        this.numerator[i] = callback(this.numerator[i], false);
      }
      for (i = 0; i < this.denominator.length; i++) {
        this.denominator[i] = callback(this.denominator[i], true);
      }
    }
  }, {
    key: "usedUnits",
    value: function usedUnits() {
      var group;
      var result = {};
      var mapUnit;
      var groupName;
      mapUnit = function mapUnit(atomicUnit) {
        /* jshint loopfunc:true */
        if (group.hasOwnProperty(atomicUnit) && !result[groupName]) {
          result[groupName] = atomicUnit;
        }
        return atomicUnit;
      };
      for (groupName in _unitConversions["default"]) {
        if (_unitConversions["default"].hasOwnProperty(groupName)) {
          group = _unitConversions["default"][groupName];
          this.map(mapUnit);
        }
      }
      return result;
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var counter = {};
      var atomicUnit;
      var i;
      for (i = 0; i < this.numerator.length; i++) {
        atomicUnit = this.numerator[i];
        counter[atomicUnit] = (counter[atomicUnit] || 0) + 1;
      }
      for (i = 0; i < this.denominator.length; i++) {
        atomicUnit = this.denominator[i];
        counter[atomicUnit] = (counter[atomicUnit] || 0) - 1;
      }
      this.numerator = [];
      this.denominator = [];
      for (atomicUnit in counter) {
        if (counter.hasOwnProperty(atomicUnit)) {
          var count = counter[atomicUnit];
          if (count > 0) {
            for (i = 0; i < count; i++) {
              this.numerator.push(atomicUnit);
            }
          } else if (count < 0) {
            for (i = 0; i < -count; i++) {
              this.denominator.push(atomicUnit);
            }
          }
        }
      }
      this.numerator.sort();
      this.denominator.sort();
    }
  }]);
}(_node["default"]);
Unit.prototype.type = 'Unit';
var _default = exports["default"] = Unit;