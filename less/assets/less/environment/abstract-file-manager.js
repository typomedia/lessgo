"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AbstractFileManager = /*#__PURE__*/function () {
  function AbstractFileManager() {
    _classCallCheck(this, AbstractFileManager);
  }
  return _createClass(AbstractFileManager, [{
    key: "getPath",
    value: function getPath(filename) {
      var j = filename.lastIndexOf('?');
      if (j > 0) {
        filename = filename.slice(0, j);
      }
      j = filename.lastIndexOf('/');
      if (j < 0) {
        j = filename.lastIndexOf('\\');
      }
      if (j < 0) {
        return '';
      }
      return filename.slice(0, j + 1);
    }
  }, {
    key: "tryAppendExtension",
    value: function tryAppendExtension(path, ext) {
      return /(\.[a-z]*$)|([\?;].*)$/.test(path) ? path : path + ext;
    }
  }, {
    key: "tryAppendLessExtension",
    value: function tryAppendLessExtension(path) {
      return this.tryAppendExtension(path, '.less');
    }
  }, {
    key: "supportsSync",
    value: function supportsSync() {
      return false;
    }
  }, {
    key: "alwaysMakePathsAbsolute",
    value: function alwaysMakePathsAbsolute() {
      return false;
    }
  }, {
    key: "isPathAbsolute",
    value: function isPathAbsolute(filename) {
      return /^(?:[a-z-]+:|\/|\\|#)/i.test(filename);
    }
    // TODO: pull out / replace?
  }, {
    key: "join",
    value: function join(basePath, laterPath) {
      if (!basePath) {
        return laterPath;
      }
      return basePath + laterPath;
    }
  }, {
    key: "pathDiff",
    value: function pathDiff(url, baseUrl) {
      // diff between two paths to create a relative path
      var urlParts = this.extractUrlParts(url);
      var baseUrlParts = this.extractUrlParts(baseUrl);
      var i;
      var max;
      var urlDirectories;
      var baseUrlDirectories;
      var diff = '';
      if (urlParts.hostPart !== baseUrlParts.hostPart) {
        return '';
      }
      max = Math.max(baseUrlParts.directories.length, urlParts.directories.length);
      for (i = 0; i < max; i++) {
        if (baseUrlParts.directories[i] !== urlParts.directories[i]) {
          break;
        }
      }
      baseUrlDirectories = baseUrlParts.directories.slice(i);
      urlDirectories = urlParts.directories.slice(i);
      for (i = 0; i < baseUrlDirectories.length - 1; i++) {
        diff += '../';
      }
      for (i = 0; i < urlDirectories.length - 1; i++) {
        diff += "".concat(urlDirectories[i], "/");
      }
      return diff;
    }
  }, {
    key: "extractUrlParts",
    value:
    // helper function, not part of API
    function extractUrlParts(url, baseUrl) {
      // urlParts[1] = protocol://hostname/ OR /
      // urlParts[2] = / if path relative to host base
      // urlParts[3] = directories
      // urlParts[4] = filename
      // urlParts[5] = parameters

      var urlPartsRegex = /^((?:[a-z-]+:)?\/{2}(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i;
      var urlParts = url.match(urlPartsRegex);
      var returner = {};
      var rawDirectories = [];
      var directories = [];
      var i;
      var baseUrlParts;
      if (!urlParts) {
        throw new Error("Could not parse sheet href - '".concat(url, "'"));
      }

      // Stylesheets in IE don't always return the full path
      if (baseUrl && (!urlParts[1] || urlParts[2])) {
        baseUrlParts = baseUrl.match(urlPartsRegex);
        if (!baseUrlParts) {
          throw new Error("Could not parse page url - '".concat(baseUrl, "'"));
        }
        urlParts[1] = urlParts[1] || baseUrlParts[1] || '';
        if (!urlParts[2]) {
          urlParts[3] = baseUrlParts[3] + urlParts[3];
        }
      }
      if (urlParts[3]) {
        rawDirectories = urlParts[3].replace(/\\/g, '/').split('/');

        // collapse '..' and skip '.'
        for (i = 0; i < rawDirectories.length; i++) {
          if (rawDirectories[i] === '..') {
            directories.pop();
          } else if (rawDirectories[i] !== '.') {
            directories.push(rawDirectories[i]);
          }
        }
      }
      returner.hostPart = urlParts[1];
      returner.directories = directories;
      returner.rawPath = (urlParts[1] || '') + rawDirectories.join('/');
      returner.path = (urlParts[1] || '') + directories.join('/');
      returner.filename = urlParts[4];
      returner.fileUrl = returner.path + (urlParts[4] || '');
      returner.url = returner.fileUrl + (urlParts[5] || '');
      return returner;
    }
  }]);
}();
var _default = exports["default"] = AbstractFileManager;