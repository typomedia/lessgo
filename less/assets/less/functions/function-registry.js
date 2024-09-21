"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function makeRegistry(base) {
  return {
    _data: {},
    add: function add(name, func) {
      // precautionary case conversion, as later querying of
      // the registry by function-caller uses lower case as well.
      name = name.toLowerCase();

      if (this._data.hasOwnProperty(name)) {// TODO warn
      }

      this._data[name] = func;
    },
    addMultiple: function addMultiple(functions) {
      var _this = this;

      Object.keys(functions).forEach(function (name) {
        _this.add(name, functions[name]);
      });
    },
    get: function get(name) {
      return this._data[name] || base && base.get(name);
    },
    getLocalFunctions: function getLocalFunctions() {
      return this._data;
    },
    inherit: function inherit() {
      return makeRegistry(this);
    },
    create: function create(base) {
      return makeRegistry(base);
    }
  };
}

var _default = makeRegistry(null);

exports["default"] = _default;