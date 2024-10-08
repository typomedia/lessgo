"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var anonymousFunc = /(<anonymous>|Function):(\d+):(\d+)/;

/**
 * This is a centralized class of any error that could be thrown internally (mostly by the parser).
 * Besides standard .message it keeps some additional data like a path to the file where the error
 * occurred along with line and column numbers.
 *
 * @class
 * @extends Error
 * @type {module.LessError}
 *
 * @prop {string} type
 * @prop {string} filename
 * @prop {number} index
 * @prop {number} line
 * @prop {number} column
 * @prop {number} callLine
 * @prop {number} callExtract
 * @prop {string[]} extract
 *
 * @param {Object} e              - An error object to wrap around or just a descriptive object
 * @param {Object} fileContentMap - An object with file contents in 'contents' property (like importManager) @todo - move to fileManager?
 * @param {string} [currentFilename]
 */
var LessError = function LessError(e, fileContentMap, currentFilename) {
  Error.call(this);
  var filename = e.filename || currentFilename;
  this.message = e.message;
  this.stack = e.stack;
  if (fileContentMap && filename) {
    var input = fileContentMap.contents[filename];
    var loc = utils.getLocation(e.index, input);
    var line = loc.line;
    var col = loc.column;
    var callLine = e.call && utils.getLocation(e.call, input).line;
    var lines = input ? input.split('\n') : '';
    this.type = e.type || 'Syntax';
    this.filename = filename;
    this.index = e.index;
    this.line = typeof line === 'number' ? line + 1 : null;
    this.column = col;
    if (!this.line && this.stack) {
      var found = this.stack.match(anonymousFunc);

      /**
       * We have to figure out how this environment stringifies anonymous functions
       * so we can correctly map plugin errors.
       * 
       * Note, in Node 8, the output of anonymous funcs varied based on parameters
       * being present or not, so we inject dummy params.
       */
      var func = new Function('a', 'throw new Error()');
      var lineAdjust = 0;
      try {
        func();
      } catch (e) {
        var match = e.stack.match(anonymousFunc);
        var _line = parseInt(match[2]);
        lineAdjust = 1 - _line;
      }
      if (found) {
        if (found[2]) {
          this.line = parseInt(found[2]) + lineAdjust;
        }
        if (found[3]) {
          this.column = parseInt(found[3]);
        }
      }
    }
    this.callLine = callLine + 1;
    this.callExtract = lines[callLine];
    this.extract = [lines[this.line - 2], lines[this.line - 1], lines[this.line]];
  }
};
if (typeof Object.create === 'undefined') {
  var F = function F() {};
  F.prototype = Error.prototype;
  LessError.prototype = new F();
} else {
  LessError.prototype = Object.create(Error.prototype);
}
LessError.prototype.constructor = LessError;

/**
 * An overridden version of the default Object.prototype.toString
 * which uses additional information to create a helpful message.
 *
 * @param {Object} options
 * @returns {string}
 */
LessError.prototype.toString = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var message = '';
  var extract = this.extract || [];
  var error = [];
  var stylize = function stylize(str) {
    return str;
  };
  if (options.stylize) {
    var type = _typeof(options.stylize);
    if (type !== 'function') {
      throw Error("options.stylize should be a function, got a ".concat(type, "!"));
    }
    stylize = options.stylize;
  }
  if (this.line !== null) {
    if (typeof extract[0] === 'string') {
      error.push(stylize("".concat(this.line - 1, " ").concat(extract[0]), 'grey'));
    }
    if (typeof extract[1] === 'string') {
      var errorTxt = "".concat(this.line, " ");
      if (extract[1]) {
        errorTxt += extract[1].slice(0, this.column) + stylize(stylize(stylize(extract[1].substr(this.column, 1), 'bold') + extract[1].slice(this.column + 1), 'red'), 'inverse');
      }
      error.push(errorTxt);
    }
    if (typeof extract[2] === 'string') {
      error.push(stylize("".concat(this.line + 1, " ").concat(extract[2]), 'grey'));
    }
    error = "".concat(error.join('\n') + stylize('', 'reset'), "\n");
  }
  message += stylize("".concat(this.type, "Error: ").concat(this.message), 'red');
  if (this.filename) {
    message += stylize(' in ', 'red') + this.filename;
  }
  if (this.line) {
    message += stylize(" on line ".concat(this.line, ", column ").concat(this.column + 1, ":"), 'grey');
  }
  message += "\n".concat(error);
  if (this.callLine) {
    message += "".concat(stylize('from ', 'red') + (this.filename || ''), "/n");
    message += "".concat(stylize(this.callLine, 'grey'), " ").concat(this.callExtract, "/n");
  }
  return message;
};
var _default = exports["default"] = LessError;