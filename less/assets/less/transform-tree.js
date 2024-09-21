"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _contexts = _interopRequireDefault(require("./contexts"));

var _visitors = _interopRequireDefault(require("./visitors"));

var _tree = _interopRequireDefault(require("./tree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = function _default(root) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var evaldRoot;
  var variables = options.variables;
  var evalEnv = new _contexts["default"].Eval(options); //
  // Allows setting variables with a hash, so:
  //
  //   `{ color: new tree.Color('#f01') }` will become:
  //
  //   new tree.Declaration('@color',
  //     new tree.Value([
  //       new tree.Expression([
  //         new tree.Color('#f01')
  //       ])
  //     ])
  //   )
  //

  if (_typeof(variables) === 'object' && !Array.isArray(variables)) {
    variables = Object.keys(variables).map(function (k) {
      var value = variables[k];

      if (!(value instanceof _tree["default"].Value)) {
        if (!(value instanceof _tree["default"].Expression)) {
          value = new _tree["default"].Expression([value]);
        }

        value = new _tree["default"].Value([value]);
      }

      return new _tree["default"].Declaration("@".concat(k), value, false, null, 0);
    });
    evalEnv.frames = [new _tree["default"].Ruleset(null, variables)];
  }

  var visitors = [new _visitors["default"].JoinSelectorVisitor(), new _visitors["default"].MarkVisibleSelectorsVisitor(true), new _visitors["default"].ExtendVisitor(), new _visitors["default"].ToCSSVisitor({
    compress: Boolean(options.compress)
  })];
  var preEvalVisitors = [];
  var v;
  var visitorIterator;
  /**
   * first() / get() allows visitors to be added while visiting
   * 
   * @todo Add scoping for visitors just like functions for @plugin; right now they're global
   */

  if (options.pluginManager) {
    visitorIterator = options.pluginManager.visitor();

    for (var i = 0; i < 2; i++) {
      visitorIterator.first();

      while (v = visitorIterator.get()) {
        if (v.isPreEvalVisitor) {
          if (i === 0 || preEvalVisitors.indexOf(v) === -1) {
            preEvalVisitors.push(v);
            v.run(root);
          }
        } else {
          if (i === 0 || visitors.indexOf(v) === -1) {
            if (v.isPreVisitor) {
              visitors.unshift(v);
            } else {
              visitors.push(v);
            }
          }
        }
      }
    }
  }

  evaldRoot = root.eval(evalEnv);

  for (var i = 0; i < visitors.length; i++) {
    visitors[i].run(evaldRoot);
  } // Run any remaining visitors added after eval pass


  if (options.pluginManager) {
    visitorIterator.first();

    while (v = visitorIterator.get()) {
      if (visitors.indexOf(v) === -1 && preEvalVisitors.indexOf(v) === -1) {
        v.run(evaldRoot);
      }
    }
  }

  return evaldRoot;
};

exports["default"] = _default;