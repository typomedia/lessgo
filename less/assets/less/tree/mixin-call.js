"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _selector = _interopRequireDefault(require("./selector"));
var _mixinDefinition = _interopRequireDefault(require("./mixin-definition"));
var _default2 = _interopRequireDefault(require("../functions/default"));
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
var MixinCall = /*#__PURE__*/function (_Node) {
  function MixinCall(elements, args, index, currentFileInfo, important) {
    var _this;
    _classCallCheck(this, MixinCall);
    _this = _callSuper(this, MixinCall);
    _this.selector = new _selector["default"](elements);
    _this.arguments = args || [];
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.important = important;
    _this.allowRoot = true;
    _this.setParent(_this.selector, _this);
    return _this;
  }
  _inherits(MixinCall, _Node);
  return _createClass(MixinCall, [{
    key: "accept",
    value: function accept(visitor) {
      if (this.selector) {
        this.selector = visitor.visit(this.selector);
      }
      if (this.arguments.length) {
        this.arguments = visitor.visitArray(this.arguments);
      }
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var mixins;
      var mixin;
      var mixinPath;
      var args = [];
      var arg;
      var argValue;
      var rules = [];
      var match = false;
      var i;
      var m;
      var f;
      var isRecursive;
      var isOneFound;
      var candidates = [];
      var candidate;
      var conditionResult = [];
      var defaultResult;
      var defFalseEitherCase = -1;
      var defNone = 0;
      var defTrue = 1;
      var defFalse = 2;
      var count;
      var originalRuleset;
      var noArgumentsFilter;
      this.selector = this.selector.eval(context);
      function calcDefGroup(mixin, mixinPath) {
        var f;
        var p;
        var namespace;
        for (f = 0; f < 2; f++) {
          conditionResult[f] = true;
          _default2["default"].value(f);
          for (p = 0; p < mixinPath.length && conditionResult[f]; p++) {
            namespace = mixinPath[p];
            if (namespace.matchCondition) {
              conditionResult[f] = conditionResult[f] && namespace.matchCondition(null, context);
            }
          }
          if (mixin.matchCondition) {
            conditionResult[f] = conditionResult[f] && mixin.matchCondition(args, context);
          }
        }
        if (conditionResult[0] || conditionResult[1]) {
          if (conditionResult[0] != conditionResult[1]) {
            return conditionResult[1] ? defTrue : defFalse;
          }
          return defNone;
        }
        return defFalseEitherCase;
      }
      for (i = 0; i < this.arguments.length; i++) {
        arg = this.arguments[i];
        argValue = arg.value.eval(context);
        if (arg.expand && Array.isArray(argValue.value)) {
          argValue = argValue.value;
          for (m = 0; m < argValue.length; m++) {
            args.push({
              value: argValue[m]
            });
          }
        } else {
          args.push({
            name: arg.name,
            value: argValue
          });
        }
      }
      noArgumentsFilter = function noArgumentsFilter(rule) {
        return rule.matchArgs(null, context);
      };
      for (i = 0; i < context.frames.length; i++) {
        if ((mixins = context.frames[i].find(this.selector, null, noArgumentsFilter)).length > 0) {
          isOneFound = true;

          // To make `default()` function independent of definition order we have two "subpasses" here.
          // At first we evaluate each guard *twice* (with `default() == true` and `default() == false`),
          // and build candidate list with corresponding flags. Then, when we know all possible matches,
          // we make a final decision.

          for (m = 0; m < mixins.length; m++) {
            mixin = mixins[m].rule;
            mixinPath = mixins[m].path;
            isRecursive = false;
            for (f = 0; f < context.frames.length; f++) {
              if (!(mixin instanceof _mixinDefinition["default"]) && mixin === (context.frames[f].originalRuleset || context.frames[f])) {
                isRecursive = true;
                break;
              }
            }
            if (isRecursive) {
              continue;
            }
            if (mixin.matchArgs(args, context)) {
              candidate = {
                mixin: mixin,
                group: calcDefGroup(mixin, mixinPath)
              };
              if (candidate.group !== defFalseEitherCase) {
                candidates.push(candidate);
              }
              match = true;
            }
          }
          _default2["default"].reset();
          count = [0, 0, 0];
          for (m = 0; m < candidates.length; m++) {
            count[candidates[m].group]++;
          }
          if (count[defNone] > 0) {
            defaultResult = defFalse;
          } else {
            defaultResult = defTrue;
            if (count[defTrue] + count[defFalse] > 1) {
              throw {
                type: 'Runtime',
                message: "Ambiguous use of `default()` found when matching for `".concat(this.format(args), "`"),
                index: this.getIndex(),
                filename: this.fileInfo().filename
              };
            }
          }
          for (m = 0; m < candidates.length; m++) {
            candidate = candidates[m].group;
            if (candidate === defNone || candidate === defaultResult) {
              try {
                mixin = candidates[m].mixin;
                if (!(mixin instanceof _mixinDefinition["default"])) {
                  originalRuleset = mixin.originalRuleset || mixin;
                  mixin = new _mixinDefinition["default"]('', [], mixin.rules, null, false, null, originalRuleset.visibilityInfo());
                  mixin.originalRuleset = originalRuleset;
                }
                var newRules = mixin.evalCall(context, args, this.important).rules;
                this._setVisibilityToReplacement(newRules);
                Array.prototype.push.apply(rules, newRules);
              } catch (e) {
                throw {
                  message: e.message,
                  index: this.getIndex(),
                  filename: this.fileInfo().filename,
                  stack: e.stack
                };
              }
            }
          }
          if (match) {
            return rules;
          }
        }
      }
      if (isOneFound) {
        throw {
          type: 'Runtime',
          message: "No matching definition was found for `".concat(this.format(args), "`"),
          index: this.getIndex(),
          filename: this.fileInfo().filename
        };
      } else {
        throw {
          type: 'Name',
          message: "".concat(this.selector.toCSS().trim(), " is undefined"),
          index: this.getIndex(),
          filename: this.fileInfo().filename
        };
      }
    }
  }, {
    key: "_setVisibilityToReplacement",
    value: function _setVisibilityToReplacement(replacement) {
      var i;
      var rule;
      if (this.blocksVisibility()) {
        for (i = 0; i < replacement.length; i++) {
          rule = replacement[i];
          rule.addVisibilityBlock();
        }
      }
    }
  }, {
    key: "format",
    value: function format(args) {
      return "".concat(this.selector.toCSS().trim(), "(").concat(args ? args.map(function (a) {
        var argValue = '';
        if (a.name) {
          argValue += "".concat(a.name, ":");
        }
        if (a.value.toCSS) {
          argValue += a.value.toCSS();
        } else {
          argValue += '???';
        }
        return argValue;
      }).join(', ') : '', ")");
    }
  }]);
}(_node["default"]);
MixinCall.prototype.type = 'MixinCall';
var _default = exports["default"] = MixinCall;