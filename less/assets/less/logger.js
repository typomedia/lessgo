"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = exports["default"] = {
  error: function error(msg) {
    this._fireEvent('error', msg);
  },
  warn: function warn(msg) {
    this._fireEvent('warn', msg);
  },
  info: function info(msg) {
    this._fireEvent('info', msg);
  },
  debug: function debug(msg) {
    this._fireEvent('debug', msg);
  },
  addListener: function addListener(listener) {
    this._listeners.push(listener);
  },
  removeListener: function removeListener(listener) {
    for (var i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i] === listener) {
        this._listeners.splice(i, 1);
        return;
      }
    }
  },
  _fireEvent: function _fireEvent(type, msg) {
    for (var i = 0; i < this._listeners.length; i++) {
      var logFunction = this._listeners[i][type];
      if (logFunction) {
        logFunction(msg);
      }
    }
  },
  _listeners: []
};