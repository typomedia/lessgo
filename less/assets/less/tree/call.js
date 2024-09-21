"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _anonymous = _interopRequireDefault(require("./anonymous"));

var _functionCaller = _interopRequireDefault(require("../functions/function-caller"));

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
// A function call node.
//
var Call = /*#__PURE__*/function (_Node) {
  _inherits(Call, _Node);

  var _super = _createSuper(Call);

  function Call(name, args, index, currentFileInfo) {
    var _this;

    _classCallCheck(this, Call);

    _this = _super.call(this);
    _this.name = name;
    _this.args = args;
    _this.calc = name === 'calc';
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    return _this;
  }

  _createClass(Call, [{
    key: "accept",
    value: function accept(visitor) {
      if (this.args) {
        this.args = visitor.visitArray(this.args);
      }
    } //
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

  return Call;
}(_node["default"]);

Call.prototype.type = 'Call';
var _default = Call;
exports["default"] = _default;