"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _quoted = _interopRequireDefault(require("../tree/quoted"));
var _url = _interopRequireDefault(require("../tree/url"));
var utils = _interopRequireWildcard(require("../utils"));
var _logger = _interopRequireDefault(require("../logger"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var _default = exports["default"] = function _default(environment) {
  var fallback = function fallback(functionThis, node) {
    return new _url["default"](node, functionThis.index, functionThis.currentFileInfo).eval(functionThis.context);
  };
  return {
    'data-uri': function dataUri(mimetypeNode, filePathNode) {
      if (!filePathNode) {
        filePathNode = mimetypeNode;
        mimetypeNode = null;
      }
      var mimetype = mimetypeNode && mimetypeNode.value;
      var filePath = filePathNode.value;
      var currentFileInfo = this.currentFileInfo;
      var currentDirectory = currentFileInfo.rewriteUrls ? currentFileInfo.currentDirectory : currentFileInfo.entryPath;
      var fragmentStart = filePath.indexOf('#');
      var fragment = '';
      if (fragmentStart !== -1) {
        fragment = filePath.slice(fragmentStart);
        filePath = filePath.slice(0, fragmentStart);
      }
      var context = utils.clone(this.context);
      context.rawBuffer = true;
      var fileManager = environment.getFileManager(filePath, currentDirectory, context, environment, true);
      if (!fileManager) {
        return fallback(this, filePathNode);
      }
      var useBase64 = false;

      // detect the mimetype if not given
      if (!mimetypeNode) {
        mimetype = environment.mimeLookup(filePath);
        if (mimetype === 'image/svg+xml') {
          useBase64 = false;
        } else {
          // use base 64 unless it's an ASCII or UTF-8 format
          var charset = environment.charsetLookup(mimetype);
          useBase64 = ['US-ASCII', 'UTF-8'].indexOf(charset) < 0;
        }
        if (useBase64) {
          mimetype += ';base64';
        }
      } else {
        useBase64 = /;base64$/.test(mimetype);
      }
      var fileSync = fileManager.loadFileSync(filePath, currentDirectory, context, environment);
      if (!fileSync.contents) {
        _logger["default"].warn("Skipped data-uri embedding of ".concat(filePath, " because file not found"));
        return fallback(this, filePathNode || mimetypeNode);
      }
      var buf = fileSync.contents;
      if (useBase64 && !environment.encodeBase64) {
        return fallback(this, filePathNode);
      }
      buf = useBase64 ? environment.encodeBase64(buf) : encodeURIComponent(buf);
      var uri = "data:".concat(mimetype, ",").concat(buf).concat(fragment);
      return new _url["default"](new _quoted["default"]("\"".concat(uri, "\""), uri, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
    }
  };
};