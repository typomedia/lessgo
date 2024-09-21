"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default = function _default(SourceMapOutput, environment) {
  var SourceMapBuilder = /*#__PURE__*/function () {
    function SourceMapBuilder(options) {
      _classCallCheck(this, SourceMapBuilder);

      this.options = options;
    }

    _createClass(SourceMapBuilder, [{
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

    return SourceMapBuilder;
  }();

  return SourceMapBuilder;
};

exports["default"] = _default;