"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _visitor = _interopRequireDefault(require("./visitor"));

var _importVisitor = _interopRequireDefault(require("./import-visitor"));

var _setTreeVisibilityVisitor = _interopRequireDefault(require("./set-tree-visibility-visitor"));

var _extendVisitor = _interopRequireDefault(require("./extend-visitor"));

var _joinSelectorVisitor = _interopRequireDefault(require("./join-selector-visitor"));

var _toCssVisitor = _interopRequireDefault(require("./to-css-visitor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  Visitor: _visitor["default"],
  ImportVisitor: _importVisitor["default"],
  MarkVisibleSelectorsVisitor: _setTreeVisibilityVisitor["default"],
  ExtendVisitor: _extendVisitor["default"],
  JoinSelectorVisitor: _joinSelectorVisitor["default"],
  ToCSSVisitor: _toCssVisitor["default"]
};
exports["default"] = _default;