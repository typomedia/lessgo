"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var _functionCaller = _interopRequireDefault(require("../functions/function-caller"));
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
// A function call node.
//
var Call = /*#__PURE__*/function (_Node) {
  function Call(name, args, index, currentFileInfo) {
    var _this;
    _classCallCheck(this, Call);
    _this = _callSuper(this, Call);
    _this.name = name;
    _this.args = args;
    _this.calc = name === 'calc';
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    return _this;
  }
  _inherits(Call, _Node);
  return _createClass(Call, [{
    key: "accept",
    value: function accept(visitor) {
      if (this.args) {
        this.args = visitor.visitArray(this.args);
      }
    }

    //
    // When evaluating a function call,
    // we either find the function in the functionRegistry,
    // in which case we call it, passing the  evaluated arguments,
    // if this returns null or we cannot find the function, we
    // simply print it out as it appeared originally [2].
    //
    // The reason why we evaluate the arguments, is in the case where
    // we try to pass a variable to a function, like: `saturate(@color)`.
    // The function should receive the value, not the variable.
    //
  }, {
    key: "eval",
    value: function _eval(context) {
      var _this2 = this;
      /**
       * Turn off math for calc(), and switch back on for evaluating nested functions
       */
      var currentMathContext = context.mathOn;
      context.mathOn = !this.calc;
      if (this.calc || context.inCalc) {
        context.enterCalc();
      }
      var exitCalc = function exitCalc() {
        if (_this2.calc || context.inCalc) {
          context.exitCalc();
        }
        context.mathOn = currentMathContext;
      };
      var result;
      var funcCaller = new _functionCaller["default"](this.name, context, this.getIndex(), this.fileInfo());
      if (funcCaller.isValid()) {
        try {
          result = funcCaller.call(this.args);
          exitCalc();
        } catch (e) {
          if (e.hasOwnProperty('line') && e.hasOwnProperty('column')) {
            throw e;
          }
          throw {
            type: e.type || 'Runtime',
            message: "error evaluating function `".concat(this.name, "`").concat(e.message ? ": ".concat(e.message) : ''),
            index: this.getIndex(),
            filename: this.fileInfo().filename,
            line: e.lineNumber,
            column: e.columnNumber
          };
        }
        if (result !== null && result !== undefined) {
          // Results that that are not nodes are cast as Anonymous nodes
          // Falsy values or booleans are returned as empty nodes
          if (!(result instanceof _node["default"])) {
            if (!result || result === true) {
              result = new _anonymous["default"](null);
            } else {
              result = new _anonymous["default"](result.toString());
            }
          }
          result._index = this._index;
          result._fileInfo = this._fileInfo;
          return result;
        }
      }
      var args = this.args.map(function (a) {
        return a.eval(context);
      });
      exitCalc();
      return new Call(this.name, args, this.getIndex(), this.fileInfo());
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add("".concat(this.name, "("), this.fileInfo(), this.getIndex());
      for (var i = 0; i < this.args.length; i++) {
        this.args[i].genCSS(context, output);
        if (i + 1 < this.args.length) {
          output.add(', ');
        }
      }
      output.add(')');
    }
  }]);
}(_node["default"]);
Call.prototype.type = 'Call';
var _default = exports["default"] = Call;