"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _quoted = _interopRequireDefault(require("../tree/quoted"));

var _anonymous = _interopRequireDefault(require("../tree/anonymous"));

var _javascript = _interopRequireDefault(require("../tree/javascript"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  e: function e(str) {
    return new _quoted["default"]('"', str instanceof _javascript["default"] ? str.evaluated : str.value, true);
  },
  escape: function escape(str) {
    return new _anonymous["default"](encodeURI(str.value).replace(/=/g, '%3D').replace(/:/g, '%3A').replace(/#/g, '%23').replace(/;/g, '%3B').replace(/\(/g, '%28').replace(/\)/g, '%29'));
  },
  replace: function replace(string, pattern, replacement, flags) {
    var result = string.value;
    replacement = replacement.type === 'Quoted' ? replacement.value : replacement.toCSS();
    result = result.replace(new RegExp(pattern.value, flags ? flags.value : ''), replacement);
    return new _quoted["default"](string.quote || '', result, string.escaped);
  },
  '%': function _(string
  /* arg, arg, ... */
  ) {
    var args = Array.prototype.slice.call(arguments, 1);
    var result = string.value;

    var _loop = function _loop(i) {
      /* jshint loopfunc:true */
      result = result.replace(/%[sda]/i, function (token) {
        var value = args[i].type === 'Quoted' && token.match(/s/i) ? args[i].value : args[i].toCSS();
        return token.match(/[A-Z]$/) ? encodeURIComponent(value) : value;
      });
    };

    for (var i = 0; i < args.length; i++) {
      _loop(i);
    }

    result = result.replace(/%%/g, '%');
    return new _quoted["default"](string.quote || '', result, string.escaped);
  }
};
exports["default"] = _default;