"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _declaration = _interopRequireDefault(require("./declaration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Property = /*#__PURE__*/function (_Node) {
  _inherits(Property, _Node);

  var _super = _createSuper(Property);

  function Property(name, index, currentFileInfo) {
    var _this;

    _classCallCheck(this, Property);

    _this = _super.call(this);
    _this.name = name;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    return _this;
  }

  _createClass(Property, [{
    key: "eval",
    value: function _eval(context) {
      var property;
      var name = this.name; // TODO: shorten this reference

      var mergeRules = context.pluginManager.less.visitors.ToCSSVisitor.prototype._mergeRules;

      if (this.evaluating) {
        throw {
          type: 'Name',
          message: "Recursive property reference for ".concat(name),
          filename: this.fileInfo().filename,
          index: this.getIndex()
        };
      }

      this.evaluating = true;
      property = this.find(context.frames, function (frame) {
        var v;
        var vArr = frame.property(name);

        if (vArr) {
          for (var i = 0; i < vArr.length; i++) {
            v = vArr[i];
            vArr[i] = new _declaration["default"](v.name, v.value, v.important, v.merge, v.index, v.currentFileInfo, v.inline, v.variable);
          }

          mergeRules(vArr);
          v = vArr[vArr.length - 1];

          if (v.important) {
            var importantScope = context.importantScope[context.importantScope.length - 1];
            importantScope.important = v.important;
          }

          v = v.value.eval(context);
          return v;
        }
      });

      if (property) {
        this.evaluating = false;
        return property;
      } else {
        throw {
          type: 'Name',
          message: "Property '".concat(name, "' is undefined"),
          filename: this.currentFileInfo.filename,
          index: this.index
        };
      }
    }
  }, {
    key: "find",
    value: function find(obj, fun) {
      for (var i = 0, r; i < obj.length; i++) {
        r = fun.call(obj, obj[i]);

        if (r) {
          return r;
        }
      }

      return null;
    }
  }]);

  return Property;
}(_node["default"]);

Property.prototype.type = 'Property';
var _default = Property;
exports["default"] = _default;