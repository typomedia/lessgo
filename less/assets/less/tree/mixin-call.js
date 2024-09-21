"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _selector = _interopRequireDefault(require("./selector"));

var _mixinDefinition = _interopRequireDefault(require("./mixin-definition"));

var _default2 = _interopRequireDefault(require("../functions/default"));

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

var MixinCall = /*#__PURE__*/function (_Node) {
  _inherits(MixinCall, _Node);

  var _super = _createSuper(MixinCall);

  function MixinCall(elements, args, index, currentFileInfo, important) {
    var _this;

    _classCallCheck(this, MixinCall);

    _this = _super.call(this);
    _this.selector = new _selector["default"](elements);
    _this.arguments = args || [];
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.important = important;
    _this.allowRoot = true;

    _this.setParent(_this.selector, _assertThisInitialized(_this));

    return _this;
  }

  _createClass(MixinCall, [{
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
          isOneFound = true; // To make `default()` function independent of definition order we have two "subpasses" here.
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

  return MixinCall;
}(_node["default"]);

MixinCall.prototype.type = 'MixinCall';
var _default = MixinCall;
exports["default"] = _default;