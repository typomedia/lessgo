"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _visitor = _interopRequireDefault(require("./visitor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var JoinSelectorVisitor = /*#__PURE__*/function () {
  function JoinSelectorVisitor() {
    _classCallCheck(this, JoinSelectorVisitor);

    this.contexts = [[]];
    this._visitor = new _visitor["default"](this);
  }

  _createClass(JoinSelectorVisitor, [{
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

  return JoinSelectorVisitor;
}();

var _default = JoinSelectorVisitor;
exports["default"] = _default;