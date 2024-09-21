"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _debugInfo = function debugInfo(context, ctx, lineSeparator) {
  var result = '';
  if (context.dumpLineNumbers && !context.compress) {
    switch (context.dumpLineNumbers) {
      case 'comments':
        result = _debugInfo.asComment(ctx);
        break;
      case 'mediaquery':
        result = _debugInfo.asMediaQuery(ctx);
        break;
      case 'all':
        result = _debugInfo.asComment(ctx) + (lineSeparator || '') + _debugInfo.asMediaQuery(ctx);
        break;
    }
  }
  return result;
};
_debugInfo.asComment = function (ctx) {
  return ctx.debugInfo ? "/* line ".concat(ctx.debugInfo.lineNumber, ", ").concat(ctx.debugInfo.fileName, " */\n") : '';
};
_debugInfo.asMediaQuery = function (ctx) {
  if (!ctx.debugInfo) {
    return '';
  }
  var filenameWithProtocol = ctx.debugInfo.fileName;
  if (!/^[a-z]+:\/\//i.test(filenameWithProtocol)) {
    filenameWithProtocol = "file://".concat(filenameWithProtocol);
  }
  return "@media -sass-debug-info{filename{font-family:".concat(filenameWithProtocol.replace(/([.:\/\\])/g, function (a) {
    if (a == '\\') {
      a = '\/';
    }
    return "\\".concat(a);
  }), "}line{font-family:\\00003").concat(ctx.debugInfo.lineNumber, "}}\n");
};
var _default = exports["default"] = _debugInfo;