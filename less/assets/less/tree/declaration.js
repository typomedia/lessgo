"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _node = _interopRequireDefault(require("./node"));

var _value = _interopRequireDefault(require("./value"));

var _keyword = _interopRequireDefault(require("./keyword"));

var _anonymous = _interopRequireDefault(require("./anonymous"));

var Constants = _interopRequireWildcard(require("../constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var MATH = Constants.Math;

var Declaration = /*#__PURE__*/function (_Node) {
  _inherits(Declaration, _Node);

  var _super = _createSuper(Declaration);

  function Declaration(name, value, important, merge, index, currentFileInfo, inline, variable) {
    var _this;

    _classCallCheck(this, Declaration);

    _this = _super.call(this);
    _this.name = name;
    _this.value = value instanceof _node["default"] ? value : new _value["default"]([value ? new _anonymous["default"](value) : null]);
    _this.important = important ? " ".concat(important.trim()) : '';
    _this.merge = merge;
    _this._index = index;
    _this._fileInfo = currentFileInfo;
    _this.inline = inline || false;
    _this.variable = variable !== undefined ? variable : name.charAt && name.charAt(0) === '@';
    _this.allowRoot = true;

    _this.setParent(_this.value, _assertThisInitialized(_this));

    return _this;
  }

  _createClass(Declaration, [{
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add(this.name + (context.compress ? ':' : ': '), this.fileInfo(), this.getIndex());

      try {
        this.value.genCSS(context, output);
      } catch (e) {
        e.index = this._index;
        e.filename = this._fileInfo.filename;
        throw e;
      }

      output.add(this.important + (this.inline || context.lastRule && context.compress ? '' : ';'), this._fileInfo, this._index);
    }
  }, {
    key: "eval",
    value: function _eval(context) {
      var mathBypass = false;
      var prevMath;
      var name = this.name;
      var evaldValue;
      var variable = this.variable;

      if (typeof name !== 'string') {
        // expand 'primitive' name directly to get
        // things faster (~10% for benchmark.less):
        name = name.length === 1 && name[0] instanceof _keyword["default"] ? name[0].value : evalName(context, name);
        variable = false; // never treat expanded interpolation as new variable name
      } // @todo remove when parens-division is default


      if (name === 'font' && context.math === MATH.ALWAYS) {
        mathBypass = true;
        prevMath = context.math;
        context.math = MATH.PARENS_DIVISION;
      }

      try {
        context.importantScope.push({});
        evaldValue = this.value.eval(context);

        if (!this.variable && evaldValue.type === 'DetachedRuleset') {
          throw {
            message: 'Rulesets cannot be evaluated on a property.',
            index: this.getIndex(),
            filename: this.fileInfo().filename
          };
        }

        var important = this.important;
        var importantResult = context.importantScope.pop();

        if (!important && importantResult.important) {
          important = importantResult.important;
        }

        return new Declaration(name, evaldValue, important, this.merge, this.getIndex(), this.fileInfo(), this.inline, variable);
      } catch (e) {
        if (typeof e.index !== 'number') {
          e.index = this.getIndex();
          e.filename = this.fileInfo().filename;
        }

        throw e;
      } finally {
        if (mathBypass) {
          context.math = prevMath;
        }
      }
    }
  }, {
    key: "makeImportant",
    value: function makeImportant() {
      return new Declaration(this.name, this.value, '!important', this.merge, this.getIndex(), this.fileInfo(), this.inline);
    }
  }]);

  return Declaration;
}(_node["default"]);

function evalName(context, name) {
  var value = '';
  var i;
  var n = name.length;
  var output = {
    add: function add(s) {
      value += s;
    }
  };

  for (i = 0; i < n; i++) {
    name[i].eval(context).genCSS(context, output);
  }

  return value;
}

Declaration.prototype.type = 'Declaration';
var _default = Declaration;
exports["default"] = _default;