"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocation = getLocation;
exports.copyArray = copyArray;
exports.clone = clone;
exports.defaults = defaults;
exports.copyOptions = copyOptions;
exports.merge = merge;
exports.flattenArray = flattenArray;

var Constants = _interopRequireWildcard(require("./constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getLocation(index, inputStream) {
  var n = index + 1;
  var line = null;
  var column = -1;

  while (--n >= 0 && inputStream.charAt(n) !== '\n') {
    column++;
  }

  if (typeof index === 'number') {
    line = (inputStream.slice(0, index).match(/\n/g) || '').length;
  }

  return {
    line: line,
    column: column
  };
}

function copyArray(arr) {
  var i;
  var length = arr.length;
  var copy = new Array(length);

  for (i = 0; i < length; i++) {
    copy[i] = arr[i];
  }

  return copy;
}

function clone(obj) {
  var cloned = {};

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      cloned[prop] = obj[prop];
    }
  }

  return cloned;
}

function defaults(obj1, obj2) {
  var newObj = obj2 || {};

  if (!obj2._defaults) {
    newObj = {};

    var _defaults = _objectSpread({}, obj1);

    newObj._defaults = _defaults;
    var cloned = obj2 ? _objectSpread({}, obj2) : {};
    Object.assign(newObj, _defaults, cloned);
  }

  return newObj;
}

function copyOptions(obj1, obj2) {
  if (obj2 && obj2._defaults) {
    return obj2;
  }

  var opts = defaults(obj1, obj2);

  if (opts.strictMath) {
    opts.math = Constants.Math.STRICT_LEGACY;
  } // Back compat with changed relativeUrls option


  if (opts.relativeUrls) {
    opts.rewriteUrls = Constants.RewriteUrls.ALL;
  }

  if (typeof opts.math === 'string') {
    switch (opts.math.toLowerCase()) {
      case 'always':
        opts.math = Constants.Math.ALWAYS;
        break;

      case 'parens-division':
        opts.math = Constants.Math.PARENS_DIVISION;
        break;

      case 'strict':
      case 'parens':
        opts.math = Constants.Math.PARENS;
        break;

      case 'strict-legacy':
        opts.math = Constants.Math.STRICT_LEGACY;
    }
  }

  if (typeof opts.rewriteUrls === 'string') {
    switch (opts.rewriteUrls.toLowerCase()) {
      case 'off':
        opts.rewriteUrls = Constants.RewriteUrls.OFF;
        break;

      case 'local':
        opts.rewriteUrls = Constants.RewriteUrls.LOCAL;
        break;

      case 'all':
        opts.rewriteUrls = Constants.RewriteUrls.ALL;
        break;
    }
  }

  return opts;
}

function merge(obj1, obj2) {
  for (var prop in obj2) {
    if (obj2.hasOwnProperty(prop)) {
      obj1[prop] = obj2[prop];
    }
  }

  return obj1;
}

function flattenArray(arr) {
  var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  for (var i = 0, length = arr.length; i < length; i++) {
    var value = arr[i];

    if (Array.isArray(value)) {
      flattenArray(value, result);
    } else {
      if (value !== undefined) {
        result.push(value);
      }
    }
  }

  return result;
}