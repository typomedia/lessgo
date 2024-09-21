"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _selector = _interopRequireDefault(require("./selector"));

var _ruleset = _interopRequireDefault(require("./ruleset"));

var _anonymous = _interopRequireDefault(require("./anonymous"));

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

var AtRule = /*#__PURE__*/function (_Node) {
  _inherits(AtRule, _Node);

  var _super = _createSuper(AtRule);

  function AtRule(name, value, rules, index, currentFileInfo, debugInfo, isRooted, visibilityInfo) {
    var _this;

    _classCallCheck(this, AtRule);

    _this = _super.call(this);
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

      _this.setParent(_this.rules, _assertThisInitialized(_this));
    }

    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.debugInfo = debugInfo;
    _this.isRooted = isRooted || false;

    _this.copyVisibilityInfo(visibilityInfo);

    _this.allowRoot = true;
    return _this;
  }

  _createClass(AtRule, [{
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
      var rules = this.rules; // media stored inside other atrule should not bubble over it
      // backpup media bubbling information

      mediaPathBackup = context.mediaPath;
      mediaBlocksBackup = context.mediaBlocks; // deleted media bubbling information

      context.mediaPath = [];
      context.mediaBlocks = [];

      if (value) {
        value = value.eval(context);
      }

      if (rules) {
        // assuming that there is only one rule at this point - that is how parser constructs the rule
        rules = [rules[0].eval(context)];
        rules[0].root = true;
      } // restore media bubbling information


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
      context.tabLevel = (context.tabLevel | 0) + 1; // Compressed

      if (context.compress) {
        output.add('{');

        for (i = 0; i < ruleCnt; i++) {
          rules[i].genCSS(context, output);
        }

        output.add('}');
        context.tabLevel--;
        return;
      } // Non-compressed


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

  return AtRule;
}(_node["default"]);

AtRule.prototype.type = 'AtRule';
var _default = AtRule;
exports["default"] = _default;