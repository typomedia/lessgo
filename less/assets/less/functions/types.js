"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _keyword = _interopRequireDefault(require("../tree/keyword"));
var _detachedRuleset = _interopRequireDefault(require("../tree/detached-ruleset"));
var _dimension = _interopRequireDefault(require("../tree/dimension"));
var _color = _interopRequireDefault(require("../tree/color"));
var _quoted = _interopRequireDefault(require("../tree/quoted"));
var _anonymous = _interopRequireDefault(require("../tree/anonymous"));
var _url = _interopRequireDefault(require("../tree/url"));
var _operation = _interopRequireDefault(require("../tree/operation"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var isa = function isa(n, Type) {
  return n instanceof Type ? _keyword["default"].True : _keyword["default"].False;
};
var isunit = function isunit(n, unit) {
  if (unit === undefined) {
    throw {
      type: 'Argument',
      message: 'missing the required second argument to isunit.'
    };
  }
  unit = typeof unit.value === 'string' ? unit.value : unit;
  if (typeof unit !== 'string') {
    throw {
      type: 'Argument',
      message: 'Second argument to isunit should be a unit or a string.'
    };
  }
  return n instanceof _dimension["default"] && n.unit.is(unit) ? _keyword["default"].True : _keyword["default"].False;
};
var _default = exports["default"] = {
  isruleset: function isruleset(n) {
    return isa(n, _detachedRuleset["default"]);
  },
  iscolor: function iscolor(n) {
    return isa(n, _color["default"]);
  },
  isnumber: function isnumber(n) {
    return isa(n, _dimension["default"]);
  },
  isstring: function isstring(n) {
    return isa(n, _quoted["default"]);
  },
  iskeyword: function iskeyword(n) {
    return isa(n, _keyword["default"]);
  },
  isurl: function isurl(n) {
    return isa(n, _url["default"]);
  },
  ispixel: function ispixel(n) {
    return isunit(n, 'px');
  },
  ispercentage: function ispercentage(n) {
    return isunit(n, '%');
  },
  isem: function isem(n) {
    return isunit(n, 'em');
  },
  isunit: isunit,
  unit: function unit(val, _unit) {
    if (!(val instanceof _dimension["default"])) {
      throw {
        type: 'Argument',
        message: "the first argument to unit must be a number".concat(val instanceof _operation["default"] ? '. Have you forgotten parenthesis?' : '')
      };
    }
    if (_unit) {
      if (_unit instanceof _keyword["default"]) {
        _unit = _unit.value;
      } else {
        _unit = _unit.toCSS();
      }
    } else {
      _unit = '';
    }
    return new _dimension["default"](val.value, _unit);
  },
  'get-unit': function getUnit(n) {
    return new _anonymous["default"](n.unit);
  }
};