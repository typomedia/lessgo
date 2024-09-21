"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _node = _interopRequireDefault(require("./node"));
var _colors = _interopRequireDefault(require("../data/colors"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
//
// RGB Colors - #ff0014, #eee
//
var Color = /*#__PURE__*/function (_Node) {
  function Color(rgb, a, originalForm) {
    var _this;
    _classCallCheck(this, Color);
    _this = _callSuper(this, Color);
    var self = _this;
    //
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
  _inherits(Color, _Node);
  return _createClass(Color, [{
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
      var args = [];

      // `value` is set if this color was originally
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
        var splitcolor = color.split('');

        // Convert color to short format
        if (splitcolor[1] === splitcolor[2] && splitcolor[3] === splitcolor[4] && splitcolor[5] === splitcolor[6]) {
          color = "#".concat(splitcolor[1]).concat(splitcolor[3]).concat(splitcolor[5]);
        }
      }
      return color;
    }

    //
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
    }

    // Adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
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
var _default = exports["default"] = Color;