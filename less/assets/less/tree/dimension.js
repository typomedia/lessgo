"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _unitConversions = _interopRequireDefault(require("../data/unit-conversions"));
var _unit = _interopRequireDefault(require("./unit"));
var _color = _interopRequireDefault(require("./color"));
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
// A number with a unit
//
var Dimension = /*#__PURE__*/function (_Node) {
  function Dimension(value, unit) {
    var _this;
    _classCallCheck(this, Dimension);
    _this = _callSuper(this, Dimension);
    _this.value = parseFloat(value);
    if (isNaN(_this.value)) {
      throw new Error('Dimension is not a number.');
    }
    _this.unit = unit && unit instanceof _unit["default"] ? unit : new _unit["default"](unit ? [unit] : undefined);
    _this.setParent(_this.unit, _this);
    return _this;
  }
  _inherits(Dimension, _Node);
  return _createClass(Dimension, [{
    key: "accept",
    value: function accept(visitor) {
      this.unit = visitor.visit(this.unit);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      return this;
    }
  }, {
    key: "toColor",
    value: function toColor() {
      return new _color["default"]([this.value, this.value, this.value]);
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      if (context && context.strictUnits && !this.unit.isSingular()) {
        throw new Error("Multiple units in dimension. Correct the units or use the unit function. Bad unit: ".concat(this.unit.toString()));
      }
      var value = this.fround(context, this.value);
      var strValue = String(value);
      if (value !== 0 && value < 0.000001 && value > -0.000001) {
        // would be output 1e-6 etc.
        strValue = value.toFixed(20).replace(/0+$/, '');
      }
      if (context && context.compress) {
        // Zero values doesn't need a unit
        if (value === 0 && this.unit.isLength()) {
          output.add(strValue);
          return;
        }

        // Float values doesn't need a leading zero
        if (value > 0 && value < 1) {
          strValue = strValue.substr(1);
        }
      }
      output.add(strValue);
      this.unit.genCSS(context, output);
    }

    // In an operation between two Dimensions,
    // we default to the first Dimension's unit,
    // so `1px + 2` will yield `3px`.
  }, {
    key: "operate",
    value: function operate(context, op, other) {
      /* jshint noempty:false */
      var value = this._operate(context, op, this.value, other.value);
      var unit = this.unit.clone();
      if (op === '+' || op === '-') {
        if (unit.numerator.length === 0 && unit.denominator.length === 0) {
          unit = other.unit.clone();
          if (this.unit.backupUnit) {
            unit.backupUnit = this.unit.backupUnit;
          }
        } else if (other.unit.numerator.length === 0 && unit.denominator.length === 0) {
          // do nothing
        } else {
          other = other.convertTo(this.unit.usedUnits());
          if (context.strictUnits && other.unit.toString() !== unit.toString()) {
            throw new Error("Incompatible units. Change the units or use the unit function. " + "Bad units: '".concat(unit.toString(), "' and '").concat(other.unit.toString(), "'."));
          }
          value = this._operate(context, op, this.value, other.value);
        }
      } else if (op === '*') {
        unit.numerator = unit.numerator.concat(other.unit.numerator).sort();
        unit.denominator = unit.denominator.concat(other.unit.denominator).sort();
        unit.cancel();
      } else if (op === '/') {
        unit.numerator = unit.numerator.concat(other.unit.denominator).sort();
        unit.denominator = unit.denominator.concat(other.unit.numerator).sort();
        unit.cancel();
      }
      return new Dimension(value, unit);
    }
  }, {
    key: "compare",
    value: function compare(other) {
      var a;
      var b;
      if (!(other instanceof Dimension)) {
        return undefined;
      }
      if (this.unit.isEmpty() || other.unit.isEmpty()) {
        a = this;
        b = other;
      } else {
        a = this.unify();
        b = other.unify();
        if (a.unit.compare(b.unit) !== 0) {
          return undefined;
        }
      }
      return _node["default"].numericCompare(a.value, b.value);
    }
  }, {
    key: "unify",
    value: function unify() {
      return this.convertTo({
        length: 'px',
        duration: 's',
        angle: 'rad'
      });
    }
  }, {
    key: "convertTo",
    value: function convertTo(conversions) {
      var value = this.value;
      var unit = this.unit.clone();
      var i;
      var groupName;
      var group;
      var targetUnit;
      var derivedConversions = {};
      var applyUnit;
      if (typeof conversions === 'string') {
        for (i in _unitConversions["default"]) {
          if (_unitConversions["default"][i].hasOwnProperty(conversions)) {
            derivedConversions = {};
            derivedConversions[i] = conversions;
          }
        }
        conversions = derivedConversions;
      }
      applyUnit = function applyUnit(atomicUnit, denominator) {
        /* jshint loopfunc:true */
        if (group.hasOwnProperty(atomicUnit)) {
          if (denominator) {
            value = value / (group[atomicUnit] / group[targetUnit]);
          } else {
            value = value * (group[atomicUnit] / group[targetUnit]);
          }
          return targetUnit;
        }
        return atomicUnit;
      };
      for (groupName in conversions) {
        if (conversions.hasOwnProperty(groupName)) {
          targetUnit = conversions[groupName];
          group = _unitConversions["default"][groupName];
          unit.map(applyUnit);
        }
      }
      unit.cancel();
      return new Dimension(value, unit);
    }
  }]);
}(_node["default"]);
Dimension.prototype.type = 'Dimension';
var _default = exports["default"] = Dimension;