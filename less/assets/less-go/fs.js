exports.statSync = function (path) {
	var res = readFileNative(path);

	if (typeof res !== 'string') {
		throw new Error('File not found');
	}
}

exports.stat = function(path, cb) {
	var res = readFileNative(path);

	if (typeof res !== 'string') {
		cb(new Error('File not found'));
	} else {
		cb(null, {});
	}
}

exports.readFileSync = function (path, encoding) {
	return readFileNative(path);
}
