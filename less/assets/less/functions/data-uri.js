"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _quoted = _interopRequireDefault(require("../tree/quoted"));

var _url = _interopRequireDefault(require("../tree/url"));

var utils = _interopRequireWildcard(require("../utils"));

var _logger = _interopRequireDefault(require("../logger"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(environment) {
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

      var useBase64 = false; // detect the mimetype if not given

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

exports["default"] = _default;