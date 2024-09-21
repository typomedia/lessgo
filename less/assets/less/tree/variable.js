"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _call = _interopRequireDefault(require("./call"));

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

var Variable = /*#__PURE__*/function (_Node) {
  _inherits(Variable, _Node);

  var _super = _createSuper(Variable);

  function Variable(name, index, currentFileInfo) {
    var _this;

    _classCallCheck(this, Variable);

    _this = _super.call(this);
    _this.name = name;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    return _this;
  }

  _createClass(Variable, [{
    key: "eval",
    value: function _eval(context) {
      var variable;
      var name = this.name;

      if (name.indexOf('@@') === 0) {
        name = "@".concat(new Variable(name.slice(1), this.getIndex(), this.fileInfo()).eval(context).value);
      }

      if (this.evaluating) {
        throw {
          type: 'Name',
          message: "Recursive variable definition for ".concat(name),
          filename: this.fileInfo().filename,
          index: this.getIndex()
        };
      }

      this.evaluating = true;
      variable = this.find(context.frames, function (frame) {
        var v = frame.variable(name);

        if (v) {
          if (v.important) {
            var importantScope = context.importantScope[context.importantScope.length - 1];
            importantScope.important = v.important;
          } // If in calc, wrap vars in a function call to cascade evaluate args first


          if (context.inCalc) {
            return new _call["default"]('_SELF', [v.value]).eval(context);
          } else {
            return v.value.eval(context);
          }
        }
      });

      if (variable) {
        this.evaluating = false;
        return variable;
      } else {
        throw {
          type: 'Name',
          message: "variable ".concat(name, " is undefined"),
          filename: this.fileInfo().filename,
          index: this.getIndex()
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

  return Variable;
}(_node["default"]);

Variable.prototype.type = 'Variable';
var _default = Variable;
exports["default"] = _default;