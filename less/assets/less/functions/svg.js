"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dimension = _interopRequireDefault(require("../tree/dimension"));

var _color = _interopRequireDefault(require("../tree/color"));

var _expression = _interopRequireDefault(require("../tree/expression"));

var _quoted = _interopRequireDefault(require("../tree/quoted"));

var _url = _interopRequireDefault(require("../tree/url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(environment) {
  return {
    'svg-gradient': function svgGradient(direction) {
      var stops;
      var gradientDirectionSvg;
      var gradientType = 'linear';
      var rectangleDimension = 'x="0" y="0" width="1" height="1"';
      var renderEnv = {
        compress: false
      };
      var returner;
      var directionValue = direction.toCSS(renderEnv);
      var i;
      var color;
      var position;
      var positionValue;
      var alpha;

      function throwArgumentDescriptor() {
        throw {
          type: 'Argument',
          message: 'svg-gradient expects direction, start_color [start_position], [color position,]...,' + ' end_color [end_position] or direction, color list'
        };
      }

      if (arguments.length == 2) {
        if (arguments[1].value.length < 2) {
          throwArgumentDescriptor();
        }

        stops = arguments[1].value;
      } else if (arguments.length < 3) {
        throwArgumentDescriptor();
      } else {
        stops = Array.prototype.slice.call(arguments, 1);
      }

      switch (directionValue) {
        case 'to bottom':
          gradientDirectionSvg = 'x1="0%" y1="0%" x2="0%" y2="100%"';
          break;

        case 'to right':
          gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="0%"';
          break;

        case 'to bottom right':
          gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="100%"';
          break;

        case 'to top right':
          gradientDirectionSvg = 'x1="0%" y1="100%" x2="100%" y2="0%"';
          break;

        case 'ellipse':
        case 'ellipse at center':
          gradientType = 'radial';
          gradientDirectionSvg = 'cx="50%" cy="50%" r="75%"';
          rectangleDimension = 'x="-50" y="-50" width="101" height="101"';
          break;

        default:
          throw {
            type: 'Argument',
            message: 'svg-gradient direction must be \'to bottom\', \'to right\',' + ' \'to bottom right\', \'to top right\' or \'ellipse at center\''
          };
      }

      returner = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1 1\"><".concat(gradientType, "Gradient id=\"g\" ").concat(gradientDirectionSvg, ">");

      for (i = 0; i < stops.length; i += 1) {
        if (stops[i] instanceof _expression["default"]) {
          color = stops[i].value[0];
          position = stops[i].value[1];
        } else {
          color = stops[i];
          position = undefined;
        }

        if (!(color instanceof _color["default"]) || !((i === 0 || i + 1 === stops.length) && position === undefined) && !(position instanceof _dimension["default"])) {
          throwArgumentDescriptor();
        }

        positionValue = position ? position.toCSS(renderEnv) : i === 0 ? '0%' : '100%';
        alpha = color.alpha;
        returner += "<stop offset=\"".concat(positionValue, "\" stop-color=\"").concat(color.toRGB(), "\"").concat(alpha < 1 ? " stop-opacity=\"".concat(alpha, "\"") : '', "/>");
      }

      returner += "</".concat(gradientType, "Gradient><rect ").concat(rectangleDimension, " fill=\"url(#g)\" /></svg>");
      returner = encodeURIComponent(returner);
      returner = "data:image/svg+xml,".concat(returner);
      return new _url["default"](new _quoted["default"]("'".concat(returner, "'"), returner, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
    }
  };
};

exports["default"] = _default;