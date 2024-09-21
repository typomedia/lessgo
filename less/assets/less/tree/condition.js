"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

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

var Condition = /*#__PURE__*/function (_Node) {
  _inherits(Condition, _Node);

  var _super = _createSuper(Condition);

  function Condition(op, l, r, i, negate) {
    var _this;

    _classCallCheck(this, Condition);

    _this = _super.call(this);
    _this.op = op.trim();
    _this.lvalue = l;
    _this.rvalue = r;
    _this._index = i;
    _this.negate = negate;
    return _this;
  }

  _createClass(Condition, [{
    key: "accept",
    value: function accept(visitor) {
      this.lvalue = visitor.visit(this.lvalue);
      this.rvalue = visitor.visit(this.rvalue);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var result = function (op, a, b) {
        switch (op) {
          case 'and':
            return a && b;

          case 'or':
            return a || b;

          default:
            switch (_node["default"].compare(a, b)) {
              case -1:
                return op === '<' || op === '=<' || op === '<=';

              case 0:
                return op === '=' || op === '>=' || op === '=<' || op === '<=';

              case 1:
                return op === '>' || op === '>=';

              default:
                return false;
            }

        }
      }(this.op, this.lvalue.eval(context), this.rvalue.eval(context));

      return this.negate ? !result : result;
    }
  }]);

  return Condition;
}(_node["default"]);

Condition.prototype.type = 'Condition';
var _default = Condition;
exports["default"] = _default;