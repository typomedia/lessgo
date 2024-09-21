"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Plugin Manager
 */
var PluginManager = /*#__PURE__*/function () {
  function PluginManager(less) {
    _classCallCheck(this, PluginManager);
    this.less = less;
    this.visitors = [];
    this.preProcessors = [];
    this.postProcessors = [];
    this.installedPlugins = [];
    this.fileManagers = [];
    this.iterator = -1;
    this.pluginCache = {};
    this.Loader = new less.PluginLoader(less);
  }

  /**
   * Adds all the plugins in the array
   * @param {Array} plugins
   */
  return _createClass(PluginManager, [{
    key: "addPlugins",
    value: function addPlugins(plugins) {
      if (plugins) {
        for (var i = 0; i < plugins.length; i++) {
          this.addPlugin(plugins[i]);
        }
      }
    }

    /**
     *
     * @param plugin
     * @param {String} filename
     */
  }, {
    key: "addPlugin",
    value: function addPlugin(plugin, filename, functionRegistry) {
      this.installedPlugins.push(plugin);
      if (filename) {
        this.pluginCache[filename] = plugin;
      }
      if (plugin.install) {
        plugin.install(this.less, this, functionRegistry || this.less.functions.functionRegistry);
      }
    }

    /**
     *
     * @param filename
     */
  }, {
    key: "get",
    value: function get(filename) {
      return this.pluginCache[filename];
    }

    /**
     * Adds a visitor. The visitor object has options on itself to determine
     * when it should run.
     * @param visitor
     */
  }, {
    key: "addVisitor",
    value: function addVisitor(visitor) {
      this.visitors.push(visitor);
    }

    /**
     * Adds a pre processor object
     * @param {object} preProcessor
     * @param {number} priority - guidelines 1 = before import, 1000 = import, 2000 = after import
     */
  }, {
    key: "addPreProcessor",
    value: function addPreProcessor(preProcessor, priority) {
      var indexToInsertAt;
      for (indexToInsertAt = 0; indexToInsertAt < this.preProcessors.length; indexToInsertAt++) {
        if (this.preProcessors[indexToInsertAt].priority >= priority) {
          break;
        }
      }
      this.preProcessors.splice(indexToInsertAt, 0, {
        preProcessor: preProcessor,
        priority: priority
      });
    }

    /**
     * Adds a post processor object
     * @param {object} postProcessor
     * @param {number} priority - guidelines 1 = before compression, 1000 = compression, 2000 = after compression
     */
  }, {
    key: "addPostProcessor",
    value: function addPostProcessor(postProcessor, priority) {
      var indexToInsertAt;
      for (indexToInsertAt = 0; indexToInsertAt < this.postProcessors.length; indexToInsertAt++) {
        if (this.postProcessors[indexToInsertAt].priority >= priority) {
          break;
        }
      }
      this.postProcessors.splice(indexToInsertAt, 0, {
        postProcessor: postProcessor,
        priority: priority
      });
    }

    /**
     *
     * @param manager
     */
  }, {
    key: "addFileManager",
    value: function addFileManager(manager) {
      this.fileManagers.push(manager);
    }

    /**
     *
     * @returns {Array}
     * @private
     */
  }, {
    key: "getPreProcessors",
    value: function getPreProcessors() {
      var preProcessors = [];
      for (var i = 0; i < this.preProcessors.length; i++) {
        preProcessors.push(this.preProcessors[i].preProcessor);
      }
      return preProcessors;
    }

    /**
     *
     * @returns {Array}
     * @private
     */
  }, {
    key: "getPostProcessors",
    value: function getPostProcessors() {
      var postProcessors = [];
      for (var i = 0; i < this.postProcessors.length; i++) {
        postProcessors.push(this.postProcessors[i].postProcessor);
      }
      return postProcessors;
    }

    /**
     *
     * @returns {Array}
     * @private
     */
  }, {
    key: "getVisitors",
    value: function getVisitors() {
      return this.visitors;
    }
  }, {
    key: "visitor",
    value: function visitor() {
      var self = this;
      return {
        first: function first() {
          self.iterator = -1;
          return self.visitors[self.iterator];
        },
        get: function get() {
          self.iterator += 1;
          return self.visitors[self.iterator];
        }
      };
    }

    /**
     *
     * @returns {Array}
     * @private
     */
  }, {
    key: "getFileManagers",
    value: function getFileManagers() {
      return this.fileManagers;
    }
  }]);
}();
var pm;
function PluginManagerFactory(less, newFactory) {
  if (newFactory || !pm) {
    pm = new PluginManager(less);
  }
  return pm;
}
;

//
var _default = exports["default"] = PluginManagerFactory;