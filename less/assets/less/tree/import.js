"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _media = _interopRequireDefault(require("./media"));

var _url = _interopRequireDefault(require("./url"));

var _quoted = _interopRequireDefault(require("./quoted"));

var _ruleset = _interopRequireDefault(require("./ruleset"));

var _anonymous = _interopRequireDefault(require("./anonymous"));

var utils = _interopRequireWildcard(require("../utils"));

var _lessError = _interopRequireDefault(require("../less-error"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
var Import = /*#__PURE__*/function (_Node) {
  _inherits(Import, _Node);

  var _super = _createSuper(Import);

  function Import(path, features, options, index, currentFileInfo, visibilityInfo) {
    var _this;

    _classCallCheck(this, Import);

    _this = _super.call(this);
    _this.options = options;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.path = path;
    _this.features = features;
    _this.allowRoot = true;

    if (_this.options.less !== undefined || _this.options.inline) {
      _this.css = !_this.options.less || _this.options.inline;
    } else {
      var pathValue = _this.getPath();

      if (pathValue && /[#\.\&\?]css([\?;].*)?$/.test(pathValue)) {
        _this.css = true;
      }
    }

    _this.copyVisibilityInfo(visibilityInfo);

    _this.setParent(_this.features, _assertThisInitialized(_this));

    _this.setParent(_this.path, _assertThisInitialized(_this));

    return _this;
  }

  _createClass(Import, [{
    key: "accept",
    value: function accept(visitor) {
      if (this.features) {
        this.features = visitor.visit(this.features);
      }

      this.path = visitor.visit(this.path);

      if (!this.options.isPlugin && !this.options.inline && this.root) {
        this.root = visitor.visit(this.root);
      }
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      if (this.css && this.path._fileInfo.reference === undefined) {
        output.add('@import ', this._fileInfo, this._index);
        this.path.genCSS(context, output);

        if (this.features) {
          output.add(' ');
          this.features.genCSS(context, output);
        }

        output.add(';');
      }
    }
  }, {
    key: "getPath",
    value: function getPath() {
      return this.path instanceof _url["default"] ? this.path.value.value : this.path.value;
    }
  }, {
    key: "isVariableImport",
    value: function isVariableImport() {
      var path = this.path;

      if (path instanceof _url["default"]) {
        path = path.value;
      }

      if (path instanceof _quoted["default"]) {
        return path.containsVariables();
      }

      return true;
    }
  }, {
    key: "evalForImport",
    value: function evalForImport(context) {
      var path = this.path;

      if (path instanceof _url["default"]) {
        path = path.value;
      }

      return new Import(path.eval(context), this.features, this.options, this._index, this._fileInfo, this.visibilityInfo());
    }
  }, {
    key: "evalPath",
    value: function evalPath(context) {
      var path = this.path.eval(context);
      var fileInfo = this._fileInfo;

      if (!(path instanceof _url["default"])) {
        // Add the rootpath if the URL requires a rewrite
        var pathValue = path.value;

        if (fileInfo && pathValue && context.pathRequiresRewrite(pathValue)) {
          path.value = context.rewritePath(pathValue, fileInfo.rootpath);
        } else {
          path.value = context.normalizePath(path.value);
        }
      }

      return path;
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var result = this.doEval(context);

      if (this.options.reference || this.blocksVisibility()) {
        if (result.length || result.length === 0) {
          result.forEach(function (node) {
            node.addVisibilityBlock();
          });
        } else {
          result.addVisibilityBlock();
        }
      }

      return result;
    }
  }, {
    key: "doEval",
    value: function doEval(context) {
      var ruleset;
      var registry;
      var features = this.features && this.features.eval(context);

      if (this.options.isPlugin) {
        if (this.root && this.root.eval) {
          try {
            this.root.eval(context);
          } catch (e) {
            e.message = 'Plugin error during evaluation';
            throw new _lessError["default"](e, this.root.imports, this.root.filename);
          }
        }

        registry = context.frames[0] && context.frames[0].functionRegistry;

        if (registry && this.root && this.root.functions) {
          registry.addMultiple(this.root.functions);
        }

        return [];
      }

      if (this.skip) {
        if (typeof this.skip === 'function') {
          this.skip = this.skip();
        }

        if (this.skip) {
          return [];
        }
      }

      if (this.options.inline) {
        var contents = new _anonymous["default"](this.root, 0, {
          filename: this.importedFilename,
          reference: this.path._fileInfo && this.path._fileInfo.reference
        }, true, true);
        return this.features ? new _media["default"]([contents], this.features.value) : [contents];
      } else if (this.css) {
        var newImport = new Import(this.evalPath(context), features, this.options, this._index);

        if (!newImport.css && this.error) {
          throw this.error;
        }

        return newImport;
      } else if (this.root) {
        ruleset = new _ruleset["default"](null, utils.copyArray(this.root.rules));
        ruleset.evalImports(context);
        return this.features ? new _media["default"](ruleset.rules, this.features.value) : ruleset.rules;
      } else {
        return [];
      }
    }
  }]);

  return Import;
}(_node["default"]);

Import.prototype.type = 'Import';
var _default = Import;
exports["default"] = _default;