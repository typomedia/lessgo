"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _comment = _interopRequireDefault(require("../tree/comment"));

var _node = _interopRequireDefault(require("../tree/node"));

var _dimension = _interopRequireDefault(require("../tree/dimension"));

var _declaration = _interopRequireDefault(require("../tree/declaration"));

var _expression = _interopRequireDefault(require("../tree/expression"));

var _ruleset = _interopRequireDefault(require("../tree/ruleset"));

var _selector = _interopRequireDefault(require("../tree/selector"));

var _element = _interopRequireDefault(require("../tree/element"));

var _quoted = _interopRequireDefault(require("../tree/quoted"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getItemsFromNode = function getItemsFromNode(node) {
  // handle non-array values as an array of length 1
  // return 'undefined' if index is invalid
  var items = Array.isArray(node.value) ? node.value : Array(node);
  return items;
};

var _default = {
  _SELF: function _SELF(n) {
    return n;
  },
  extract: function extract(values, index) {
    // (1-based index)
    index = index.value - 1;
    return getItemsFromNode(values)[index];
  },
  length: function length(values) {
    return new _dimension["default"](getItemsFromNode(values).length);
  },

  /**
   * Creates a Less list of incremental values.
   * Modeled after Lodash's range function, also exists natively in PHP
   * 
   * @param {Dimension} [start=1]
   * @param {Dimension} end  - e.g. 10 or 10px - unit is added to output
   * @param {Dimension} [step=1] 
   */
  range: function range(start, end, step) {
    var from;
    var to;
    var stepValue = 1;
    var list = [];

    if (end) {
      to = end;
      from = start.value;

      if (step) {
        stepValue = step.value;
      }
    } else {
      from = 1;
      to = start;
    }

    for (var i = from; i <= to.value; i += stepValue) {
      list.push(new _dimension["default"](i, to.unit));
    }

    return new _expression["default"](list);
  },
  each: function each(list, rs) {
    var _this = this;

    var rules = [];
    var newRules;
    var iterator;

    var tryEval = function tryEval(val) {
      if (val instanceof _node["default"]) {
        return val.eval(_this.context);
      }

      return val;
    };

    if (list.value && !(list instanceof _quoted["default"])) {
      if (Array.isArray(list.value)) {
        iterator = list.value.map(tryEval);
      } else {
        iterator = [tryEval(list.value)];
      }
    } else if (list.ruleset) {
      iterator = tryEval(list.ruleset).rules;
    } else if (list.rules) {
      iterator = list.rules.map(tryEval);
    } else if (Array.isArray(list)) {
      iterator = list.map(tryEval);
    } else {
      iterator = [tryEval(list)];
    }

    var valueName = '@value';
    var keyName = '@key';
    var indexName = '@index';

    if (rs.params) {
      valueName = rs.params[0] && rs.params[0].name;
      keyName = rs.params[1] && rs.params[1].name;
      indexName = rs.params[2] && rs.params[2].name;
      rs = rs.rules;
    } else {
      rs = rs.ruleset;
    }

    for (var i = 0; i < iterator.length; i++) {
      var key = void 0;
      var value = void 0;
      var item = iterator[i];

      if (item instanceof _declaration["default"]) {
        key = typeof item.name === 'string' ? item.name : item.name[0].value;
        value = item.value;
      } else {
        key = new _dimension["default"](i + 1);
        value = item;
      }

      if (item instanceof _comment["default"]) {
        continue;
      }

      newRules = rs.rules.slice(0);

      if (valueName) {
        newRules.push(new _declaration["default"](valueName, value, false, false, this.index, this.currentFileInfo));
      }

      if (indexName) {
        newRules.push(new _declaration["default"](indexName, new _dimension["default"](i + 1), false, false, this.index, this.currentFileInfo));
      }

      if (keyName) {
        newRules.push(new _declaration["default"](keyName, key, false, false, this.index, this.currentFileInfo));
      }

      rules.push(new _ruleset["default"]([new _selector["default"]([new _element["default"]("", '&')])], newRules, rs.strictImports, rs.visibilityInfo()));
    }

    return new _ruleset["default"]([new _selector["default"]([new _element["default"]("", '&')])], rules, rs.strictImports, rs.visibilityInfo()).eval(this.context);
  }
};
exports["default"] = _default;