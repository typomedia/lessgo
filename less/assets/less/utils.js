"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.copyArray = copyArray;
exports.copyOptions = copyOptions;
exports.defaults = defaults;
exports.flattenArray = flattenArray;
exports.getLocation = getLocation;
exports.merge = merge;
var Constants = _interopRequireWildcard(require("./constants"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* jshint proto: true */
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
  }
  // Back compat with changed relativeUrls option
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