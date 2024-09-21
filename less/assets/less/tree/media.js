"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _value = _interopRequireDefault(require("./value"));
var _selector = _interopRequireDefault(require("./selector"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var _expression = _interopRequireDefault(require("./expression"));
var _atrule = _interopRequireDefault(require("./atrule"));
var utils = _interopRequireWildcard(require("../utils"));
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
var Media = /*#__PURE__*/function (_AtRule) {
  function Media(value, features, index, currentFileInfo, visibilityInfo) {
    var _this;
    _classCallCheck(this, Media);
    _this = _callSuper(this, Media);
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    var selectors = new _selector["default"]([], null, null, _this._index, _this._fileInfo).createEmptySelectors();
    _this.features = new _value["default"](features);
    _this.rules = [new _ruleset["default"](selectors, value)];
    _this.rules[0].allowImports = true;
    _this.copyVisibilityInfo(visibilityInfo);
    _this.allowRoot = true;
    _this.setParent(selectors, _this);
    _this.setParent(_this.features, _this);
    _this.setParent(_this.rules, _this);
    return _this;
  }
  _inherits(Media, _AtRule);
  return _createClass(Media, [{
    key: "isRulesetLike",
    value: function isRulesetLike() {
      return true;
    }
  }, {
    key: "accept",
    value: function accept(visitor) {
      if (this.features) {
        this.features = visitor.visit(this.features);
      }
      if (this.rules) {
        this.rules = visitor.visitArray(this.rules);
      }
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add('@media ', this._fileInfo, this._index);
      this.features.genCSS(context, output);
      this.outputRuleset(context, output, this.rules);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      if (!context.mediaBlocks) {
        context.mediaBlocks = [];
        context.mediaPath = [];
      }
      var media = new Media(null, [], this._index, this._fileInfo, this.visibilityInfo());
      if (this.debugInfo) {
        this.rules[0].debugInfo = this.debugInfo;
        media.debugInfo = this.debugInfo;
      }
      media.features = this.features.eval(context);
      context.mediaPath.push(media);
      context.mediaBlocks.push(media);
      this.rules[0].functionRegistry = context.frames[0].functionRegistry.inherit();
      context.frames.unshift(this.rules[0]);
      media.rules = [this.rules[0].eval(context)];
      context.frames.shift();
      context.mediaPath.pop();
      return context.mediaPath.length === 0 ? media.evalTop(context) : media.evalNested(context);
    }
  }, {
    key: "evalTop",
    value: function evalTop(context) {
      var result = this;

      // Render all dependent Media blocks.
      if (context.mediaBlocks.length > 1) {
        var selectors = new _selector["default"]([], null, null, this.getIndex(), this.fileInfo()).createEmptySelectors();
        result = new _ruleset["default"](selectors, context.mediaBlocks);
        result.multiMedia = true;
        result.copyVisibilityInfo(this.visibilityInfo());
        this.setParent(result, this);
      }
      delete context.mediaBlocks;
      delete context.mediaPath;
      return result;
    }
  }, {
    key: "evalNested",
    value: function evalNested(context) {
      var i;
      var value;
      var path = context.mediaPath.concat([this]);

      // Extract the media-query conditions separated with `,` (OR).
      for (i = 0; i < path.length; i++) {
        value = path[i].features instanceof _value["default"] ? path[i].features.value : path[i].features;
        path[i] = Array.isArray(value) ? value : [value];
      }

      // Trace all permutations to generate the resulting media-query.
      //
      // (a, b and c) with nested (d, e) ->
      //    a and d
      //    a and e
      //    b and c and d
      //    b and c and e
      this.features = new _value["default"](this.permute(path).map(function (path) {
        path = path.map(function (fragment) {
          return fragment.toCSS ? fragment : new _anonymous["default"](fragment);
        });
        for (i = path.length - 1; i > 0; i--) {
          path.splice(i, 0, new _anonymous["default"]('and'));
        }
        return new _expression["default"](path);
      }));
      this.setParent(this.features, this);

      // Fake a tree-node that doesn't output anything.
      return new _ruleset["default"]([], []);
    }
  }, {
    key: "permute",
    value: function permute(arr) {
      if (arr.length === 0) {
        return [];
      } else if (arr.length === 1) {
        return arr[0];
      } else {
        var result = [];
        var rest = this.permute(arr.slice(1));
        for (var i = 0; i < rest.length; i++) {
          for (var j = 0; j < arr[0].length; j++) {
            result.push([arr[0][j]].concat(rest[i]));
          }
        }
        return result;
      }
    }
  }, {
    key: "bubbleSelectors",
    value: function bubbleSelectors(selectors) {
      if (!selectors) {
        return;
      }
      this.rules = [new _ruleset["default"](utils.copyArray(selectors), [this.rules[0]])];
      this.setParent(this.rules, this);
    }
  }]);
}(_atrule["default"]);
Media.prototype.type = 'Media';
var _default = exports["default"] = Media;