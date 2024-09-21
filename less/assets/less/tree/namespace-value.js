"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _variable = _interopRequireDefault(require("./variable"));

var _ruleset = _interopRequireDefault(require("./ruleset"));

var _selector = _interopRequireDefault(require("./selector"));

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

var NamespaceValue = /*#__PURE__*/function (_Node) {
  _inherits(NamespaceValue, _Node);

  var _super = _createSuper(NamespaceValue);

  function NamespaceValue(ruleCall, lookups, index, fileInfo) {
    var _this;

    _classCallCheck(this, NamespaceValue);

    _this = _super.call(this);
    _this.value = ruleCall;
    _this.lookups = lookups;
    _this._index = index;
    _this._fileInfo = fileInfo;
    return _this;
  }

  _createClass(NamespaceValue, [{
    key: "eval",
    value: function _eval(context) {
      var i;
      var j;
      var name;
      var rules = this.value.eval(context);

      for (i = 0; i < this.lookups.length; i++) {
        name = this.lookups[i];
        /**
         * Eval'd DRs return rulesets.
         * Eval'd mixins return rules, so let's make a ruleset if we need it.
         * We need to do this because of late parsing of values
         */

        if (Array.isArray(rules)) {
          rules = new _ruleset["default"]([new _selector["default"]()], rules);
        }

        if (name === '') {
          rules = rules.lastDeclaration();
        } else if (name.charAt(0) === '@') {
          if (name.charAt(1) === '@') {
            name = "@".concat(new _variable["default"](name.substr(1)).eval(context).value);
          }

          if (rules.variables) {
            rules = rules.variable(name);
          }

          if (!rules) {
            throw {
              type: 'Name',
              message: "variable ".concat(name, " not found"),
              filename: this.fileInfo().filename,
              index: this.getIndex()
            };
          }
        } else {
          if (name.substring(0, 2) === '$@') {
            name = "$".concat(new _variable["default"](name.substr(1)).eval(context).value);
          } else {
            name = name.charAt(0) === '$' ? name : "$".concat(name);
          }

          if (rules.properties) {
            rules = rules.property(name);
          }

          if (!rules) {
            throw {
              type: 'Name',
              message: "property \"".concat(name.substr(1), "\" not found"),
              filename: this.fileInfo().filename,
              index: this.getIndex()
            };
          } // Properties are an array of values, since a ruleset can have multiple props.
          // We pick the last one (the "cascaded" value)


          rules = rules[rules.length - 1];
        }

        if (rules.value) {
          rules = rules.eval(context).value;
        }

        if (rules.ruleset) {
          rules = rules.ruleset.eval(context);
        }
      }

      return rules;
    }
  }]);

  return NamespaceValue;
}(_node["default"]);

NamespaceValue.prototype.type = 'NamespaceValue';
var _default = NamespaceValue;
exports["default"] = _default;