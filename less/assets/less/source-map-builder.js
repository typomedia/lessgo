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
var _default = exports["default"] = function _default(SourceMapOutput, environment) {
  var SourceMapBuilder = /*#__PURE__*/function () {
    function SourceMapBuilder(options) {
      _classCallCheck(this, SourceMapBuilder);
      this.options = options;
    }
    return _createClass(SourceMapBuilder, [{
      key: "toCSS",
      value: function toCSS(rootNode, options, imports) {
        var sourceMapOutput = new SourceMapOutput({
          contentsIgnoredCharsMap: imports.contentsIgnoredChars,
          rootNode: rootNode,
          contentsMap: imports.contents,
          sourceMapFilename: this.options.sourceMapFilename,
          sourceMapURL: this.options.sourceMapURL,
          outputFilename: this.options.sourceMapOutputFilename,
          sourceMapBasepath: this.options.sourceMapBasepath,
          sourceMapRootpath: this.options.sourceMapRootpath,
          outputSourceFiles: this.options.outputSourceFiles,
          sourceMapGenerator: this.options.sourceMapGenerator,
          sourceMapFileInline: this.options.sourceMapFileInline,
          disableSourcemapAnnotation: this.options.disableSourcemapAnnotation
        });
        var css = sourceMapOutput.toCSS(options);
        this.sourceMap = sourceMapOutput.sourceMap;
        this.sourceMapURL = sourceMapOutput.sourceMapURL;
        if (this.options.sourceMapInputFilename) {
          this.sourceMapInputFilename = sourceMapOutput.normalizeFilename(this.options.sourceMapInputFilename);
        }
        if (this.options.sourceMapBasepath !== undefined && this.sourceMapURL !== undefined) {
          this.sourceMapURL = sourceMapOutput.removeBasepath(this.sourceMapURL);
        }
        return css + this.getCSSAppendage();
      }
    }, {
      key: "getCSSAppendage",
      value: function getCSSAppendage() {
        var sourceMapURL = this.sourceMapURL;
        if (this.options.sourceMapFileInline) {
          if (this.sourceMap === undefined) {
            return '';
          }
          sourceMapURL = "data:application/json;base64,".concat(environment.encodeBase64(this.sourceMap));
        }
        if (this.options.disableSourcemapAnnotation) {
          return '';
        }
        if (sourceMapURL) {
          return "/*# sourceMappingURL=".concat(sourceMapURL, " */");
        }
        return '';
      }
    }, {
      key: "getExternalSourceMap",
      value: function getExternalSourceMap() {
        return this.sourceMap;
      }
    }, {
      key: "setExternalSourceMap",
      value: function setExternalSourceMap(sourceMap) {
        this.sourceMap = sourceMap;
      }
    }, {
      key: "isInline",
      value: function isInline() {
        return this.options.sourceMapFileInline;
      }
    }, {
      key: "getSourceMapURL",
      value: function getSourceMapURL() {
        return this.sourceMapURL;
      }
    }, {
      key: "getOutputFilename",
      value: function getOutputFilename() {
        return this.options.sourceMapOutputFilename;
      }
    }, {
      key: "getInputFilename",
      value: function getInputFilename() {
        return this.sourceMapInputFilename;
      }
    }]);
  }();
  return SourceMapBuilder;
};