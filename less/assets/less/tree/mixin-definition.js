"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var Definition = /*#__PURE__*/function (_Ruleset) {
  _inherits(Definition, _Ruleset);

  var _super = _createSuper(Definition);

  function Definition(name, params, rules, condition, variadic, frames, visibilityInfo) {
    var _this;

    _classCallCheck(this, Definition);

    _this = _super.call(this);
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

  _createClass(Definition, [{
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
      if (this.condition && !this.condition.eval(new _contexts["default"].Eval(context, [this.evalParams(context,
      /* the parameter variables */
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
      } // check patterns


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

  return Definition;
}(_ruleset["default"]);

Definition.prototype.type = 'MixinDefinition';
Definition.prototype.evalFirst = true;
var _default = Definition;
exports["default"] = _default;