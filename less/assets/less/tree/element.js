"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _paren = _interopRequireDefault(require("./paren"));

var _combinator = _interopRequireDefault(require("./combinator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var Element = /*#__PURE__*/function (_Node) {
  _inherits(Element, _Node);

  var _super = _createSuper(Element);

  function Element(combinator, value, isVariable, index, currentFileInfo, visibilityInfo) {
    var _this;

    _classCallCheck(this, Element);

    _this = _super.call(this);
    _this.combinator = combinator instanceof _combinator["default"] ? combinator : new _combinator["default"](combinator);

    if (typeof value === 'string') {
      _this.value = value.trim();
    } else if (value) {
      _this.value = value;
    } else {
      _this.value = '';
    }

    _this.isVariable = isVariable;
    _this._index = index;
    _this._fileInfo = currentFileInfo;

    _this.copyVisibilityInfo(visibilityInfo);

    _this.setParent(_this.combinator, _assertThisInitialized(_this));

    return _this;
  }

  _createClass(Element, [{
    key: "accept",
    value: function accept(visitor) {
      var value = this.value;
      this.combinator = visitor.visit(this.combinator);

      if (_typeof(value) === 'object') {
        this.value = visitor.visit(value);
      }
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      return new Element(this.combinator, this.value.eval ? this.value.eval(context) : this.value, this.isVariable, this.getIndex(), this.fileInfo(), this.visibilityInfo());
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Element(this.combinator, this.value, this.isVariable, this.getIndex(), this.fileInfo(), this.visibilityInfo());
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add(this.toCSS(context), this.fileInfo(), this.getIndex());
    }
  }, {
    key: "toCSS",
    value: function toCSS() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var value = this.value;
      var firstSelector = context.firstSelector;

      if (value instanceof _paren["default"]) {
        // selector in parens should not be affected by outer selector
        // flags (breaks only interpolated selectors - see #1973)
        context.firstSelector = true;
      }

      value = value.toCSS ? value.toCSS(context) : value;
      context.firstSelector = firstSelector;

      if (value === '' && this.combinator.value.charAt(0) === '&') {
        return '';
      } else {
        return this.combinator.toCSS(context) + value;
      }
    }
  }]);

  return Element;
}(_node["default"]);

Element.prototype.type = 'Element';
var _default = Element;
exports["default"] = _default;