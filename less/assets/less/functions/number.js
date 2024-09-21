"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dimension = _interopRequireDefault(require("../tree/dimension"));

var _anonymous = _interopRequireDefault(require("../tree/anonymous"));

var _mathHelper = _interopRequireDefault(require("./math-helper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var minMax = function minMax(isMin, args) {
  args = Array.prototype.slice.call(args);

  switch (args.length) {
    case 0:
      throw {
        type: 'Argument',
        message: 'one or more arguments required'
      };
  }

  var i; // key is the unit.toString() for unified Dimension values,

  var j;
  var current;
  var currentUnified;
  var referenceUnified;
  var unit;
  var unitStatic;
  var unitClone;
  var // elems only contains original argument values.
  order = [];
  var values = {}; // value is the index into the order array.

  for (i = 0; i < args.length; i++) {
    current = args[i];

    if (!(current instanceof _dimension["default"])) {
      if (Array.isArray(args[i].value)) {
        Array.prototype.push.apply(args, Array.prototype.slice.call(args[i].value));
      }

      continue;
    }

    currentUnified = current.unit.toString() === '' && unitClone !== undefined ? new _dimension["default"](current.value, unitClone).unify() : current.unify();
    unit = currentUnified.unit.toString() === '' && unitStatic !== undefined ? unitStatic : currentUnified.unit.toString();
    unitStatic = unit !== '' && unitStatic === undefined || unit !== '' && order[0].unify().unit.toString() === '' ? unit : unitStatic;
    unitClone = unit !== '' && unitClone === undefined ? current.unit.toString() : unitClone;
    j = values[''] !== undefined && unit !== '' && unit === unitStatic ? values[''] : values[unit];

    if (j === undefined) {
      if (unitStatic !== undefined && unit !== unitStatic) {
        throw {
          type: 'Argument',
          message: 'incompatible types'
        };
      }

      values[unit] = order.length;
      order.push(current);
      continue;
    }

    referenceUnified = order[j].unit.toString() === '' && unitClone !== undefined ? new _dimension["default"](order[j].value, unitClone).unify() : order[j].unify();

    if (isMin && currentUnified.value < referenceUnified.value || !isMin && currentUnified.value > referenceUnified.value) {
      order[j] = current;
    }
  }

  if (order.length == 1) {
    return order[0];
  }

  args = order.map(function (a) {
    return a.toCSS(this.context);
  }).join(this.context.compress ? ',' : ', ');
  return new _anonymous["default"]("".concat(isMin ? 'min' : 'max', "(").concat(args, ")"));
};

var _default = {
  min: function min() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return minMax(true, args);
  },
  max: function max() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return minMax(false, args);
  },
  convert: function convert(val, unit) {
    return val.convertTo(unit.value);
  },
  pi: function pi() {
    return new _dimension["default"](Math.PI);
  },
  mod: function mod(a, b) {
    return new _dimension["default"](a.value % b.value, a.unit);
  },
  pow: function pow(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      x = new _dimension["default"](x);
      y = new _dimension["default"](y);
    } else if (!(x instanceof _dimension["default"]) || !(y instanceof _dimension["default"])) {
      throw {
        type: 'Argument',
        message: 'arguments must be numbers'
      };
    }

    return new _dimension["default"](Math.pow(x.value, y.value), x.unit);
  },
  percentage: function percentage(n) {
    var result = (0, _mathHelper["default"])(function (num) {
      return num * 100;
    }, '%', n);
    return result;
  }
};
exports["default"] = _default;