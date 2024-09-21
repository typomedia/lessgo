"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SetTreeVisibilityVisitor = /*#__PURE__*/function () {
  function SetTreeVisibilityVisitor(visible) {
    _classCallCheck(this, SetTreeVisibilityVisitor);
    this.visible = visible;
  }
  return _createClass(SetTreeVisibilityVisitor, [{
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
}();
var _default = exports["default"] = SetTreeVisibilityVisitor;