"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ImportSequencer = /*#__PURE__*/function () {
  function ImportSequencer(onSequencerEmpty) {
    _classCallCheck(this, ImportSequencer);
    this.imports = [];
    this.variableImports = [];
    this._onSequencerEmpty = onSequencerEmpty;
    this._currentDepth = 0;
  }
  return _createClass(ImportSequencer, [{
    key: "addImport",
    value: function addImport(callback) {
      var importSequencer = this;
      var importItem = {
        callback: callback,
        args: null,
        isReady: false
      };
      this.imports.push(importItem);
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        importItem.args = Array.prototype.slice.call(args, 0);
        importItem.isReady = true;
        importSequencer.tryRun();
      };
    }
  }, {
    key: "addVariableImport",
    value: function addVariableImport(callback) {
      this.variableImports.push(callback);
    }
  }, {
    key: "tryRun",
    value: function tryRun() {
      this._currentDepth++;
      try {
        while (true) {
          while (this.imports.length > 0) {
            var importItem = this.imports[0];
            if (!importItem.isReady) {
              return;
            }
            this.imports = this.imports.slice(1);
            importItem.callback.apply(null, importItem.args);
          }
          if (this.variableImports.length === 0) {
            break;
          }
          var variableImport = this.variableImports[0];
          this.variableImports = this.variableImports.slice(1);
          variableImport();
        }
      } finally {
        this._currentDepth--;
      }
      if (this._currentDepth === 0 && this._onSequencerEmpty) {
        this._onSequencerEmpty();
      }
    }
  }]);
}();
var _default = exports["default"] = ImportSequencer;