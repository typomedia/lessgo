"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Constants = _interopRequireWildcard(require("./constants"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var contexts = {};
var _default = exports["default"] = contexts;
var copyFromOriginal = function copyFromOriginal(original, destination, propertiesToCopy) {
  if (!original) {
    return;
  }
  for (var i = 0; i < propertiesToCopy.length; i++) {
    if (original.hasOwnProperty(propertiesToCopy[i])) {
      destination[propertiesToCopy[i]] = original[propertiesToCopy[i]];
    }
  }
};

/*
 parse is used whilst parsing
 */
var parseCopyProperties = [
// options
'paths',
// option - unmodified - paths to search for imports on
'rewriteUrls',
// option - whether to adjust URL's to be relative
'rootpath',
// option - rootpath to append to URL's
'strictImports',
// option -
'insecure',
// option - whether to allow imports from insecure ssl hosts
'dumpLineNumbers',
// option - whether to dump line numbers
'compress',
// option - whether to compress
'syncImport',
// option - whether to import synchronously
'chunkInput',
// option - whether to chunk input. more performant but causes parse issues.
'mime',
// browser only - mime type for sheet import
'useFileCache',
// browser only - whether to use the per file session cache
// context
'processImports',
// option & context - whether to process imports. if false then imports will not be imported.
// Used by the import manager to stop multiple import visitors being created.
'pluginManager' // Used as the plugin manager for the session
];
contexts.Parse = function (options) {
  copyFromOriginal(options, this, parseCopyProperties);
  if (typeof this.paths === 'string') {
    this.paths = [this.paths];
  }
};
var evalCopyProperties = ['paths',
// additional include paths
'compress',
// whether to compress
'math',
// whether math has to be within parenthesis
'strictUnits',
// whether units need to evaluate correctly
'sourceMap',
// whether to output a source map
'importMultiple',
// whether we are currently importing multiple copies
'urlArgs',
// whether to add args into url tokens
'javascriptEnabled',
// option - whether Inline JavaScript is enabled. if undefined, defaults to false
'pluginManager',
// Used as the plugin manager for the session
'importantScope',
// used to bubble up !important statements
'rewriteUrls' // option - whether to adjust URL's to be relative
];
function isPathRelative(path) {
  return !/^(?:[a-z-]+:|\/|#)/i.test(path);
}
function isPathLocalRelative(path) {
  return path.charAt(0) === '.';
}
contexts.Eval = /*#__PURE__*/function () {
  function _class(options, frames) {
    _classCallCheck(this, _class);
    copyFromOriginal(options, this, evalCopyProperties);
    if (typeof this.paths === 'string') {
      this.paths = [this.paths];
    }
    this.frames = frames || [];
    this.importantScope = this.importantScope || [];
    this.inCalc = false;
    this.mathOn = true;
  }
  return _createClass(_class, [{
    key: "enterCalc",
    value: function enterCalc() {
      if (!this.calcStack) {
        this.calcStack = [];
      }
      this.calcStack.push(true);
      this.inCalc = true;
    }
  }, {
    key: "exitCalc",
    value: function exitCalc() {
      this.calcStack.pop();
      if (!this.calcStack.length) {
        this.inCalc = false;
      }
    }
  }, {
    key: "inParenthesis",
    value: function inParenthesis() {
      if (!this.parensStack) {
        this.parensStack = [];
      }
      this.parensStack.push(true);
    }
  }, {
    key: "outOfParenthesis",
    value: function outOfParenthesis() {
      this.parensStack.pop();
    }
  }, {
    key: "isMathOn",
    value: function isMathOn(op) {
      if (!this.mathOn) {
        return false;
      }
      if (op === '/' && this.math !== Constants.Math.ALWAYS && (!this.parensStack || !this.parensStack.length)) {
        return false;
      }
      if (this.math > Constants.Math.PARENS_DIVISION) {
        return this.parensStack && this.parensStack.length;
      }
      return true;
    }
  }, {
    key: "pathRequiresRewrite",
    value: function pathRequiresRewrite(path) {
      var isRelative = this.rewriteUrls === Constants.RewriteUrls.LOCAL ? isPathLocalRelative : isPathRelative;
      return isRelative(path);
    }
  }, {
    key: "rewritePath",
    value: function rewritePath(path, rootpath) {
      var newPath;
      rootpath = rootpath || '';
      newPath = this.normalizePath(rootpath + path);

      // If a path was explicit relative and the rootpath was not an absolute path
      // we must ensure that the new path is also explicit relative.
      if (isPathLocalRelative(path) && isPathRelative(rootpath) && isPathLocalRelative(newPath) === false) {
        newPath = "./".concat(newPath);
      }
      return newPath;
    }
  }, {
    key: "normalizePath",
    value: function normalizePath(path) {
      var segments = path.split('/').reverse();
      var segment;
      path = [];
      while (segments.length !== 0) {
        segment = segments.pop();
        switch (segment) {
          case '.':
            break;
          case '..':
            if (path.length === 0 || path[path.length - 1] === '..') {
              path.push(segment);
            } else {
              path.pop();
            }
            break;
          default:
            path.push(segment);
            break;
        }
      }
      return path.join('/');
    }
  }]);
}();