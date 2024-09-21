"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _paren = _interopRequireDefault(require("./paren"));

var _comment = _interopRequireDefault(require("./comment"));

var _dimension = _interopRequireDefault(require("./dimension"));

var Constants = _interopRequireWildcard(require("../constants"));

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

var MATH = Constants.Math;

var Expression = /*#__PURE__*/function (_Node) {
  _inherits(Expression, _Node);

  var _super = _createSuper(Expression);

  function Expression(value, noSpacing) {
    var _this;

    _classCallCheck(this, Expression);

    _this = _super.call(this);
    _this.value = value;
    _this.noSpacing = noSpacing;

    if (!value) {
      throw new Error('Expression requires an array parameter');
    }

    return _this;
  }

  _createClass(Expression, [{
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

  return Expression;
}(_node["default"]);

Expression.prototype.type = 'Expression';
var _default = Expression;
exports["default"] = _default;