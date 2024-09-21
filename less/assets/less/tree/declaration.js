"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _value = _interopRequireDefault(require("./value"));
var _keyword = _interopRequireDefault(require("./keyword"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var Constants = _interopRequireWildcard(require("../constants"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
var MATH = Constants.Math;
var Declaration = /*#__PURE__*/function (_Node) {
  function Declaration(name, value, important, merge, index, currentFileInfo, inline, variable) {
    var _this;
    _classCallCheck(this, Declaration);
    _this = _callSuper(this, Declaration);
    _this.name = name;
    _this.value = value instanceof _node["default"] ? value : new _value["default"]([value ? new _anonymous["default"](value) : null]);
    _this.important = important ? " ".concat(important.trim()) : '';
    _this.merge = merge;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.inline = inline || false;
    _this.variable = variable !== undefined ? variable : name.charAt && name.charAt(0) === '@';
    _this.allowRoot = true;
    _this.setParent(_this.value, _this);
    return _this;
  }
  _inherits(Declaration, _Node);
  return _createClass(Declaration, [{
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add(this.name + (context.compress ? ':' : ': '), this.fileInfo(), this.getIndex());
      try {
        this.value.genCSS(context, output);
      } catch (e) {
        e.index = this._index;
        e.filename = this._fileInfo.filename;
        throw e;
      }
      output.add(this.important + (this.inline || context.lastRule && context.compress ? '' : ';'), this._fileInfo, this._index);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var mathBypass = false;
      var prevMath;
      var name = this.name;
      var evaldValue;
      var variable = this.variable;
      if (typeof name !== 'string') {
        // expand 'primitive' name directly to get
        // things faster (~10% for benchmark.less):
        name = name.length === 1 && name[0] instanceof _keyword["default"] ? name[0].value : evalName(context, name);
        variable = false; // never treat expanded interpolation as new variable name
      }

      // @todo remove when parens-division is default
      if (name === 'font' && context.math === MATH.ALWAYS) {
        mathBypass = true;
        prevMath = context.math;
        context.math = MATH.PARENS_DIVISION;
      }
      try {
        context.importantScope.push({});
        evaldValue = this.value.eval(context);
        if (!this.variable && evaldValue.type === 'DetachedRuleset') {
          throw {
            message: 'Rulesets cannot be evaluated on a property.',
            index: this.getIndex(),
            filename: this.fileInfo().filename
          };
        }
        var important = this.important;
        var importantResult = context.importantScope.pop();
        if (!important && importantResult.important) {
          important = importantResult.important;
        }
        return new Declaration(name, evaldValue, important, this.merge, this.getIndex(), this.fileInfo(), this.inline, variable);
      } catch (e) {
        if (typeof e.index !== 'number') {
          e.index = this.getIndex();
          e.filename = this.fileInfo().filename;
        }
        throw e;
      } finally {
        if (mathBypass) {
          context.math = prevMath;
        }
      }
    }
  }, {
    key: "makeImportant",
    value: function makeImportant() {
      return new Declaration(this.name, this.value, '!important', this.merge, this.getIndex(), this.fileInfo(), this.inline);
    }
  }]);
}(_node["default"]);
function evalName(context, name) {
  var value = '';
  var i;
  var n = name.length;
  var output = {
    add: function add(s) {
      value += s;
    }
  };
  for (i = 0; i < n; i++) {
    name[i].eval(context).genCSS(context, output);
  }
  return value;
}
Declaration.prototype.type = 'Declaration';
var _default = exports["default"] = Declaration;