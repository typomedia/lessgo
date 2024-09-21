"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _declaration = _interopRequireDefault(require("./declaration"));
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
var Property = /*#__PURE__*/function (_Node) {
  function Property(name, index, currentFileInfo) {
    var _this;
    _classCallCheck(this, Property);
    _this = _callSuper(this, Property);
    _this.name = name;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    return _this;
  }
  _inherits(Property, _Node);
  return _createClass(Property, [{
    key: "eval",
    value: function _eval(context) {
      var property;
      var name = this.name;
      // TODO: shorten this reference
      var mergeRules = context.pluginManager.less.visitors.ToCSSVisitor.prototype._mergeRules;
      if (this.evaluating) {
        throw {
          type: 'Name',
          message: "Recursive property reference for ".concat(name),
          filename: this.fileInfo().filename,
          index: this.getIndex()
        };
      }
      this.evaluating = true;
      property = this.find(context.frames, function (frame) {
        var v;
        var vArr = frame.property(name);
        if (vArr) {
          for (var i = 0; i < vArr.length; i++) {
            v = vArr[i];
            vArr[i] = new _declaration["default"](v.name, v.value, v.important, v.merge, v.index, v.currentFileInfo, v.inline, v.variable);
          }
          mergeRules(vArr);
          v = vArr[vArr.length - 1];
          if (v.important) {
            var importantScope = context.importantScope[context.importantScope.length - 1];
            importantScope.important = v.important;
          }
          v = v.value.eval(context);
          return v;
        }
      });
      if (property) {
        this.evaluating = false;
        return property;
      } else {
        throw {
          type: 'Name',
          message: "Property '".concat(name, "' is undefined"),
          filename: this.currentFileInfo.filename,
          index: this.index
        };
      }
    }
  }, {
    key: "find",
    value: function find(obj, fun) {
      for (var i = 0, r; i < obj.length; i++) {
        r = fun.call(obj, obj[i]);
        if (r) {
          return r;
        }
      }
      return null;
    }
  }]);
}(_node["default"]);
Property.prototype.type = 'Property';
var _default = exports["default"] = Property;