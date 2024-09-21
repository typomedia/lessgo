"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _element = _interopRequireDefault(require("./element"));
var _lessError = _interopRequireDefault(require("../less-error"));
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
var Selector = /*#__PURE__*/function (_Node) {
  function Selector(elements, extendList, condition, index, currentFileInfo, visibilityInfo) {
    var _this;
    _classCallCheck(this, Selector);
    _this = _callSuper(this, Selector);
    _this.extendList = extendList;
    _this.condition = condition;
    _this.evaldCondition = !condition;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.elements = _this.getElements(elements);
    _this.mixinElements_ = undefined;
    _this.copyVisibilityInfo(visibilityInfo);
    _this.setParent(_this.elements, _this);
    return _this;
  }
  _inherits(Selector, _Node);
  return _createClass(Selector, [{
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
}(_node["default"]);
Selector.prototype.type = 'Selector';
var _default = exports["default"] = Selector;