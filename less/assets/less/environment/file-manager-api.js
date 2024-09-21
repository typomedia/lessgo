"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  /**
   * Given the full path to a file, return the path component
   * Provided by AbstractFileManager
   * @param {string} filename
   * @returns {string}
   */
  getPath: function getPath(filename) {},

  /**
   * Append a .less extension if appropriate. Only called if less thinks one could be added.
   * Provided by AbstractFileManager
   * @param filename
   * @returns {string}
   */
  tryAppendLessExtension: function tryAppendLessExtension(filename) {},

  /**
   * Whether the rootpath should be converted to be absolute.
   * The browser ovverides this to return true because urls must be absolute.
   * Provided by AbstractFileManager (returns false)
   * @returns {bool}
   */
  alwaysMakePathsAbsolute: function alwaysMakePathsAbsolute() {},

  /**
   * Returns whether a path is absolute
   * Provided by AbstractFileManager
   * @param {string} path
   * @returns {bool}
   */
  isPathAbsolute: function isPathAbsolute(path) {},

  /**
   * joins together 2 paths
   * Provided by AbstractFileManager
   * @param {string} basePath
   * @param {string} laterPath
   */
  join: function join(basePath, laterPath) {},

  /**
   * Returns the difference between 2 paths
   * E.g. url = a/ baseUrl = a/b/ returns ../
   * url = a/b/ baseUrl = a/ returns b/
   * Provided by AbstractFileManager
   * @param {string} url
   * @param {string} baseUrl
   * @returns {string}
   */
  pathDiff: function pathDiff(url, baseUrl) {},

  /**
   * Returns whether this file manager supports this file for syncronous file retrieval
   * If true is returned, loadFileSync will then be called with the file.
   * Provided by AbstractFileManager (returns false)
   * @param {string} filename
   * @param {string} currentDirectory
   * @param {object} options
   * @param {less.environment.environment} environment
   * @returns {bool}
   */
  supportsSync: function supportsSync(filename, currentDirectory, options, environment) {},

  /**
   *
   * @param {string} filename
   * @param {string} currentDirectory
   * @param {object} options
   * @param {less.environment.environment} environment
   * @returns {bool}
   */
  supports: function supports(filename, currentDirectory, options, environment) {},

  /**
   * Loads a file asynchronously. Expects a promise that either rejects with an error or fulfills with an
   * object containing
   *  { filename: - full resolved path to file
   *    contents: - the contents of the file, as a string }
   *
   * @param {string} filename
   * @param {string} currentDirectory
   * @param {object} options
   * @param {less.environment.environment} environment
   * @returns {Promise}
   */
  loadFile: function loadFile(filename, currentDirectory, options, environment) {},

  /**
   * Loads a file synchronously. Expects an immediate return with an object containing
   *  { error: - error object if an error occurs
   *    filename: - full resolved path to file
   *    contents: - the contents of the file, as a string }
   *
   * @param {string} filename
   * @param {string} currentDirectory
   * @param {object} options
   * @param {less.environment.environment} environment
   * @returns {object} should be an object containing error or contents and filename
   */
  loadFileSync: function loadFileSync(filename, currentDirectory, options, environment) {}
};
exports["default"] = _default;