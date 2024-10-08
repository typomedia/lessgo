"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dimension = _interopRequireDefault(require("../tree/dimension"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var MathHelper = function MathHelper(fn, unit, n) {
  if (!(n instanceof _dimension["default"])) {
    throw {
      type: 'Argument',
      message: 'argument must be a number'
    };
  }
  if (unit == null) {
    unit = n.unit;
  } else {
    n = n.unify();
  }
  return new _dimension["default"](fn(parseFloat(n.value)), unit);
};
var _default = exports["default"] = MathHelper;