"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Node = /*#__PURE__*/function () {
  function Node() {
    _classCallCheck(this, Node);

    this.parent = null;
    this.visibilityBlocks = undefined;
    this.nodeVisible = undefined;
    this.rootNode = null;
    this.parsed = null;
    var self = this;
    Object.defineProperty(this, 'currentFileInfo', {
      get: function get() {
        return self.fileInfo();
      }
    });
    Object.defineProperty(this, 'index', {
      get: function get() {
        return self.getIndex();
      }
    });
  }

  _createClass(Node, [{
    key: "setParent",
    value: function setParent(nodes, parent) {
      function set(node) {
        if (node && node instanceof Node) {
          node.parent = parent;
        }
      }

      if (Array.isArray(nodes)) {
        nodes.forEach(set);
      } else {
        set(nodes);
      }
    }
  }, {
    key: "getIndex",
    value: function getIndex() {
      return this._index || this.parent && this.parent.getIndex() || 0;
    }
  }, {
    key: "fileInfo",
    value: function fileInfo() {
      return this._fileInfo || this.parent && this.parent.fileInfo() || {};
    }
  }, {
    key: "isRulesetLike",
    value: function isRulesetLike() {
      return false;
    }
  }, {
    key: "toCSS",
    value: function toCSS(context) {
      var strs = [];
      this.genCSS(context, {
        add: function add(chunk, fileInfo, index) {
          strs.push(chunk);
        },
        isEmpty: function isEmpty() {
          return strs.length === 0;
        }
      });
      return strs.join('');
    }
  }, {
    key: "genCSS",
    value: function genCSS(context, output) {
      output.add(this.value);
    }
  }, {
    key: "accept",
    value: function accept(visitor) {
      this.value = visitor.visit(this.value);
    }
  }, {
    key: "eval",
    value: function _eval() {
      return this;
    }
  }, {
    key: "_operate",
    value: function _operate(context, op, a, b) {
      switch (op) {
        case '+':
          return a + b;

        case '-':
          return a - b;

        case '*':
          return a * b;

        case '/':
          return a / b;
      }
    }
  }, {
    key: "fround",
    value: function fround(context, value) {
      var precision = context && context.numPrecision; // add "epsilon" to ensure numbers like 1.000000005 (represented as 1.000000004999...) are properly rounded:

      return precision ? Number((value + 2e-16).toFixed(precision)) : value;
    } // Returns true if this node represents root of ast imported by reference

  }, {
    key: "blocksVisibility",
    value: function blocksVisibility() {
      if (this.visibilityBlocks == null) {
        this.visibilityBlocks = 0;
      }

      return this.visibilityBlocks !== 0;
    }
  }, {
    key: "addVisibilityBlock",
    value: function addVisibilityBlock() {
      if (this.visibilityBlocks == null) {
        this.visibilityBlocks = 0;
      }

      this.visibilityBlocks = this.visibilityBlocks + 1;
    }
  }, {
    key: "removeVisibilityBlock",
    value: function removeVisibilityBlock() {
      if (this.visibilityBlocks == null) {
        this.visibilityBlocks = 0;
      }

      this.visibilityBlocks = this.visibilityBlocks - 1;
    } // Turns on node visibility - if called node will be shown in output regardless
    // of whether it comes from import by reference or not

  }, {
    key: "ensureVisibility",
    value: function ensureVisibility() {
      this.nodeVisible = true;
    } // Turns off node visibility - if called node will NOT be shown in output regardless
    // of whether it comes from import by reference or not

  }, {
    key: "ensureInvisibility",
    value: function ensureInvisibility() {
      this.nodeVisible = false;
    } // return values:
    // false - the node must not be visible
    // true - the node must be visible
    // undefined or null - the node has the same visibility as its parent

  }, {
    key: "isVisible",
    value: function isVisible() {
      return this.nodeVisible;
    }
  }, {
    key: "visibilityInfo",
    value: function visibilityInfo() {
      return {
        visibilityBlocks: this.visibilityBlocks,
        nodeVisible: this.nodeVisible
      };
    }
  }, {
    key: "copyVisibilityInfo",
    value: function copyVisibilityInfo(info) {
      if (!info) {
        return;
      }

      this.visibilityBlocks = info.visibilityBlocks;
      this.nodeVisible = info.nodeVisible;
    }
  }]);

  return Node;
}();

Node.compare = function (a, b) {
  /* returns:
   -1: a < b
   0: a = b
   1: a > b
   and *any* other value for a != b (e.g. undefined, NaN, -2 etc.) */
  if (a.compare && // for "symmetric results" force toCSS-based comparison
  // of Quoted or Anonymous if either value is one of those
  !(b.type === 'Quoted' || b.type === 'Anonymous')) {
    return a.compare(b);
  } else if (b.compare) {
    return -b.compare(a);
  } else if (a.type !== b.type) {
    return undefined;
  }

  a = a.value;
  b = b.value;

  if (!Array.isArray(a)) {
    return a === b ? 0 : undefined;
  }

  if (a.length !== b.length) {
    return undefined;
  }

  for (var i = 0; i < a.length; i++) {
    if (Node.compare(a[i], b[i]) !== 0) {
      return undefined;
    }
  }

  return 0;
};

Node.numericCompare = function (a, b) {
  return a < b ? -1 : a === b ? 0 : a > b ? 1 : undefined;
};

var _default = Node;
exports["default"] = _default;