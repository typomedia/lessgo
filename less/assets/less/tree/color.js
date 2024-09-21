"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _colors = _interopRequireDefault(require("../data/colors"));

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
// RGB Colors - #ff0014, #eee
//
var Color = /*#__PURE__*/function (_Node) {
  _inherits(Color, _Node);

  var _super = _createSuper(Color);

  function Color(rgb, a, originalForm) {
    var _this;

    _classCallCheck(this, Color);

    _this = _super.call(this);

    var self = _assertThisInitialized(_this); //
    // The end goal here, is to parse the arguments
    // into an integer triplet, such as `128, 255, 0`
    //
    // This facilitates operations and conversions.
    //


    if (Array.isArray(rgb)) {
      _this.rgb = rgb;
    } else if (rgb.length >= 6) {
      _this.rgb = [];
      rgb.match(/.{2}/g).map(function (c, i) {
        if (i < 3) {
          self.rgb.push(parseInt(c, 16));
        } else {
          self.alpha = parseInt(c, 16) / 255;
        }
      });
    } else {
      _this.rgb = [];
      rgb.split('').map(function (c, i) {
        if (i < 3) {
          self.rgb.push(parseInt(c + c, 16));
        } else {
          self.alpha = parseInt(c + c, 16) / 255;
        }
      });
    }

    _this.alpha = _this.alpha || (typeof a === 'number' ? a : 1);

    if (typeof originalForm !== 'undefined') {
      _this.value = originalForm;
    }

    return _this;
  }

  _createClass(Color, [{
    key: "luma",
    value: function luma() {
      var r = this.rgb[0] / 255;
      var g = this.rgb[1] / 255;
      var b = this.rgb[2] / 255;
      r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add(this.toCSS(context));
    }
  }, {
    key: "toCSS",
    value: function toCSS(context, doNotCompress) {
      var compress = context && context.compress && !doNotCompress;
      var color;
      var alpha;
      var colorFunction;
      var args = []; // `value` is set if this color was originally
      // converted from a named color string so we need
      // to respect this and try to output named color too.

      alpha = this.fround(context, this.alpha);

      if (this.value) {
        if (this.value.indexOf('rgb') === 0) {
          if (alpha < 1) {
            colorFunction = 'rgba';
          }
        } else if (this.value.indexOf('hsl') === 0) {
          if (alpha < 1) {
            colorFunction = 'hsla';
          } else {
            colorFunction = 'hsl';
          }
        } else {
          return this.value;
        }
      } else {
        if (alpha < 1) {
          colorFunction = 'rgba';
        }
      }

      switch (colorFunction) {
        case 'rgba':
          args = this.rgb.map(function (c) {
            return clamp(Math.round(c), 255);
          }).concat(clamp(alpha, 1));
          break;

        case 'hsla':
          args.push(clamp(alpha, 1));

        case 'hsl':
          color = this.toHSL();
          args = [this.fround(context, color.h), "".concat(this.fround(context, color.s * 100), "%"), "".concat(this.fround(context, color.l * 100), "%")].concat(args);
      }

      if (colorFunction) {
        // Values are capped between `0` and `255`, rounded and zero-padded.
        return "".concat(colorFunction, "(").concat(args.join(",".concat(compress ? '' : ' ')), ")");
      }

      color = this.toRGB();

      if (compress) {
        var splitcolor = color.split(''); // Convert color to short format

        if (splitcolor[1] === splitcolor[2] && splitcolor[3] === splitcolor[4] && splitcolor[5] === splitcolor[6]) {
          color = "#".concat(splitcolor[1]).concat(splitcolor[3]).concat(splitcolor[5]);
        }
      }

      return color;
    } //
    // Operations have to be done per-channel, if not,
    // channels will spill onto each other. Once we have
    // our result, in the form of an integer triplet,
    // we create a new Color node to hold the result.
    //

  }, {
    key: "operate",
    value: function operate(context, op, other) {
      var rgb = new Array(3);
      var alpha = this.alpha * (1 - other.alpha) + other.alpha;

      for (var c = 0; c < 3; c++) {
        rgb[c] = this._operate(context, op, this.rgb[c], other.rgb[c]);
      }

      return new Color(rgb, alpha);
    }
  }, {
    key: "toRGB",
    value: function toRGB() {
      return toHex(this.rgb);
    }
  }, {
    key: "toHSL",
    value: function toHSL() {
      var r = this.rgb[0] / 255;
      var g = this.rgb[1] / 255;
      var b = this.rgb[2] / 255;
      var a = this.alpha;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h;
      var s;
      var l = (max + min) / 2;
      var d = max - min;

      if (max === min) {
        h = s = 0;
      } else {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return {
        h: h * 360,
        s: s,
        l: l,
        a: a
      };
    } // Adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript

  }, {
    key: "toHSV",
    value: function toHSV() {
      var r = this.rgb[0] / 255;
      var g = this.rgb[1] / 255;
      var b = this.rgb[2] / 255;
      var a = this.alpha;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h;
      var s;
      var v = max;
      var d = max - min;

      if (max === 0) {
        s = 0;
      } else {
        s = d / max;
      }

      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return {
        h: h * 360,
        s: s,
        v: v,
        a: a
      };
    }
  }, {
    key: "toARGB",
    value: function toARGB() {
      return toHex([this.alpha * 255].concat(this.rgb));
    }
  }, {
    key: "compare",
    value: function compare(x) {
      return x.rgb && x.rgb[0] === this.rgb[0] && x.rgb[1] === this.rgb[1] && x.rgb[2] === this.rgb[2] && x.alpha === this.alpha ? 0 : undefined;
    }
  }]);

  return Color;
}(_node["default"]);

Color.prototype.type = 'Color';

function clamp(v, max) {
  return Math.min(Math.max(v, 0), max);
}

function toHex(v) {
  return "#".concat(v.map(function (c) {
    c = clamp(Math.round(c), 255);
    return (c < 16 ? '0' : '') + c.toString(16);
  }).join(''));
}

Color.fromKeyword = function (keyword) {
  var c;
  var key = keyword.toLowerCase();

  if (_colors["default"].hasOwnProperty(key)) {
    c = new Color(_colors["default"][key].slice(1));
  } else if (key === 'transparent') {
    c = new Color([0, 0, 0], 0);
  }

  if (c) {
    c.value = keyword;
    return c;
  }
};

var _default = Color;
exports["default"] = _default;