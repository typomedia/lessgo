"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _anonymous = _interopRequireDefault(require("../tree/anonymous"));

var _keyword = _interopRequireDefault(require("../tree/keyword"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _boolean(condition) {
  return condition ? _keyword["default"].True : _keyword["default"].False;
}
/**
 * Functions with evalArgs set to false are sent context
 * as the first argument.
 */


function If(context, condition, trueValue, falseValue) {
  return condition.eval(context) ? trueValue.eval(context) : falseValue ? falseValue.eval(context) : new _anonymous["default"]();
}

If.evalArgs = false;
var _default = {
  "boolean": _boolean,
  'if': If
};
exports["default"] = _default;