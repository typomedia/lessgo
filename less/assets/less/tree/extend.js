"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _selector = _interopRequireDefault(require("./selector"));

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

var Extend = /*#__PURE__*/function (_Node) {
  _inherits(Extend, _Node);

  var _super = _createSuper(Extend);

  function Extend(selector, option, index, currentFileInfo, visibilityInfo) {
    var _this;

    _classCallCheck(this, Extend);

    _this = _super.call(this);
    _this.selector = selector;
    _this.option = option;
    _this.object_id = Extend.next_id++;
    _this.parent_ids = [_this.object_id];
    _this._index = index;
    _this._fileInfo = currentFileInfo;

    _this.copyVisibilityInfo(visibilityInfo);

    _this.allowRoot = true;

    switch (option) {
      case 'all':
        _this.allowBefore = true;
        _this.allowAfter = true;
        break;

      default:
        _this.allowBefore = false;
        _this.allowAfter = false;
        break;
    }

    _this.setParent(_this.selector, _assertThisInitialized(_this));

    return _this;
  }

  _createClass(Extend, [{
    key: "accept",
    value: function accept(visitor) {
      this.selector = visitor.visit(this.selector);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      return new Extend(this.selector.eval(context), this.option, this.getIndex(), this.fileInfo(), this.visibilityInfo());
    }
  }, {
    key: "clone",
    value: function clone(context) {
      return new Extend(this.selector, this.option, this.getIndex(), this.fileInfo(), this.visibilityInfo());
    } // it concatenates (joins) all selectors in selector array

  }, {
    key: "findSelfSelectors",
    value: function findSelfSelectors(selectors) {
      var selfElements = [];
      var i;
      var selectorElements;

      for (i = 0; i < selectors.length; i++) {
        selectorElements = selectors[i].elements; // duplicate the logic in genCSS function inside the selector node.
        // future TODO - move both logics into the selector joiner visitor

        if (i > 0 && selectorElements.length && selectorElements[0].combinator.value === '') {
          selectorElements[0].combinator.value = ' ';
        }

        selfElements = selfElements.concat(selectors[i].elements);
      }

      this.selfSelectors = [new _selector["default"](selfElements)];
      this.selfSelectors[0].copyVisibilityInfo(this.visibilityInfo());
    }
  }]);

  return Extend;
}(_node["default"]);

Extend.next_id = 0;
Extend.prototype.type = 'Extend';
var _default = Extend;
exports["default"] = _default;