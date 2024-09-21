"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _keyword = _interopRequireDefault(require("../tree/keyword"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaultFunc = {
  eval: function _eval() {
    var v = this.value_;
    var e = this.error_;

    if (e) {
      throw e;
    }

    if (v != null) {
      return v ? _keyword["default"].True : _keyword["default"].False;
    }
  },
  value: function value(v) {
    this.value_ = v;
  },
  error: function error(e) {
    this.error_ = e;
  },
  reset: function reset() {
    this.value_ = this.error_ = null;
  }
};
var _default = defaultFunc;
exports["default"] = _default;