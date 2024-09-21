"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _functionRegistry = _interopRequireDefault(require("./function-registry"));
var _functionCaller = _interopRequireDefault(require("./function-caller"));
var _boolean2 = _interopRequireDefault(require("./boolean"));
var _default2 = _interopRequireDefault(require("./default"));
var _color = _interopRequireDefault(require("./color"));
var _colorBlending = _interopRequireDefault(require("./color-blending"));
var _dataUri = _interopRequireDefault(require("./data-uri"));
var _list = _interopRequireDefault(require("./list"));
var _math = _interopRequireDefault(require("./math"));
var _number = _interopRequireDefault(require("./number"));
var _string = _interopRequireDefault(require("./string"));
var _svg = _interopRequireDefault(require("./svg"));
var _types = _interopRequireDefault(require("./types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var _default = exports["default"] = function _default(environment) {
  var functions = {
    functionRegistry: _functionRegistry["default"],
    functionCaller: _functionCaller["default"]
  };

  // register functions
  _functionRegistry["default"].addMultiple(_boolean2["default"]);
  _functionRegistry["default"].add('default', _default2["default"].eval.bind(_default2["default"]));
  _functionRegistry["default"].addMultiple(_color["default"]);
  _functionRegistry["default"].addMultiple(_colorBlending["default"]);
  _functionRegistry["default"].addMultiple((0, _dataUri["default"])(environment));
  _functionRegistry["default"].addMultiple(_list["default"]);
  _functionRegistry["default"].addMultiple(_math["default"]);
  _functionRegistry["default"].addMultiple(_number["default"]);
  _functionRegistry["default"].addMultiple(_string["default"]);
  _functionRegistry["default"].addMultiple((0, _svg["default"])(environment));
  _functionRegistry["default"].addMultiple(_types["default"]);
  return functions;
};