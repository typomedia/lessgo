"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _variable = _interopRequireDefault(require("./variable"));
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
var JsEvalNode = /*#__PURE__*/function (_Node) {
  function JsEvalNode() {
    _classCallCheck(this, JsEvalNode);
    return _callSuper(this, JsEvalNode, arguments);
  }
  _inherits(JsEvalNode, _Node);
  return _createClass(JsEvalNode, [{
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
}(_node["default"]);
var _default = exports["default"] = JsEvalNode;