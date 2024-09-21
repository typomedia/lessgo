"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SetTreeVisibilityVisitor = /*#__PURE__*/function () {
  function SetTreeVisibilityVisitor(visible) {
    _classCallCheck(this, SetTreeVisibilityVisitor);

    this.visible = visible;
  }

  _createClass(SetTreeVisibilityVisitor, [{
    key: "run",
    value: function run(root) {
      this.visit(root);
    }
  }, {
    key: "visitArray",
    value: function visitArray(nodes) {
      if (!nodes) {
        return nodes;
      }

      var cnt = nodes.length;
      var i;

      for (i = 0; i < cnt; i++) {
        this.visit(nodes[i]);
      }

      return nodes;
    }
  }, {
    key: "visit",
    value: function visit(node) {
      if (!node) {
        return node;
      }

      if (node.constructor === Array) {
        return this.visitArray(node);
      }

      if (!node.blocksVisibility || node.blocksVisibility()) {
        return node;
      }

      if (this.visible) {
        node.ensureVisibility();
      } else {
        node.ensureInvisibility();
      }

      node.accept(this);
      return node;
    }
  }]);

  return SetTreeVisibilityVisitor;
}();

var _default = SetTreeVisibilityVisitor;
exports["default"] = _default;