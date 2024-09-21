"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _selector = _interopRequireDefault(require("./selector"));
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
var Extend = /*#__PURE__*/function (_Node) {
  function Extend(selector, option, index, currentFileInfo, visibilityInfo) {
    var _this;
    _classCallCheck(this, Extend);
    _this = _callSuper(this, Extend);
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
    _this.setParent(_this.selector, _this);
    return _this;
  }
  _inherits(Extend, _Node);
  return _createClass(Extend, [{
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
    }

    // it concatenates (joins) all selectors in selector array
  }, {
    key: "findSelfSelectors",
    value: function findSelfSelectors(selectors) {
      var selfElements = [];
      var i;
      var selectorElements;
      for (i = 0; i < selectors.length; i++) {
        selectorElements = selectors[i].elements;
        // duplicate the logic in genCSS function inside the selector node.
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
}(_node["default"]);
Extend.next_id = 0;
Extend.prototype.type = 'Extend';
var _default = exports["default"] = Extend;