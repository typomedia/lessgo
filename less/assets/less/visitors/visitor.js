"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tree = _interopRequireDefault(require("../tree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _visitArgs = {
  visitDeeper: true
};
var _hasIndexed = false;

function _noop(node) {
  return node;
}

function indexNodeTypes(parent, ticker) {
  // add .typeIndex to tree node types for lookup table
  var key;
  var child;

  for (key in parent) {
    /* eslint guard-for-in: 0 */
    child = parent[key];

    switch (_typeof(child)) {
      case 'function':
        // ignore bound functions directly on tree which do not have a prototype
        // or aren't nodes
        if (child.prototype && child.prototype.type) {
          child.prototype.typeIndex = ticker++;
        }

        break;

      case 'object':
        ticker = indexNodeTypes(child, ticker);
        break;
    }
  }

  return ticker;
}

var Visitor = /*#__PURE__*/function () {
  function Visitor(implementation) {
    _classCallCheck(this, Visitor);

    this._implementation = implementation;
    this._visitInCache = {};
    this._visitOutCache = {};

    if (!_hasIndexed) {
      indexNodeTypes(_tree["default"], 1);
      _hasIndexed = true;
    }
  }

  _createClass(Visitor, [{
    key: "visit",
    value: function visit(node) {
      if (!node) {
        return node;
      }

      var nodeTypeIndex = node.typeIndex;

      if (!nodeTypeIndex) {
        // MixinCall args aren't a node type?
        if (node.value && node.value.typeIndex) {
          this.visit(node.value);
        }

        return node;
      }

      var impl = this._implementation;
      var func = this._visitInCache[nodeTypeIndex];
      var funcOut = this._visitOutCache[nodeTypeIndex];
      var visitArgs = _visitArgs;
      var fnName;
      visitArgs.visitDeeper = true;

      if (!func) {
        fnName = "visit".concat(node.type);
        func = impl[fnName] || _noop;
        funcOut = impl["".concat(fnName, "Out")] || _noop;
        this._visitInCache[nodeTypeIndex] = func;
        this._visitOutCache[nodeTypeIndex] = funcOut;
      }

      if (func !== _noop) {
        var newNode = func.call(impl, node, visitArgs);

        if (node && impl.isReplacing) {
          node = newNode;
        }
      }

      if (visitArgs.visitDeeper && node) {
        if (node.length) {
          for (var i = 0, cnt = node.length; i < cnt; i++) {
            if (node[i].accept) {
              node[i].accept(this);
            }
          }
        } else if (node.accept) {
          node.accept(this);
        }
      }

      if (funcOut != _noop) {
        funcOut.call(impl, node);
      }

      return node;
    }
  }, {
    key: "visitArray",
    value: function visitArray(nodes, nonReplacing) {
      if (!nodes) {
        return nodes;
      }

      var cnt = nodes.length;
      var i; // Non-replacing

      if (nonReplacing || !this._implementation.isReplacing) {
        for (i = 0; i < cnt; i++) {
          this.visit(nodes[i]);
        }

        return nodes;
      } // Replacing


      var out = [];

      for (i = 0; i < cnt; i++) {
        var evald = this.visit(nodes[i]);

        if (evald === undefined) {
          continue;
        }

        if (!evald.splice) {
          out.push(evald);
        } else if (evald.length) {
          this.flatten(evald, out);
        }
      }

      return out;
    }
  }, {
    key: "flatten",
    value: function flatten(arr, out) {
      if (!out) {
        out = [];
      }

      var cnt;
      var i;
      var item;
      var nestedCnt;
      var j;
      var nestedItem;

      for (i = 0, cnt = arr.length; i < cnt; i++) {
        item = arr[i];

        if (item === undefined) {
          continue;
        }

        if (!item.splice) {
          out.push(item);
          continue;
        }

        for (j = 0, nestedCnt = item.length; j < nestedCnt; j++) {
          nestedItem = item[j];

          if (nestedItem === undefined) {
            continue;
          }

          if (!nestedItem.splice) {
            out.push(nestedItem);
          } else if (nestedItem.length) {
            this.flatten(nestedItem, out);
          }
        }
      }

      return out;
    }
  }]);

  return Visitor;
}();

var _default = Visitor;
exports["default"] = _default;