"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _element = _interopRequireDefault(require("./element"));

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

var Selector = /*#__PURE__*/function (_Node) {
  _inherits(Selector, _Node);

  var _super = _createSuper(Selector);

  function Selector(elements, extendList, condition, index, currentFileInfo, visibilityInfo) {
    var _this;

    _classCallCheck(this, Selector);

    _this = _super.call(this);
    _this.extendList = extendList;
    _this.condition = condition;
    _this.evaldCondition = !condition;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.elements = _this.getElements(elements);
    _this.mixinElements_ = undefined;

    _this.copyVisibilityInfo(visibilityInfo);

    _this.setParent(_this.elements, _assertThisInitialized(_this));

    return _this;
  }

  _createClass(Selector, [{
    key: "accept",
    value: function accept(visitor) {
      if (this.elements) {
        this.elements = visitor.visitArray(this.elements);
      }

      if (this.extendList) {
        this.extendList = visitor.visitArray(this.extendList);
      }

      if (this.condition) {
        this.condition = visitor.visit(this.condition);
      }
    }
  }, {
    key: "createDerived",
    value: function createDerived(elements, extendList, evaldCondition) {
      elements = this.getElements(elements);
      var newSelector = new Selector(elements, extendList || this.extendList, null, this.getIndex(), this.fileInfo(), this.visibilityInfo());
      newSelector.evaldCondition = evaldCondition != null ? evaldCondition : this.evaldCondition;
      newSelector.mediaEmpty = this.mediaEmpty;
      return newSelector;
    }
  }, {
    key: "getElements",
    value: function getElements(els) {
      if (!els) {
        return [new _element["default"]('', '&', false, this._index, this._fileInfo)];
      }

      if (typeof els === 'string') {
        this.parse.parseNode(els, ['selector'], this._index, this._fileInfo, function (err, result) {
          if (err) {
            throw new _lessError["default"]({
              index: err.index,
              message: err.message
            }, this.parse.imports, this._fileInfo.filename);
          }

          els = result[0].elements;
        });
      }

      return els;
    }
  }, {
    key: "createEmptySelectors",
    value: function createEmptySelectors() {
      var el = new _element["default"]('', '&', false, this._index, this._fileInfo);
      var sels = [new Selector([el], null, null, this._index, this._fileInfo)];
      sels[0].mediaEmpty = true;
      return sels;
    }
  }, {
    key: "match",
    value: function match(other) {
      var elements = this.elements;
      var len = elements.length;
      var olen;
      var i;
      other = other.mixinElements();
      olen = other.length;

      if (olen === 0 || len < olen) {
        return 0;
      } else {
        for (i = 0; i < olen; i++) {
          if (elements[i].value !== other[i]) {
            return 0;
          }
        }
      }

      return olen; // return number of matched elements
    }
  }, {
    key: "mixinElements",
    value: function mixinElements() {
      if (this.mixinElements_) {
        return this.mixinElements_;
      }

      var elements = this.elements.map(function (v) {
        return v.combinator.value + (v.value.value || v.value);
      }).join('').match(/[,&#\*\.\w-]([\w-]|(\\.))*/g);

      if (elements) {
        if (elements[0] === '&') {
          elements.shift();
        }
      } else {
        elements = [];
      }

      return this.mixinElements_ = elements;
    }
  }, {
    key: "isJustParentSelector",
    value: function isJustParentSelector() {
      return !this.mediaEmpty && this.elements.length === 1 && this.elements[0].value === '&' && (this.elements[0].combinator.value === ' ' || this.elements[0].combinator.value === '');
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var evaldCondition = this.condition && this.condition.eval(context);
      var elements = this.elements;
      var extendList = this.extendList;
      elements = elements && elements.map(function (e) {
        return e.eval(context);
      });
      extendList = extendList && extendList.map(function (extend) {
        return extend.eval(context);
      });
      return this.createDerived(elements, extendList, evaldCondition);
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      var i;
      var element;

      if ((!context || !context.firstSelector) && this.elements[0].combinator.value === '') {
        output.add(' ', this.fileInfo(), this.getIndex());
      }

      for (i = 0; i < this.elements.length; i++) {
        element = this.elements[i];
        element.genCSS(context, output);
      }
    }
  }, {
    key: "getIsOutput",
    value: function getIsOutput() {
      return this.evaldCondition;
    }
  }]);

  return Selector;
}(_node["default"]);

Selector.prototype.type = 'Selector';
var _default = Selector;
exports["default"] = _default;