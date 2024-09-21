"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var utils = _interopRequireWildcard(require("./utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PromiseConstructor;

var _default = function _default(environment, ParseTree, ImportManager) {
  var render = function render(input, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = utils.copyOptions(this.options, {});
    } else {
      options = utils.copyOptions(this.options, options || {});
    }

    if (!callback) {
      var self = this;
      return new Promise(function (resolve, reject) {
        render.call(self, input, options, function (err, output) {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        });
      });
    } else {
      this.parse(input, options, function (err, root, imports, options) {
        if (err) {
          return callback(err);
        }

        var result;

        try {
          var parseTree = new ParseTree(root, imports);
          result = parseTree.toCSS(options);
        } catch (err) {
          return callback(err);
        }

        callback(null, result);
      });
    }
  };

  return render;
};

exports["default"] = _default;