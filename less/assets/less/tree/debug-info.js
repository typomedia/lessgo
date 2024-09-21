"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var debugInfo = function debugInfo(context, ctx, lineSeparator) {
  var result = '';

  if (context.dumpLineNumbers && !context.compress) {
    switch (context.dumpLineNumbers) {
      case 'comments':
        result = debugInfo.asComment(ctx);
        break;

      case 'mediaquery':
        result = debugInfo.asMediaQuery(ctx);
        break;

      case 'all':
        result = debugInfo.asComment(ctx) + (lineSeparator || '') + debugInfo.asMediaQuery(ctx);
        break;
    }
  }

  return result;
};

debugInfo.asComment = function (ctx) {
  return ctx.debugInfo ? "/* line ".concat(ctx.debugInfo.lineNumber, ", ").concat(ctx.debugInfo.fileName, " */\n") : '';
};

debugInfo.asMediaQuery = function (ctx) {
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

var _default = debugInfo;
exports["default"] = _default;