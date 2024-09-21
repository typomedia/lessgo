"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _contexts = _interopRequireDefault(require("../contexts"));

var _visitor = _interopRequireDefault(require("./visitor"));

var _importSequencer = _interopRequireDefault(require("./import-sequencer"));

var utils = _interopRequireWildcard(require("../utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ImportVisitor = function ImportVisitor(importer, finish) {
  this._visitor = new _visitor["default"](this);
  this._importer = importer;
  this._finish = finish;
  this.context = new _contexts["default"].Eval();
  this.importCount = 0;
  this.onceFileDetectionMap = {};
  this.recursionDetector = {};
  this._sequencer = new _importSequencer["default"](this._onSequencerEmpty.bind(this));
};

ImportVisitor.prototype = {
  isReplacing: false,
  run: function run(root) {
    try {
      // process the contents
      this._visitor.visit(root);
    } catch (e) {
      this.error = e;
    }

    this.isFinished = true;

    this._sequencer.tryRun();
  },
  _onSequencerEmpty: function _onSequencerEmpty() {
    if (!this.isFinished) {
      return;
    }

    this._finish(this.error);
  },
  visitImport: function visitImport(importNode, visitArgs) {
    var inlineCSS = importNode.options.inline;

    if (!importNode.css || inlineCSS) {
      var context = new _contexts["default"].Eval(this.context, utils.copyArray(this.context.frames));
      var importParent = context.frames[0];
      this.importCount++;

      if (importNode.isVariableImport()) {
        this._sequencer.addVariableImport(this.processImportNode.bind(this, importNode, context, importParent));
      } else {
        this.processImportNode(importNode, context, importParent);
      }
    }

    visitArgs.visitDeeper = false;
  },
  processImportNode: function processImportNode(importNode, context, importParent) {
    var evaldImportNode;
    var inlineCSS = importNode.options.inline;

    try {
      evaldImportNode = importNode.evalForImport(context);
    } catch (e) {
      if (!e.filename) {
        e.index = importNode.getIndex();
        e.filename = importNode.fileInfo().filename;
      } // attempt to eval properly and treat as css


      importNode.css = true; // if that fails, this error will be thrown

      importNode.error = e;
    }

    if (evaldImportNode && (!evaldImportNode.css || inlineCSS)) {
      if (evaldImportNode.options.multiple) {
        context.importMultiple = true;
      } // try appending if we haven't determined if it is css or not


      var tryAppendLessExtension = evaldImportNode.css === undefined;

      for (var i = 0; i < importParent.rules.length; i++) {
        if (importParent.rules[i] === importNode) {
          importParent.rules[i] = evaldImportNode;
          break;
        }
      }

      var onImported = this.onImported.bind(this, evaldImportNode, context);

      var sequencedOnImported = this._sequencer.addImport(onImported);

      this._importer.push(evaldImportNode.getPath(), tryAppendLessExtension, evaldImportNode.fileInfo(), evaldImportNode.options, sequencedOnImported);
    } else {
      this.importCount--;

      if (this.isFinished) {
        this._sequencer.tryRun();
      }
    }
  },
  onImported: function onImported(importNode, context, e, root, importedAtRoot, fullPath) {
    if (e) {
      if (!e.filename) {
        e.index = importNode.getIndex();
        e.filename = importNode.fileInfo().filename;
      }

      this.error = e;
    }

    var importVisitor = this;
    var inlineCSS = importNode.options.inline;
    var isPlugin = importNode.options.isPlugin;
    var isOptional = importNode.options.optional;
    var duplicateImport = importedAtRoot || fullPath in importVisitor.recursionDetector;

    if (!context.importMultiple) {
      if (duplicateImport) {
        importNode.skip = true;
      } else {
        importNode.skip = function () {
          if (fullPath in importVisitor.onceFileDetectionMap) {
            return true;
          }

          importVisitor.onceFileDetectionMap[fullPath] = true;
          return false;
        };
      }
    }

    if (!fullPath && isOptional) {
      importNode.skip = true;
    }

    if (root) {
      importNode.root = root;
      importNode.importedFilename = fullPath;

      if (!inlineCSS && !isPlugin && (context.importMultiple || !duplicateImport)) {
        importVisitor.recursionDetector[fullPath] = true;
        var oldContext = this.context;
        this.context = context;

        try {
          this._visitor.visit(root);
        } catch (e) {
          this.error = e;
        }

        this.context = oldContext;
      }
    }

    importVisitor.importCount--;

    if (importVisitor.isFinished) {
      importVisitor._sequencer.tryRun();
    }
  },
  visitDeclaration: function visitDeclaration(declNode, visitArgs) {
    if (declNode.value.type === 'DetachedRuleset') {
      this.context.frames.unshift(declNode);
    } else {
      visitArgs.visitDeeper = false;
    }
  },
  visitDeclarationOut: function visitDeclarationOut(declNode) {
    if (declNode.value.type === 'DetachedRuleset') {
      this.context.frames.shift();
    }
  },
  visitAtRule: function visitAtRule(atRuleNode, visitArgs) {
    this.context.frames.unshift(atRuleNode);
  },
  visitAtRuleOut: function visitAtRuleOut(atRuleNode) {
    this.context.frames.shift();
  },
  visitMixinDefinition: function visitMixinDefinition(mixinDefinitionNode, visitArgs) {
    this.context.frames.unshift(mixinDefinitionNode);
  },
  visitMixinDefinitionOut: function visitMixinDefinitionOut(mixinDefinitionNode) {
    this.context.frames.shift();
  },
  visitRuleset: function visitRuleset(rulesetNode, visitArgs) {
    this.context.frames.unshift(rulesetNode);
  },
  visitRulesetOut: function visitRulesetOut(rulesetNode) {
    this.context.frames.shift();
  },
  visitMedia: function visitMedia(mediaNode, visitArgs) {
    this.context.frames.unshift(mediaNode.rules[0]);
  },
  visitMediaOut: function visitMediaOut(mediaNode) {
    this.context.frames.shift();
  }
};
var _default = ImportVisitor;
exports["default"] = _default;