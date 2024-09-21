"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _unitConversions = _interopRequireDefault(require("../data/unit-conversions"));

var _unit = _interopRequireDefault(require("./unit"));

var _color = _interopRequireDefault(require("./color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

//
// A number with a unit
//
var Dimension = /*#__PURE__*/function (_Node) {
  _inherits(Dimension, _Node);

  var _super = _createSuper(Dimension);

  function Dimension(value, unit) {
    var _this;

    _classCallCheck(this, Dimension);

    _this = _super.call(this);
    _this.value = parseFloat(value);

    if (isNaN(_this.value)) {
      throw new Error('Dimension is not a number.');
    }

    _this.unit = unit && unit instanceof _unit["default"] ? unit : new _unit["default"](unit ? [unit] : undefined);

    _this.setParent(_this.unit, _assertThisInitialized(_this));

    return _this;
  }

  _createClass(Dimension, [{
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
        } // Float values doesn't need a leading zero


        if (value > 0 && value < 1) {
          strValue = strValue.substr(1);
        }
      }

      output.add(strValue);
      this.unit.genCSS(context, output);
    } // In an operation between two Dimensions,
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
        } else if (other.unit.numerator.length === 0 && unit.denominator.length === 0) {// do nothing
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

  return Dimension;
}(_node["default"]);

Dimension.prototype.type = 'Dimension';
var _default = Dimension;
exports["default"] = _default;