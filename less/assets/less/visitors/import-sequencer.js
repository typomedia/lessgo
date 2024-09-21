"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ImportSequencer = /*#__PURE__*/function () {
  function ImportSequencer(onSequencerEmpty) {
    _classCallCheck(this, ImportSequencer);

    this.imports = [];
    this.variableImports = [];
    this._onSequencerEmpty = onSequencerEmpty;
    this._currentDepth = 0;
  }

  _createClass(ImportSequencer, [{
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

  return ImportSequencer;
}();

var _default = ImportSequencer;
exports["default"] = _default;