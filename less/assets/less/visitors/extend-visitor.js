"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tree = _interopRequireDefault(require("../tree"));

var _visitor = _interopRequireDefault(require("./visitor"));

var _logger = _interopRequireDefault(require("../logger"));

var utils = _interopRequireWildcard(require("../utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint loopfunc:true */
var ExtendFinderVisitor = /*#__PURE__*/function () {
  function ExtendFinderVisitor() {
    _classCallCheck(this, ExtendFinderVisitor);

    this._visitor = new _visitor["default"](this);
    this.contexts = [];
    this.allExtendsStack = [[]];
  }

  _createClass(ExtendFinderVisitor, [{
    key: "run",
    value: function run(root) {
      root = this._visitor.visit(root);
      root.allExtends = this.allExtendsStack[0];
      return root;
    }
  }, {
    key: "visitDeclaration",
    value: function visitDeclaration(declNode, visitArgs) {
      visitArgs.visitDeeper = false;
    }
  }, {
    key: "visitMixinDefinition",
    value: function visitMixinDefinition(mixinDefinitionNode, visitArgs) {
      visitArgs.visitDeeper = false;
    }
  }, {
    key: "visitRuleset",
    value: function visitRuleset(rulesetNode, visitArgs) {
      if (rulesetNode.root) {
        return;
      }

      var i;
      var j;
      var extend;
      var allSelectorsExtendList = [];
      var extendList; // get &:extend(.a); rules which apply to all selectors in this ruleset

      var rules = rulesetNode.rules;
      var ruleCnt = rules ? rules.length : 0;

      for (i = 0; i < ruleCnt; i++) {
        if (rulesetNode.rules[i] instanceof _tree["default"].Extend) {
          allSelectorsExtendList.push(rules[i]);
          rulesetNode.extendOnEveryPath = true;
        }
      } // now find every selector and apply the extends that apply to all extends
      // and the ones which apply to an individual extend


      var paths = rulesetNode.paths;

      for (i = 0; i < paths.length; i++) {
        var selectorPath = paths[i];
        var selector = selectorPath[selectorPath.length - 1];
        var selExtendList = selector.extendList;
        extendList = selExtendList ? utils.copyArray(selExtendList).concat(allSelectorsExtendList) : allSelectorsExtendList;

        if (extendList) {
          extendList = extendList.map(function (allSelectorsExtend) {
            return allSelectorsExtend.clone();
          });
        }

        for (j = 0; j < extendList.length; j++) {
          this.foundExtends = true;
          extend = extendList[j];
          extend.findSelfSelectors(selectorPath);
          extend.ruleset = rulesetNode;

          if (j === 0) {
            extend.firstExtendOnThisSelectorPath = true;
          }

          this.allExtendsStack[this.allExtendsStack.length - 1].push(extend);
        }
      }

      this.contexts.push(rulesetNode.selectors);
    }
  }, {
    key: "visitRulesetOut",
    value: function visitRulesetOut(rulesetNode) {
      if (!rulesetNode.root) {
        this.contexts.length = this.contexts.length - 1;
      }
    }
  }, {
    key: "visitMedia",
    value: function visitMedia(mediaNode, visitArgs) {
      mediaNode.allExtends = [];
      this.allExtendsStack.push(mediaNode.allExtends);
    }
  }, {
    key: "visitMediaOut",
    value: function visitMediaOut(mediaNode) {
      this.allExtendsStack.length = this.allExtendsStack.length - 1;
    }
  }, {
    key: "visitAtRule",
    value: function visitAtRule(atRuleNode, visitArgs) {
      atRuleNode.allExtends = [];
      this.allExtendsStack.push(atRuleNode.allExtends);
    }
  }, {
    key: "visitAtRuleOut",
    value: function visitAtRuleOut(atRuleNode) {
      this.allExtendsStack.length = this.allExtendsStack.length - 1;
    }
  }]);

  return ExtendFinderVisitor;
}();

var ProcessExtendsVisitor = /*#__PURE__*/function () {
  function ProcessExtendsVisitor() {
    _classCallCheck(this, ProcessExtendsVisitor);

    this._visitor = new _visitor["default"](this);
  }

  _createClass(ProcessExtendsVisitor, [{
    key: "run",
    value: function run(root) {
      var extendFinder = new ExtendFinderVisitor();
      this.extendIndices = {};
      extendFinder.run(root);

      if (!extendFinder.foundExtends) {
        return root;
      }

      root.allExtends = root.allExtends.concat(this.doExtendChaining(root.allExtends, root.allExtends));
      this.allExtendsStack = [root.allExtends];

      var newRoot = this._visitor.visit(root);

      this.checkExtendsForNonMatched(root.allExtends);
      return newRoot;
    }
  }, {
    key: "checkExtendsForNonMatched",
    value: function checkExtendsForNonMatched(extendList) {
      var indices = this.extendIndices;
      extendList.filter(function (extend) {
        return !extend.hasFoundMatches && extend.parent_ids.length == 1;
      }).forEach(function (extend) {
        var selector = '_unknown_';

        try {
          selector = extend.selector.toCSS({});
        } catch (_) {}

        if (!indices["".concat(extend.index, " ").concat(selector)]) {
          indices["".concat(extend.index, " ").concat(selector)] = true;

          _logger["default"].warn("extend '".concat(selector, "' has no matches"));
        }
      });
    }
  }, {
    key: "doExtendChaining",
    value: function doExtendChaining(extendsList, extendsListTarget, iterationCount) {
      //
      // chaining is different from normal extension.. if we extend an extend then we are not just copying, altering
      // and pasting the selector we would do normally, but we are also adding an extend with the same target selector
      // this means this new extend can then go and alter other extends
      //
      // this method deals with all the chaining work - without it, extend is flat and doesn't work on other extend selectors
      // this is also the most expensive.. and a match on one selector can cause an extension of a selector we had already
      // processed if we look at each selector at a time, as is done in visitRuleset
      var extendIndex;
      var targetExtendIndex;
      var matches;
      var extendsToAdd = [];
      var newSelector;
      var extendVisitor = this;
      var selectorPath;
      var extend;
      var targetExtend;
      var newExtend;
      iterationCount = iterationCount || 0; // loop through comparing every extend with every target extend.
      // a target extend is the one on the ruleset we are looking at copy/edit/pasting in place
      // e.g.  .a:extend(.b) {}  and .b:extend(.c) {} then the first extend extends the second one
      // and the second is the target.
      // the separation into two lists allows us to process a subset of chains with a bigger set, as is the
      // case when processing media queries

      for (extendIndex = 0; extendIndex < extendsList.length; extendIndex++) {
        for (targetExtendIndex = 0; targetExtendIndex < extendsListTarget.length; targetExtendIndex++) {
          extend = extendsList[extendIndex];
          targetExtend = extendsListTarget[targetExtendIndex]; // look for circular references

          if (extend.parent_ids.indexOf(targetExtend.object_id) >= 0) {
            continue;
          } // find a match in the target extends self selector (the bit before :extend)


          selectorPath = [targetExtend.selfSelectors[0]];
          matches = extendVisitor.findMatch(extend, selectorPath);

          if (matches.length) {
            extend.hasFoundMatches = true; // we found a match, so for each self selector..

            extend.selfSelectors.forEach(function (selfSelector) {
              var info = targetExtend.visibilityInfo(); // process the extend as usual

              newSelector = extendVisitor.extendSelector(matches, selectorPath, selfSelector, extend.isVisible()); // but now we create a new extend from it

              newExtend = new _tree["default"].Extend(targetExtend.selector, targetExtend.option, 0, targetExtend.fileInfo(), info);
              newExtend.selfSelectors = newSelector; // add the extend onto the list of extends for that selector

              newSelector[newSelector.length - 1].extendList = [newExtend]; // record that we need to add it.

              extendsToAdd.push(newExtend);
              newExtend.ruleset = targetExtend.ruleset; // remember its parents for circular references

              newExtend.parent_ids = newExtend.parent_ids.concat(targetExtend.parent_ids, extend.parent_ids); // only process the selector once.. if we have :extend(.a,.b) then multiple
              // extends will look at the same selector path, so when extending
              // we know that any others will be duplicates in terms of what is added to the css

              if (targetExtend.firstExtendOnThisSelectorPath) {
                newExtend.firstExtendOnThisSelectorPath = true;
                targetExtend.ruleset.paths.push(newSelector);
              }
            });
          }
        }
      }

      if (extendsToAdd.length) {
        // try to detect circular references to stop a stack overflow.
        // may no longer be needed.
        this.extendChainCount++;

        if (iterationCount > 100) {
          var selectorOne = '{unable to calculate}';
          var selectorTwo = '{unable to calculate}';

          try {
            selectorOne = extendsToAdd[0].selfSelectors[0].toCSS();
            selectorTwo = extendsToAdd[0].selector.toCSS();
          } catch (e) {}

          throw {
            message: "extend circular reference detected. One of the circular extends is currently:".concat(selectorOne, ":extend(").concat(selectorTwo, ")")
          };
        } // now process the new extends on the existing rules so that we can handle a extending b extending c extending
        // d extending e...


        return extendsToAdd.concat(extendVisitor.doExtendChaining(extendsToAdd, extendsListTarget, iterationCount + 1));
      } else {
        return extendsToAdd;
      }
    }
  }, {
    key: "visitDeclaration",
    value: function visitDeclaration(ruleNode, visitArgs) {
      visitArgs.visitDeeper = false;
    }
  }, {
    key: "visitMixinDefinition",
    value: function visitMixinDefinition(mixinDefinitionNode, visitArgs) {
      visitArgs.visitDeeper = false;
    }
  }, {
    key: "visitSelector",
    value: function visitSelector(selectorNode, visitArgs) {
      visitArgs.visitDeeper = false;
    }
  }, {
    key: "visitRuleset",
    value: function visitRuleset(rulesetNode, visitArgs) {
      if (rulesetNode.root) {
        return;
      }

      var matches;
      var pathIndex;
      var extendIndex;
      var allExtends = this.allExtendsStack[this.allExtendsStack.length - 1];
      var selectorsToAdd = [];
      var extendVisitor = this;
      var selectorPath; // look at each selector path in the ruleset, find any extend matches and then copy, find and replace

      for (extendIndex = 0; extendIndex < allExtends.length; extendIndex++) {
        for (pathIndex = 0; pathIndex < rulesetNode.paths.length; pathIndex++) {
          selectorPath = rulesetNode.paths[pathIndex]; // extending extends happens initially, before the main pass

          if (rulesetNode.extendOnEveryPath) {
            continue;
          }

          var extendList = selectorPath[selectorPath.length - 1].extendList;

          if (extendList && extendList.length) {
            continue;
          }

          matches = this.findMatch(allExtends[extendIndex], selectorPath);

          if (matches.length) {
            allExtends[extendIndex].hasFoundMatches = true;
            allExtends[extendIndex].selfSelectors.forEach(function (selfSelector) {
              var extendedSelectors;
              extendedSelectors = extendVisitor.extendSelector(matches, selectorPath, selfSelector, allExtends[extendIndex].isVisible());
              selectorsToAdd.push(extendedSelectors);
            });
          }
        }
      }

      rulesetNode.paths = rulesetNode.paths.concat(selectorsToAdd);
    }
  }, {
    key: "findMatch",
    value: function findMatch(extend, haystackSelectorPath) {
      //
      // look through the haystack selector path to try and find the needle - extend.selector
      // returns an array of selector matches that can then be replaced
      //
      var haystackSelectorIndex;
      var hackstackSelector;
      var hackstackElementIndex;
      var haystackElement;
      var targetCombinator;
      var i;
      var extendVisitor = this;
      var needleElements = extend.selector.elements;
      var potentialMatches = [];
      var potentialMatch;
      var matches = []; // loop through the haystack elements

      for (haystackSelectorIndex = 0; haystackSelectorIndex < haystackSelectorPath.length; haystackSelectorIndex++) {
        hackstackSelector = haystackSelectorPath[haystackSelectorIndex];

        for (hackstackElementIndex = 0; hackstackElementIndex < hackstackSelector.elements.length; hackstackElementIndex++) {
          haystackElement = hackstackSelector.elements[hackstackElementIndex]; // if we allow elements before our match we can add a potential match every time. otherwise only at the first element.

          if (extend.allowBefore || haystackSelectorIndex === 0 && hackstackElementIndex === 0) {
            potentialMatches.push({
              pathIndex: haystackSelectorIndex,
              index: hackstackElementIndex,
              matched: 0,
              initialCombinator: haystackElement.combinator
            });
          }

          for (i = 0; i < potentialMatches.length; i++) {
            potentialMatch = potentialMatches[i]; // selectors add " " onto the first element. When we use & it joins the selectors together, but if we don't
            // then each selector in haystackSelectorPath has a space before it added in the toCSS phase. so we need to
            // work out what the resulting combinator will be

            targetCombinator = haystackElement.combinator.value;

            if (targetCombinator === '' && hackstackElementIndex === 0) {
              targetCombinator = ' ';
            } // if we don't match, null our match to indicate failure


            if (!extendVisitor.isElementValuesEqual(needleElements[potentialMatch.matched].value, haystackElement.value) || potentialMatch.matched > 0 && needleElements[potentialMatch.matched].combinator.value !== targetCombinator) {
              potentialMatch = null;
            } else {
              potentialMatch.matched++;
            } // if we are still valid and have finished, test whether we have elements after and whether these are allowed


            if (potentialMatch) {
              potentialMatch.finished = potentialMatch.matched === needleElements.length;

              if (potentialMatch.finished && !extend.allowAfter && (hackstackElementIndex + 1 < hackstackSelector.elements.length || haystackSelectorIndex + 1 < haystackSelectorPath.length)) {
                potentialMatch = null;
              }
            } // if null we remove, if not, we are still valid, so either push as a valid match or continue


            if (potentialMatch) {
              if (potentialMatch.finished) {
                potentialMatch.length = needleElements.length;
                potentialMatch.endPathIndex = haystackSelectorIndex;
                potentialMatch.endPathElementIndex = hackstackElementIndex + 1; // index after end of match

                potentialMatches.length = 0; // we don't allow matches to overlap, so start matching again

                matches.push(potentialMatch);
              }
            } else {
              potentialMatches.splice(i, 1);
              i--;
            }
          }
        }
      }

      return matches;
    }
  }, {
    key: "isElementValuesEqual",
    value: function isElementValuesEqual(elementValue1, elementValue2) {
      if (typeof elementValue1 === 'string' || typeof elementValue2 === 'string') {
        return elementValue1 === elementValue2;
      }

      if (elementValue1 instanceof _tree["default"].Attribute) {
        if (elementValue1.op !== elementValue2.op || elementValue1.key !== elementValue2.key) {
          return false;
        }

        if (!elementValue1.value || !elementValue2.value) {
          if (elementValue1.value || elementValue2.value) {
            return false;
          }

          return true;
        }

        elementValue1 = elementValue1.value.value || elementValue1.value;
        elementValue2 = elementValue2.value.value || elementValue2.value;
        return elementValue1 === elementValue2;
      }

      elementValue1 = elementValue1.value;
      elementValue2 = elementValue2.value;

      if (elementValue1 instanceof _tree["default"].Selector) {
        if (!(elementValue2 instanceof _tree["default"].Selector) || elementValue1.elements.length !== elementValue2.elements.length) {
          return false;
        }

        for (var i = 0; i < elementValue1.elements.length; i++) {
          if (elementValue1.elements[i].combinator.value !== elementValue2.elements[i].combinator.value) {
            if (i !== 0 || (elementValue1.elements[i].combinator.value || ' ') !== (elementValue2.elements[i].combinator.value || ' ')) {
              return false;
            }
          }

          if (!this.isElementValuesEqual(elementValue1.elements[i].value, elementValue2.elements[i].value)) {
            return false;
          }
        }

        return true;
      }

      return false;
    }
  }, {
    key: "extendSelector",
    value: function extendSelector(matches, selectorPath, replacementSelector, isVisible) {
      // for a set of matches, replace each match with the replacement selector
      var currentSelectorPathIndex = 0;
      var currentSelectorPathElementIndex = 0;
      var path = [];
      var matchIndex;
      var selector;
      var firstElement;
      var match;
      var newElements;

      for (matchIndex = 0; matchIndex < matches.length; matchIndex++) {
        match = matches[matchIndex];
        selector = selectorPath[match.pathIndex];
        firstElement = new _tree["default"].Element(match.initialCombinator, replacementSelector.elements[0].value, replacementSelector.elements[0].isVariable, replacementSelector.elements[0].getIndex(), replacementSelector.elements[0].fileInfo());

        if (match.pathIndex > currentSelectorPathIndex && currentSelectorPathElementIndex > 0) {
          path[path.length - 1].elements = path[path.length - 1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
          currentSelectorPathElementIndex = 0;
          currentSelectorPathIndex++;
        }

        newElements = selector.elements.slice(currentSelectorPathElementIndex, match.index).concat([firstElement]).concat(replacementSelector.elements.slice(1));

        if (currentSelectorPathIndex === match.pathIndex && matchIndex > 0) {
          path[path.length - 1].elements = path[path.length - 1].elements.concat(newElements);
        } else {
          path = path.concat(selectorPath.slice(currentSelectorPathIndex, match.pathIndex));
          path.push(new _tree["default"].Selector(newElements));
        }

        currentSelectorPathIndex = match.endPathIndex;
        currentSelectorPathElementIndex = match.endPathElementIndex;

        if (currentSelectorPathElementIndex >= selectorPath[currentSelectorPathIndex].elements.length) {
          currentSelectorPathElementIndex = 0;
          currentSelectorPathIndex++;
        }
      }

      if (currentSelectorPathIndex < selectorPath.length && currentSelectorPathElementIndex > 0) {
        path[path.length - 1].elements = path[path.length - 1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
        currentSelectorPathIndex++;
      }

      path = path.concat(selectorPath.slice(currentSelectorPathIndex, selectorPath.length));
      path = path.map(function (currentValue) {
        // we can re-use elements here, because the visibility property matters only for selectors
        var derived = currentValue.createDerived(currentValue.elements);

        if (isVisible) {
          derived.ensureVisibility();
        } else {
          derived.ensureInvisibility();
        }

        return derived;
      });
      return path;
    }
  }, {
    key: "visitMedia",
    value: function visitMedia(mediaNode, visitArgs) {
      var newAllExtends = mediaNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
      newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, mediaNode.allExtends));
      this.allExtendsStack.push(newAllExtends);
    }
  }, {
    key: "visitMediaOut",
    value: function visitMediaOut(mediaNode) {
      var lastIndex = this.allExtendsStack.length - 1;
      this.allExtendsStack.length = lastIndex;
    }
  }, {
    key: "visitAtRule",
    value: function visitAtRule(atRuleNode, visitArgs) {
      var newAllExtends = atRuleNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
      newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, atRuleNode.allExtends));
      this.allExtendsStack.push(newAllExtends);
    }
  }, {
    key: "visitAtRuleOut",
    value: function visitAtRuleOut(atRuleNode) {
      var lastIndex = this.allExtendsStack.length - 1;
      this.allExtendsStack.length = lastIndex;
    }
  }]);

  return ProcessExtendsVisitor;
}();

var _default = ProcessExtendsVisitor;
exports["default"] = _default;