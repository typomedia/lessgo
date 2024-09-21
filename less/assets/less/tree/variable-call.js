"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _variable = _interopRequireDefault(require("./variable"));

var _ruleset = _interopRequireDefault(require("./ruleset"));

var _detachedRuleset = _interopRequireDefault(require("./detached-ruleset"));

var _lessError = _interopRequireDefault(require("../less-error"));

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

var VariableCall = /*#__PURE__*/function (_Node) {
  _inherits(VariableCall, _Node);

  var _super = _createSuper(VariableCall);

  function VariableCall(variable, index, currentFileInfo) {
    var _this;

    _classCallCheck(this, VariableCall);

    _this = _super.call(this);
    _this.variable = variable;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.allowRoot = true;
    return _this;
  }

  _createClass(VariableCall, [{
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

  return VariableCall;
}(_node["default"]);

VariableCall.prototype.type = 'VariableCall';
var _default = VariableCall;
exports["default"] = _default;