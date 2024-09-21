"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Constants = _interopRequireWildcard(require("./constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var contexts = {};
var _default = contexts;
exports["default"] = _default;

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


var parseCopyProperties = [// options
'paths', // option - unmodified - paths to search for imports on
'rewriteUrls', // option - whether to adjust URL's to be relative
'rootpath', // option - rootpath to append to URL's
'strictImports', // option -
'insecure', // option - whether to allow imports from insecure ssl hosts
'dumpLineNumbers', // option - whether to dump line numbers
'compress', // option - whether to compress
'syncImport', // option - whether to import synchronously
'chunkInput', // option - whether to chunk input. more performant but causes parse issues.
'mime', // browser only - mime type for sheet import
'useFileCache', // browser only - whether to use the per file session cache
// context
'processImports', // option & context - whether to process imports. if false then imports will not be imported.
// Used by the import manager to stop multiple import visitors being created.
'pluginManager' // Used as the plugin manager for the session
];

contexts.Parse = function (options) {
  copyFromOriginal(options, this, parseCopyProperties);

  if (typeof this.paths === 'string') {
    this.paths = [this.paths];
  }
};

var evalCopyProperties = ['paths', // additional include paths
'compress', // whether to compress
'math', // whether math has to be within parenthesis
'strictUnits', // whether units need to evaluate correctly
'sourceMap', // whether to output a source map
'importMultiple', // whether we are currently importing multiple copies
'urlArgs', // whether to add args into url tokens
'javascriptEnabled', // option - whether Inline JavaScript is enabled. if undefined, defaults to false
'pluginManager', // Used as the plugin manager for the session
'importantScope', // used to bubble up !important statements
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

  _createClass(_class, [{
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
      newPath = this.normalizePath(rootpath + path); // If a path was explicit relative and the rootpath was not an absolute path
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

  return _class;
}();