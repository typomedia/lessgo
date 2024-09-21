"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _expression = _interopRequireDefault(require("../tree/expression"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var functionCaller = /*#__PURE__*/function () {
  function functionCaller(name, context, index, currentFileInfo) {
    _classCallCheck(this, functionCaller);
    this.name = name.toLowerCase();
    this.index = index;
    this.context = context;
    this.currentFileInfo = currentFileInfo;
    this.func = context.frames[0].functionRegistry.get(this.name);
  }
  return _createClass(functionCaller, [{
    key: "isValid",
    value: function isValid() {
      return Boolean(this.func);
    }
  }, {
    key: "call",
    value: function call(args) {
      var _this = this;
      var evalArgs = this.func.evalArgs;
      if (evalArgs !== false) {
        args = args.map(function (a) {
          return a.eval(_this.context);
        });
      }
      // This code is terrible and should be replaced as per this issue...
      // https://github.com/less/less.js/issues/2477
      if (Array.isArray(args)) {
        args = args.filter(function (item) {
          if (item.type === 'Comment') {
            return false;
          }
          return true;
        }).map(function (item) {
          if (item.type === 'Expression') {
            var subNodes = item.value.filter(function (item) {
              if (item.type === 'Comment') {
                return false;
              }
              return true;
            });
            if (subNodes.length === 1) {
              return subNodes[0];
            } else {
              return new _expression["default"](subNodes);
            }
          }
          return item;
        });
      }
      if (evalArgs === false) {
        return this.func.apply(this, [this.context].concat(_toConsumableArray(args)));
      }
      return this.func.apply(this, _toConsumableArray(args));
    }
  }]);
}();
var _default = exports["default"] = functionCaller;