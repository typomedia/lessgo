"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lessError = _interopRequireDefault(require("./less-error"));

var _transformTree = _interopRequireDefault(require("./transform-tree"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default = function _default(SourceMapBuilder) {
  var ParseTree = /*#__PURE__*/function () {
    function ParseTree(root, imports) {
      _classCallCheck(this, ParseTree);

      this.root = root;
      this.imports = imports;
    }

    _createClass(ParseTree, [{
      key: "toCSS",
      value: function toCSS(options) {
        var evaldRoot;
        var result = {};
        var sourceMapBuilder;

        try {
          evaldRoot = (0, _transformTree["default"])(this.root, options);
        } catch (e) {
          throw new _lessError["default"](e, this.imports);
        }

        try {
          var compress = Boolean(options.compress);

          if (compress) {
            _logger["default"].warn('The compress option has been deprecated. ' + 'We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.');
          }

          var toCSSOptions = {
            compress: compress,
            dumpLineNumbers: options.dumpLineNumbers,
            strictUnits: Boolean(options.strictUnits),
            numPrecision: 8
          };

          if (options.sourceMap) {
            sourceMapBuilder = new SourceMapBuilder(options.sourceMap);
            result.css = sourceMapBuilder.toCSS(evaldRoot, toCSSOptions, this.imports);
          } else {
            result.css = evaldRoot.toCSS(toCSSOptions);
          }
        } catch (e) {
          throw new _lessError["default"](e, this.imports);
        }

        if (options.pluginManager) {
          var postProcessors = options.pluginManager.getPostProcessors();

          for (var i = 0; i < postProcessors.length; i++) {
            result.css = postProcessors[i].process(result.css, {
              sourceMap: sourceMapBuilder,
              options: options,
              imports: this.imports
            });
          }
        }

        if (options.sourceMap) {
          result.map = sourceMapBuilder.getExternalSourceMap();
        }

        var rootFilename = this.imports.rootFilename;
        result.imports = this.imports.files.filter(function (file) {
          return file !== rootFilename;
        });
        return result;
      }
    }]);

    return ParseTree;
  }();

  return ParseTree;
};

exports["default"] = _default;