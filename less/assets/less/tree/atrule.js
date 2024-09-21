"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _selector = _interopRequireDefault(require("./selector"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
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
var AtRule = /*#__PURE__*/function (_Node) {
  function AtRule(name, value, rules, index, currentFileInfo, debugInfo, isRooted, visibilityInfo) {
    var _this;
    _classCallCheck(this, AtRule);
    _this = _callSuper(this, AtRule);
    var i;
    _this.name = name;
    _this.value = value instanceof _node["default"] ? value : value ? new _anonymous["default"](value) : value;
    if (rules) {
      if (Array.isArray(rules)) {
        _this.rules = rules;
      } else {
        _this.rules = [rules];
        _this.rules[0].selectors = new _selector["default"]([], null, null, index, currentFileInfo).createEmptySelectors();
      }
      for (i = 0; i < _this.rules.length; i++) {
        _this.rules[i].allowImports = true;
      }
      _this.setParent(_this.rules, _this);
    }
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.debugInfo = debugInfo;
    _this.isRooted = isRooted || false;
    _this.copyVisibilityInfo(visibilityInfo);
    _this.allowRoot = true;
    return _this;
  }
  _inherits(AtRule, _Node);
  return _createClass(AtRule, [{
    key: "accept",
    value: function accept(visitor) {
      var value = this.value;
      var rules = this.rules;
      if (rules) {
        this.rules = visitor.visitArray(rules);
      }
      if (value) {
        this.value = visitor.visit(value);
      }
    }
  }, {
    key: "isRulesetLike",
    value: function isRulesetLike() {
      return this.rules || !this.isCharset();
    }
  }, {
    key: "isCharset",
    value: function isCharset() {
      return '@charset' === this.name;
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      var value = this.value;
      var rules = this.rules;
      output.add(this.name, this.fileInfo(), this.getIndex());
      if (value) {
        output.add(' ');
        value.genCSS(context, output);
      }
      if (rules) {
        this.outputRuleset(context, output, rules);
      } else {
        output.add(';');
      }
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var mediaPathBackup;
      var mediaBlocksBackup;
      var value = this.value;
      var rules = this.rules;

      // media stored inside other atrule should not bubble over it
      // backpup media bubbling information
      mediaPathBackup = context.mediaPath;
      mediaBlocksBackup = context.mediaBlocks;
      // deleted media bubbling information
      context.mediaPath = [];
      context.mediaBlocks = [];
      if (value) {
        value = value.eval(context);
      }
      if (rules) {
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        rules = [rules[0].eval(context)];
        rules[0].root = true;
      }
      // restore media bubbling information
      context.mediaPath = mediaPathBackup;
      context.mediaBlocks = mediaBlocksBackup;
      return new AtRule(this.name, value, rules, this.getIndex(), this.fileInfo(), this.debugInfo, this.isRooted, this.visibilityInfo());
    }
  }, {
    key: "variable",
    value: function variable(name) {
      if (this.rules) {
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        return _ruleset["default"].prototype.variable.call(this.rules[0], name);
      }
    }
  }, {
    key: "find",
    value: function find() {
      if (this.rules) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        return _ruleset["default"].prototype.find.apply(this.rules[0], args);
      }
    }
  }, {
    key: "rulesets",
    value: function rulesets() {
      if (this.rules) {
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        return _ruleset["default"].prototype.rulesets.apply(this.rules[0]);
      }
    }
  }, {
    key: "outputRuleset",
    value: function outputRuleset(context, output, rules) {
      var ruleCnt = rules.length;
      var i;
      context.tabLevel = (context.tabLevel | 0) + 1;

      // Compressed
      if (context.compress) {
        output.add('{');
        for (i = 0; i < ruleCnt; i++) {
          rules[i].genCSS(context, output);
        }
        output.add('}');
        context.tabLevel--;
        return;
      }

      // Non-compressed
      var tabSetStr = "\n".concat(Array(context.tabLevel).join('  '));
      var tabRuleStr = "".concat(tabSetStr, "  ");
      if (!ruleCnt) {
        output.add(" {".concat(tabSetStr, "}"));
      } else {
        output.add(" {".concat(tabRuleStr));
        rules[0].genCSS(context, output);
        for (i = 1; i < ruleCnt; i++) {
          output.add(tabRuleStr);
          rules[i].genCSS(context, output);
        }
        output.add("".concat(tabSetStr, "}"));
      }
      context.tabLevel--;
    }
  }]);
}(_node["default"]);
AtRule.prototype.type = 'AtRule';
var _default = exports["default"] = AtRule;