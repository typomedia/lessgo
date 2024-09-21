"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _variable = _interopRequireDefault(require("./variable"));

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

var JsEvalNode = /*#__PURE__*/function (_Node) {
  _inherits(JsEvalNode, _Node);

  var _super = _createSuper(JsEvalNode);

  function JsEvalNode() {
    _classCallCheck(this, JsEvalNode);

    return _super.apply(this, arguments);
  }

  _createClass(JsEvalNode, [{
    key: "evaluateJavaScript",
    value: function evaluateJavaScript(expression, context) {
      var result;
      var that = this;
      var evalContext = {};

      if (!context.javascriptEnabled) {
        throw {
          message: 'Inline JavaScript is not enabled. Is it set in your options?',
          filename: this.fileInfo().filename,
          index: this.getIndex()
        };
      }

      expression = expression.replace(/@\{([\w-]+)\}/g, function (_, name) {
        return that.jsify(new _variable["default"]("@".concat(name), that.getIndex(), that.fileInfo()).eval(context));
      });

      try {
        expression = new Function("return (".concat(expression, ")"));
      } catch (e) {
        throw {
          message: "JavaScript evaluation error: ".concat(e.message, " from `").concat(expression, "`"),
          filename: this.fileInfo().filename,
          index: this.getIndex()
        };
      }

      var variables = context.frames[0].variables();

      for (var k in variables) {
        if (variables.hasOwnProperty(k)) {
          /* jshint loopfunc:true */
          evalContext[k.slice(1)] = {
            value: variables[k].value,
            toJS: function toJS() {
              return this.value.eval(context).toCSS();
            }
          };
        }
      }

      try {
        result = expression.call(evalContext);
      } catch (e) {
        throw {
          message: "JavaScript evaluation error: '".concat(e.name, ": ").concat(e.message.replace(/["]/g, '\''), "'"),
          filename: this.fileInfo().filename,
          index: this.getIndex()
        };
      }

      return result;
    }
  }, {
    key: "jsify",
    value: function jsify(obj) {
      if (Array.isArray(obj.value) && obj.value.length > 1) {
        return "[".concat(obj.value.map(function (v) {
          return v.toCSS();
        }).join(', '), "]");
      } else {
        return obj.toCSS();
      }
    }
  }]);

  return JsEvalNode;
}(_node["default"]);

var _default = JsEvalNode;
exports["default"] = _default;