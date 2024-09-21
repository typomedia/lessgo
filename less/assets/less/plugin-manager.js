"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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


  _createClass(PluginManager, [{
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

  return PluginManager;
}();

var pm;

function PluginManagerFactory(less, newFactory) {
  if (newFactory || !pm) {
    pm = new PluginManager(less);
  }

  return pm;
}

; //

var _default = PluginManagerFactory;
exports["default"] = _default;