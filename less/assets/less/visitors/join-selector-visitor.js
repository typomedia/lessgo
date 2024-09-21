"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _visitor = _interopRequireDefault(require("./visitor"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var JoinSelectorVisitor = /*#__PURE__*/function () {
  function JoinSelectorVisitor() {
    _classCallCheck(this, JoinSelectorVisitor);
    this.contexts = [[]];
    this._visitor = new _visitor["default"](this);
  }
  return _createClass(JoinSelectorVisitor, [{
    key: "run",
    value: function run(root) {
      return this._visitor.visit(root);
    }
  }, {
    key: "visitDeclaration",
    value: function visitDeclaration(declNode, visitArgs) {
      visitArgs.visitDeeper = false;
    }
  }, {
    key: "visitMixinDefinition",
    value: function visitMixinDefinition(mixinDefinitionNode, visitArgs) {
      visitArgs.visitDeeper = false;
    }
  }, {
    key: "visitRuleset",
    value: function visitRuleset(rulesetNode, visitArgs) {
      var context = this.contexts[this.contexts.length - 1];
      var paths = [];
      var selectors;
      this.contexts.push(paths);
      if (!rulesetNode.root) {
        selectors = rulesetNode.selectors;
        if (selectors) {
          selectors = selectors.filter(function (selector) {
            return selector.getIsOutput();
          });
          rulesetNode.selectors = selectors.length ? selectors : selectors = null;
          if (selectors) {
            rulesetNode.joinSelectors(paths, context, selectors);
          }
        }
        if (!selectors) {
          rulesetNode.rules = null;
        }
        rulesetNode.paths = paths;
      }
    }
  }, {
    key: "visitRulesetOut",
    value: function visitRulesetOut(rulesetNode) {
      this.contexts.length = this.contexts.length - 1;
    }
  }, {
    key: "visitMedia",
    value: function visitMedia(mediaNode, visitArgs) {
      var context = this.contexts[this.contexts.length - 1];
      mediaNode.rules[0].root = context.length === 0 || context[0].multiMedia;
    }
  }, {
    key: "visitAtRule",
    value: function visitAtRule(atRuleNode, visitArgs) {
      var context = this.contexts[this.contexts.length - 1];
      if (atRuleNode.rules && atRuleNode.rules.length) {
        atRuleNode.rules[0].root = atRuleNode.isRooted || context.length === 0 || null;
      }
    }
  }]);
}();
var _default = exports["default"] = JoinSelectorVisitor;