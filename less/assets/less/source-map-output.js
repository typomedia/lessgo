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
var _default = exports["default"] = function _default(environment) {
  var SourceMapOutput = /*#__PURE__*/function () {
    function SourceMapOutput(options) {
      _classCallCheck(this, SourceMapOutput);
      this._css = [];
      this._rootNode = options.rootNode;
      this._contentsMap = options.contentsMap;
      this._contentsIgnoredCharsMap = options.contentsIgnoredCharsMap;
      if (options.sourceMapFilename) {
        this._sourceMapFilename = options.sourceMapFilename.replace(/\\/g, '/');
      }
      this._outputFilename = options.outputFilename;
      this.sourceMapURL = options.sourceMapURL;
      if (options.sourceMapBasepath) {
        this._sourceMapBasepath = options.sourceMapBasepath.replace(/\\/g, '/');
      }
      if (options.sourceMapRootpath) {
        this._sourceMapRootpath = options.sourceMapRootpath.replace(/\\/g, '/');
        if (this._sourceMapRootpath.charAt(this._sourceMapRootpath.length - 1) !== '/') {
          this._sourceMapRootpath += '/';
        }
      } else {
        this._sourceMapRootpath = '';
      }
      this._outputSourceFiles = options.outputSourceFiles;
      this._sourceMapGeneratorConstructor = environment.getSourceMapGenerator();
      this._lineNumber = 0;
      this._column = 0;
    }
    return _createClass(SourceMapOutput, [{
      key: "removeBasepath",
      value: function removeBasepath(path) {
        if (this._sourceMapBasepath && path.indexOf(this._sourceMapBasepath) === 0) {
          path = path.substring(this._sourceMapBasepath.length);
          if (path.charAt(0) === '\\' || path.charAt(0) === '/') {
            path = path.substring(1);
          }
        }
        return path;
      }
    }, {
      key: "normalizeFilename",
      value: function normalizeFilename(filename) {
        filename = filename.replace(/\\/g, '/');
        filename = this.removeBasepath(filename);
        return (this._sourceMapRootpath || '') + filename;
      }
    }, {
      key: "add",
      value: function add(chunk, fileInfo, index, mapLines) {
        // ignore adding empty strings
        if (!chunk) {
          return;
        }
        var lines;
        var sourceLines;
        var columns;
        var sourceColumns;
        var i;
        if (fileInfo && fileInfo.filename) {
          var inputSource = this._contentsMap[fileInfo.filename];

          // remove vars/banner added to the top of the file
          if (this._contentsIgnoredCharsMap[fileInfo.filename]) {
            // adjust the index
            index -= this._contentsIgnoredCharsMap[fileInfo.filename];
            if (index < 0) {
              index = 0;
            }
            // adjust the source
            inputSource = inputSource.slice(this._contentsIgnoredCharsMap[fileInfo.filename]);
          }

          // ignore empty content
          if (inputSource === undefined) {
            return;
          }
          inputSource = inputSource.substring(0, index);
          sourceLines = inputSource.split('\n');
          sourceColumns = sourceLines[sourceLines.length - 1];
        }
        lines = chunk.split('\n');
        columns = lines[lines.length - 1];
        if (fileInfo && fileInfo.filename) {
          if (!mapLines) {
            this._sourceMapGenerator.addMapping({
              generated: {
                line: this._lineNumber + 1,
                column: this._column
              },
              original: {
                line: sourceLines.length,
                column: sourceColumns.length
              },
              source: this.normalizeFilename(fileInfo.filename)
            });
          } else {
            for (i = 0; i < lines.length; i++) {
              this._sourceMapGenerator.addMapping({
                generated: {
                  line: this._lineNumber + i + 1,
                  column: i === 0 ? this._column : 0
                },
                original: {
                  line: sourceLines.length + i,
                  column: i === 0 ? sourceColumns.length : 0
                },
                source: this.normalizeFilename(fileInfo.filename)
              });
            }
          }
        }
        if (lines.length === 1) {
          this._column += columns.length;
        } else {
          this._lineNumber += lines.length - 1;
          this._column = columns.length;
        }
        this._css.push(chunk);
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return this._css.length === 0;
      }
    }, {
      key: "toCSS",
      value: function toCSS(context) {
        this._sourceMapGenerator = new this._sourceMapGeneratorConstructor({
          file: this._outputFilename,
          sourceRoot: null
        });
        if (this._outputSourceFiles) {
          for (var filename in this._contentsMap) {
            if (this._contentsMap.hasOwnProperty(filename)) {
              var source = this._contentsMap[filename];
              if (this._contentsIgnoredCharsMap[filename]) {
                source = source.slice(this._contentsIgnoredCharsMap[filename]);
              }
              this._sourceMapGenerator.setSourceContent(this.normalizeFilename(filename), source);
            }
          }
        }
        this._rootNode.genCSS(context, this);
        if (this._css.length > 0) {
          var sourceMapURL;
          var sourceMapContent = JSON.stringify(this._sourceMapGenerator.toJSON());
          if (this.sourceMapURL) {
            sourceMapURL = this.sourceMapURL;
          } else if (this._sourceMapFilename) {
            sourceMapURL = this._sourceMapFilename;
          }
          this.sourceMapURL = sourceMapURL;
          this.sourceMap = sourceMapContent;
        }
        return this._css.join('');
      }
    }]);
  }();
  return SourceMapOutput;
};