"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ruleset = _interopRequireDefault(require("./ruleset"));

var _value = _interopRequireDefault(require("./value"));

var _selector = _interopRequireDefault(require("./selector"));

var _anonymous = _interopRequireDefault(require("./anonymous"));

var _expression = _interopRequireDefault(require("./expression"));

var _atrule = _interopRequireDefault(require("./atrule"));

var utils = _interopRequireWildcard(require("../utils"));

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

var Media = /*#__PURE__*/function (_AtRule) {
  _inherits(Media, _AtRule);

  var _super = _createSuper(Media);

  function Media(value, features, index, currentFileInfo, visibilityInfo) {
    var _this;

    _classCallCheck(this, Media);

    _this = _super.call(this);
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    var selectors = new _selector["default"]([], null, null, _this._index, _this._fileInfo).createEmptySelectors();
    _this.features = new _value["default"](features);
    _this.rules = [new _ruleset["default"](selectors, value)];
    _this.rules[0].allowImports = true;

    _this.copyVisibilityInfo(visibilityInfo);

    _this.allowRoot = true;

    _this.setParent(selectors, _assertThisInitialized(_this));

    _this.setParent(_this.features, _assertThisInitialized(_this));

    _this.setParent(_this.rules, _assertThisInitialized(_this));

    return _this;
  }

  _createClass(Media, [{
    key: "isRulesetLike",
    value: function isRulesetLike() {
      return true;
    }
  }, {
    key: "accept",
    value: function accept(visitor) {
      if (this.features) {
        this.features = visitor.visit(this.features);
      }

      if (this.rules) {
        this.rules = visitor.visitArray(this.rules);
      }
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add('@media ', this._fileInfo, this._index);
      this.features.genCSS(context, output);
      this.outputRuleset(context, output, this.rules);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      if (!context.mediaBlocks) {
        context.mediaBlocks = [];
        context.mediaPath = [];
      }

      var media = new Media(null, [], this._index, this._fileInfo, this.visibilityInfo());

      if (this.debugInfo) {
        this.rules[0].debugInfo = this.debugInfo;
        media.debugInfo = this.debugInfo;
      }

      media.features = this.features.eval(context);
      context.mediaPath.push(media);
      context.mediaBlocks.push(media);
      this.rules[0].functionRegistry = context.frames[0].functionRegistry.inherit();
      context.frames.unshift(this.rules[0]);
      media.rules = [this.rules[0].eval(context)];
      context.frames.shift();
      context.mediaPath.pop();
      return context.mediaPath.length === 0 ? media.evalTop(context) : media.evalNested(context);
    }
  }, {
    key: "evalTop",
    value: function evalTop(context) {
      var result = this; // Render all dependent Media blocks.

      if (context.mediaBlocks.length > 1) {
        var selectors = new _selector["default"]([], null, null, this.getIndex(), this.fileInfo()).createEmptySelectors();
        result = new _ruleset["default"](selectors, context.mediaBlocks);
        result.multiMedia = true;
        result.copyVisibilityInfo(this.visibilityInfo());
        this.setParent(result, this);
      }

      delete context.mediaBlocks;
      delete context.mediaPath;
      return result;
    }
  }, {
    key: "evalNested",
    value: function evalNested(context) {
      var i;
      var value;
      var path = context.mediaPath.concat([this]); // Extract the media-query conditions separated with `,` (OR).

      for (i = 0; i < path.length; i++) {
        value = path[i].features instanceof _value["default"] ? path[i].features.value : path[i].features;
        path[i] = Array.isArray(value) ? value : [value];
      } // Trace all permutations to generate the resulting media-query.
      //
      // (a, b and c) with nested (d, e) ->
      //    a and d
      //    a and e
      //    b and c and d
      //    b and c and e


      this.features = new _value["default"](this.permute(path).map(function (path) {
        path = path.map(function (fragment) {
          return fragment.toCSS ? fragment : new _anonymous["default"](fragment);
        });

        for (i = path.length - 1; i > 0; i--) {
          path.splice(i, 0, new _anonymous["default"]('and'));
        }

        return new _expression["default"](path);
      }));
      this.setParent(this.features, this); // Fake a tree-node that doesn't output anything.

      return new _ruleset["default"]([], []);
    }
  }, {
    key: "permute",
    value: function permute(arr) {
      if (arr.length === 0) {
        return [];
      } else if (arr.length === 1) {
        return arr[0];
      } else {
        var result = [];
        var rest = this.permute(arr.slice(1));

        for (var i = 0; i < rest.length; i++) {
          for (var j = 0; j < arr[0].length; j++) {
            result.push([arr[0][j]].concat(rest[i]));
          }
        }

        return result;
      }
    }
  }, {
    key: "bubbleSelectors",
    value: function bubbleSelectors(selectors) {
      if (!selectors) {
        return;
      }

      this.rules = [new _ruleset["default"](utils.copyArray(selectors), [this.rules[0]])];
      this.setParent(this.rules, this);
    }
  }]);

  return Media;
}(_atrule["default"]);

Media.prototype.type = 'Media';
var _default = Media;
exports["default"] = _default;