exports.statSync = function (path) {
	var res = readFile(path);
	if (typeof res !== 'string') {
		throw new Error('File not found');
	}
}

exports.readFileSync = function (path, encoding) {
	return readFile(path);
}
