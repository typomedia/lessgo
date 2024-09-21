"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _selector = _interopRequireDefault(require("./selector"));
var _element = _interopRequireDefault(require("./element"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _declaration = _interopRequireDefault(require("./declaration"));
var _detachedRuleset = _interopRequireDefault(require("./detached-ruleset"));
var _expression = _interopRequireDefault(require("./expression"));
var _contexts = _interopRequireDefault(require("../contexts"));
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
var Definition = /*#__PURE__*/function (_Ruleset) {
  function Definition(name, params, rules, condition, variadic, frames, visibilityInfo) {
    var _this;
    _classCallCheck(this, Definition);
    _this = _callSuper(this, Definition);
    _this.name = name || 'anonymous mixin';
    _this.selectors = [new _selector["default"]([new _element["default"](null, name, false, _this._index, _this._fileInfo)])];
    _this.params = params;
    _this.condition = condition;
    _this.variadic = variadic;
    _this.arity = params.length;
    _this.rules = rules;
    _this._lookups = {};
    var optionalParameters = [];
    _this.required = params.reduce(function (count, p) {
      if (!p.name || p.name && !p.value) {
        return count + 1;
      } else {
        optionalParameters.push(p.name);
        return count;
      }
    }, 0);
    _this.optionalParameters = optionalParameters;
    _this.frames = frames;
    _this.copyVisibilityInfo(visibilityInfo);
    _this.allowRoot = true;
    return _this;
  }
  _inherits(Definition, _Ruleset);
  return _createClass(Definition, [{
    key: "accept",
    value: function accept(visitor) {
      if (this.params && this.params.length) {
        this.params = visitor.visitArray(this.params);
      }
      this.rules = visitor.visitArray(this.rules);
      if (this.condition) {
        this.condition = visitor.visit(this.condition);
      }
    }
  }, {
    key: "evalParams",
    value: function evalParams(context, mixinEnv, args, evaldArguments) {
      /* jshint boss:true */
      var frame = new _ruleset["default"](null, null);
      var varargs;
      var arg;
      var params = utils.copyArray(this.params);
      var i;
      var j;
      var val;
      var name;
      var isNamedFound;
      var argIndex;
      var argsLength = 0;
      if (mixinEnv.frames && mixinEnv.frames[0] && mixinEnv.frames[0].functionRegistry) {
        frame.functionRegistry = mixinEnv.frames[0].functionRegistry.inherit();
      }
      mixinEnv = new _contexts["default"].Eval(mixinEnv, [frame].concat(mixinEnv.frames));
      if (args) {
        args = utils.copyArray(args);
        argsLength = args.length;
        for (i = 0; i < argsLength; i++) {
          arg = args[i];
          if (name = arg && arg.name) {
            isNamedFound = false;
            for (j = 0; j < params.length; j++) {
              if (!evaldArguments[j] && name === params[j].name) {
                evaldArguments[j] = arg.value.eval(context);
                frame.prependRule(new _declaration["default"](name, arg.value.eval(context)));
                isNamedFound = true;
                break;
              }
            }
            if (isNamedFound) {
              args.splice(i, 1);
              i--;
              continue;
            } else {
              throw {
                type: 'Runtime',
                message: "Named argument for ".concat(this.name, " ").concat(args[i].name, " not found")
              };
            }
          }
        }
      }
      argIndex = 0;
      for (i = 0; i < params.length; i++) {
        if (evaldArguments[i]) {
          continue;
        }
        arg = args && args[argIndex];
        if (name = params[i].name) {
          if (params[i].variadic) {
            varargs = [];
            for (j = argIndex; j < argsLength; j++) {
              varargs.push(args[j].value.eval(context));
            }
            frame.prependRule(new _declaration["default"](name, new _expression["default"](varargs).eval(context)));
          } else {
            val = arg && arg.value;
            if (val) {
              // This was a mixin call, pass in a detached ruleset of it's eval'd rules
              if (Array.isArray(val)) {
                val = new _detachedRuleset["default"](new _ruleset["default"]('', val));
              } else {
                val = val.eval(context);
              }
            } else if (params[i].value) {
              val = params[i].value.eval(mixinEnv);
              frame.resetCache();
            } else {
              throw {
                type: 'Runtime',
                message: "wrong number of arguments for ".concat(this.name, " (").concat(argsLength, " for ").concat(this.arity, ")")
              };
            }
            frame.prependRule(new _declaration["default"](name, val));
            evaldArguments[i] = val;
          }
        }
        if (params[i].variadic && args) {
          for (j = argIndex; j < argsLength; j++) {
            evaldArguments[j] = args[j].value.eval(context);
          }
        }
        argIndex++;
      }
      return frame;
    }
  }, {
    key: "makeImportant",
    value: function makeImportant() {
      var rules = !this.rules ? this.rules : this.rules.map(function (r) {
        if (r.makeImportant) {
          return r.makeImportant(true);
        } else {
          return r;
        }
      });
      var result = new Definition(this.name, this.params, rules, this.condition, this.variadic, this.frames);
      return result;
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      return new Definition(this.name, this.params, this.rules, this.condition, this.variadic, this.frames || utils.copyArray(context.frames));
    }
  }, {
    key: "evalCall",
    value: function evalCall(context, args, important) {
      var _arguments = [];
      var mixinFrames = this.frames ? this.frames.concat(context.frames) : context.frames;
      var frame = this.evalParams(context, new _contexts["default"].Eval(context, mixinFrames), args, _arguments);
      var rules;
      var ruleset;
      frame.prependRule(new _declaration["default"]('@arguments', new _expression["default"](_arguments).eval(context)));
      rules = utils.copyArray(this.rules);
      ruleset = new _ruleset["default"](null, rules);
      ruleset.originalRuleset = this;
      ruleset = ruleset.eval(new _contexts["default"].Eval(context, [this, frame].concat(mixinFrames)));
      if (important) {
        ruleset = ruleset.makeImportant();
      }
      return ruleset;
    }
  }, {
    key: "matchCondition",
    value: function matchCondition(args, context) {
      if (this.condition && !this.condition.eval(new _contexts["default"].Eval(context, [this.evalParams(context, /* the parameter variables */
      new _contexts["default"].Eval(context, this.frames ? this.frames.concat(context.frames) : context.frames), args, [])].concat(this.frames || []) // the parent namespace/mixin frames
      .concat(context.frames)))) {
        // the current environment frames
        return false;
      }
      return true;
    }
  }, {
    key: "matchArgs",
    value: function matchArgs(args, context) {
      var allArgsCnt = args && args.length || 0;
      var len;
      var optionalParameters = this.optionalParameters;
      var requiredArgsCnt = !args ? 0 : args.reduce(function (count, p) {
        if (optionalParameters.indexOf(p.name) < 0) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);
      if (!this.variadic) {
        if (requiredArgsCnt < this.required) {
          return false;
        }
        if (allArgsCnt > this.params.length) {
          return false;
        }
      } else {
        if (requiredArgsCnt < this.required - 1) {
          return false;
        }
      }

      // check patterns
      len = Math.min(requiredArgsCnt, this.arity);
      for (var i = 0; i < len; i++) {
        if (!this.params[i].name && !this.params[i].variadic) {
          if (args[i].value.eval(context).toCSS() != this.params[i].value.eval(context).toCSS()) {
            return false;
          }
        }
      }
      return true;
    }
  }]);
}(_ruleset["default"]);
Definition.prototype.type = 'MixinDefinition';
Definition.prototype.evalFirst = true;
var _default = exports["default"] = Definition;