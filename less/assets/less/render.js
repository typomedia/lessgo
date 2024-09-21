"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var PromiseConstructor;
var _default = exports["default"] = function _default(environment, ParseTree, ImportManager) {
  var _render = function render(input, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = utils.copyOptions(this.options, {});
    } else {
      options = utils.copyOptions(this.options, options || {});
    }
    if (!callback) {
      var self = this;
      return new Promise(function (resolve, reject) {
        _render.call(self, input, options, function (err, output) {
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
  return _render;
};