"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _color = _interopRequireDefault(require("../tree/color"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Color Blending
// ref: http://www.w3.org/TR/compositing-1

function colorBlend(mode, color1, color2) {
  var ab = color1.alpha; // result

  var
  // backdrop
  cb;
  var as = color2.alpha;
  var
  // source
  cs;
  var ar;
  var cr;
  var r = [];
  ar = as + ab * (1 - as);
  for (var i = 0; i < 3; i++) {
    cb = color1.rgb[i] / 255;
    cs = color2.rgb[i] / 255;
    cr = mode(cb, cs);
    if (ar) {
      cr = (as * cs + ab * (cb - as * (cb + cs - cr))) / ar;
    }
    r[i] = cr * 255;
  }
  return new _color["default"](r, ar);
}
var colorBlendModeFunctions = {
  multiply: function multiply(cb, cs) {
    return cb * cs;
  },
  screen: function screen(cb, cs) {
    return cb + cs - cb * cs;
  },
  overlay: function overlay(cb, cs) {
    cb *= 2;
    return cb <= 1 ? colorBlendModeFunctions.multiply(cb, cs) : colorBlendModeFunctions.screen(cb - 1, cs);
  },
  softlight: function softlight(cb, cs) {
    var d = 1;
    var e = cb;
    if (cs > 0.5) {
      e = 1;
      d = cb > 0.25 ? Math.sqrt(cb) : ((16 * cb - 12) * cb + 4) * cb;
    }
    return cb - (1 - 2 * cs) * e * (d - cb);
  },
  hardlight: function hardlight(cb, cs) {
    return colorBlendModeFunctions.overlay(cs, cb);
  },
  difference: function difference(cb, cs) {
    return Math.abs(cb - cs);
  },
  exclusion: function exclusion(cb, cs) {
    return cb + cs - 2 * cb * cs;
  },
  // non-w3c functions:
  average: function average(cb, cs) {
    return (cb + cs) / 2;
  },
  negation: function negation(cb, cs) {
    return 1 - Math.abs(cb + cs - 1);
  }
};
for (var f in colorBlendModeFunctions) {
  if (colorBlendModeFunctions.hasOwnProperty(f)) {
    colorBlend[f] = colorBlend.bind(null, colorBlendModeFunctions[f]);
  }
}
var _default = exports["default"] = colorBlend;