"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _unitConversions = _interopRequireDefault(require("../data/unit-conversions"));

var utils = _interopRequireWildcard(require("../utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var Unit = /*#__PURE__*/function (_Node) {
  _inherits(Unit, _Node);

  var _super = _createSuper(Unit);

  function Unit(numerator, denominator, backupUnit) {
    var _this;

    _classCallCheck(this, Unit);

    _this = _super.call(this);
    _this.numerator = numerator ? utils.copyArray(numerator).sort() : [];
    _this.denominator = denominator ? utils.copyArray(denominator).sort() : [];

    if (backupUnit) {
      _this.backupUnit = backupUnit;
    } else if (numerator && numerator.length) {
      _this.backupUnit = numerator[0];
    }

    return _this;
  }

  _createClass(Unit, [{
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

  return Unit;
}(_node["default"]);

Unit.prototype.type = 'Unit';
var _default = Unit;
exports["default"] = _default;