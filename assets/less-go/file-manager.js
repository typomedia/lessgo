var path = require('./path'),
    fs = require('./fs'),
    PromiseConstructor;

try {
    PromiseConstructor = typeof Promise === 'undefined' ? require('./bluebird') : Promise;
} catch(e) {
}

var AbstractFileManager = /** @class */ (function () {
    function AbstractFileManager() {
    }
    AbstractFileManager.prototype.getPath = function (filename) {
        var j = filename.lastIndexOf('?');
        if (j > 0) {
            filename = filename.slice(0, j);
        }
        j = filename.lastIndexOf('/');
        if (j < 0) {
            j = filename.lastIndexOf('\\');
        }
        if (j < 0) {
            return '';
        }
        return filename.slice(0, j + 1);
    };
    AbstractFileManager.prototype.tryAppendExtension = function (path, ext) {
        return /(\.[a-z]*$)|([\?;].*)$/.test(path) ? path : path + ext;
    };
    AbstractFileManager.prototype.tryAppendLessExtension = function (path) {
        return this.tryAppendExtension(path, '.less');
    };
    AbstractFileManager.prototype.supportsSync = function () { return false; };
    AbstractFileManager.prototype.alwaysMakePathsAbsolute = function () { return false; };
    AbstractFileManager.prototype.isPathAbsolute = function (filename) {
        return (/^(?:[a-z-]+:|\/|\\|#)/i).test(filename);
    };
    // TODO: pull out / replace?
    AbstractFileManager.prototype.join = function (basePath, laterPath) {
        if (!basePath) {
            return laterPath;
        }
        return basePath + laterPath;
    };
    AbstractFileManager.prototype.pathDiff = function (url, baseUrl) {
        // diff between two paths to create a relative path
        var urlParts = this.extractUrlParts(url);
        var baseUrlParts = this.extractUrlParts(baseUrl);
        var i;
        var max;
        var urlDirectories;
        var baseUrlDirectories;
        var diff = '';
        if (urlParts.hostPart !== baseUrlParts.hostPart) {
            return '';
        }
        max = Math.max(baseUrlParts.directories.length, urlParts.directories.length);
        for (i = 0; i < max; i++) {
            if (baseUrlParts.directories[i] !== urlParts.directories[i]) {
                break;
            }
        }
        baseUrlDirectories = baseUrlParts.directories.slice(i);
        urlDirectories = urlParts.directories.slice(i);
        for (i = 0; i < baseUrlDirectories.length - 1; i++) {
            diff += '../';
        }
        for (i = 0; i < urlDirectories.length - 1; i++) {
            diff += urlDirectories[i] + "/";
        }
        return diff;
    };
    // helper function, not part of API
    AbstractFileManager.prototype.extractUrlParts = function (url, baseUrl) {
        // urlParts[1] = protocol://hostname/ OR /
        // urlParts[2] = / if path relative to host base
        // urlParts[3] = directories
        // urlParts[4] = filename
        // urlParts[5] = parameters
        var urlPartsRegex = /^((?:[a-z-]+:)?\/{2}(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i;
        var urlParts = url.match(urlPartsRegex);
        var returner = {};
        var rawDirectories = [];
        var directories = [];
        var i;
        var baseUrlParts;
        if (!urlParts) {
            throw new Error("Could not parse sheet href - '" + url + "'");
        }
        // Stylesheets in IE don't always return the full path
        if (baseUrl && (!urlParts[1] || urlParts[2])) {
            baseUrlParts = baseUrl.match(urlPartsRegex);
            if (!baseUrlParts) {
                throw new Error("Could not parse page url - '" + baseUrl + "'");
            }
            urlParts[1] = urlParts[1] || baseUrlParts[1] || '';
            if (!urlParts[2]) {
                urlParts[3] = baseUrlParts[3] + urlParts[3];
            }
        }
        if (urlParts[3]) {
            rawDirectories = urlParts[3].replace(/\\/g, '/').split('/');
            // collapse '..' and skip '.'
            for (i = 0; i < rawDirectories.length; i++) {
                if (rawDirectories[i] === '..') {
                    directories.pop();
                }
                else if (rawDirectories[i] !== '.') {
                    directories.push(rawDirectories[i]);
                }
            }
        }
        returner.hostPart = urlParts[1];
        returner.directories = directories;
        returner.rawPath = (urlParts[1] || '') + rawDirectories.join('/');
        returner.path = (urlParts[1] || '') + directories.join('/');
        returner.filename = urlParts[4];
        returner.fileUrl = returner.path + (urlParts[4] || '');
        returner.url = returner.fileUrl + (urlParts[5] || '');
        return returner;
    };
    return AbstractFileManager;
}());

var FileManager = function() {
};

FileManager.prototype = new AbstractFileManager;

FileManager.prototype.supports = function(filename, currentDirectory, options, environment) {
    print('supports');
    return true;
};
FileManager.prototype.supportsSync = function(filename, currentDirectory, options, environment) {
    print('supportsSync');
    return true;
};

FileManager.prototype.loadFile = function(filename, currentDirectory, options, environment, callback) {
    print("loadFile");
    var fullFilename,
        data,
        isAbsoluteFilename = this.isPathAbsolute(filename),
        filenamesTried = [];

    options = options || {};

    if (options.syncImport || !PromiseConstructor) {
        print("Loading sync");
        data = this.loadFileSync(filename, currentDirectory, options, environment, 'utf-8');
        callback(data.error, data);
        return;
    }

    var paths = isAbsoluteFilename ? [""] : [currentDirectory];
    if (options.paths) { paths.push.apply(paths, options.paths); }
    if (!isAbsoluteFilename && paths.indexOf('.') === -1) { paths.push('.'); }

    // promise is guarenteed to be asyncronous
    // which helps as it allows the file handle
    // to be closed before it continues with the next file
    return new PromiseConstructor(function(fulfill, reject) {
        (function tryPathIndex(i) {
            if (i < paths.length) {
                fullFilename = filename;
                if (paths[i]) {
                    fullFilename = path.join(paths[i], fullFilename);
                }
                fs.stat(fullFilename, function (err) {
                    if (err) {
                        filenamesTried.push(fullFilename);
                        tryPathIndex(i + 1);
                    } else {
                        fs.readFile(fullFilename, 'utf-8', function(e, data) {
                            if (e) { reject(e); return; }

                            fulfill({ contents: data, filename: fullFilename});
                        });
                    }
                });
            } else {
                reject({ type: 'File', message: "'" + filename + "' wasn't found. Tried - " + filenamesTried.join(",") });
            }
        }(0));
    });
};

FileManager.prototype.loadFileSync = function(filename, currentDirectory, options, environment, encoding) {
    var fullFilename, paths, filenamesTried = [], isAbsoluteFilename = this.isPathAbsolute(filename) , data;
    options = options || {};

    paths = isAbsoluteFilename ? [""] : [currentDirectory];
    if (options.paths) {
        paths.push.apply(paths, options.paths);
    }
    if (!isAbsoluteFilename && paths.indexOf('.') === -1) {
        paths.push('.');
    }

    var err, result;
    for (var i = 0; i < paths.length; i++) {
        try {
            fullFilename = filename;
            if (paths[i]) {
                fullFilename = path.join(paths[i], fullFilename);
            }
            filenamesTried.push(fullFilename);
            fs.statSync(fullFilename);
            break;
        } catch (e) {
            fullFilename = null;
        }
    }

    if (!fullFilename) {
        err = { type: 'File', message: "'" + filename + "' wasn't found. Tried - " + filenamesTried.join(",") };
        result = { error: err };
    } else {
        data = fs.readFileSync(fullFilename, encoding);
        result = { contents: data, filename: fullFilename};
    }

    return result;
};

module.exports = FileManager;
