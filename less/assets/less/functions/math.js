"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mathHelper = _interopRequireDefault(require("./math-helper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mathFunctions = {
  // name,  unit
  ceil: null,
  floor: null,
  sqrt: null,
  abs: null,
  tan: '',
  sin: '',
  cos: '',
  atan: 'rad',
  asin: 'rad',
  acos: 'rad'
};

for (var f in mathFunctions) {
  if (mathFunctions.hasOwnProperty(f)) {
    mathFunctions[f] = _mathHelper["default"].bind(null, Math[f], mathFunctions[f]);
  }
}

mathFunctions.round = function (n, f) {
  var fraction = typeof f === 'undefined' ? 0 : f.value;
  return (0, _mathHelper["default"])(function (num) {
    return num.toFixed(fraction);
  }, null, n);
};

var _default = mathFunctions;
exports["default"] = _default;