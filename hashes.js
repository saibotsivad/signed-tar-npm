var path = require('path')
  , crypto = require('crypto')
  , recursive = require('recursive-readdir')
  , fs = require('fs')
  , Q = require('q')

function generateHashesForDirectory(directory, callback) {
	recursive(path.normalize(directory), function(err, files) {
		Q.all(files.map(function(file) {
			return generatePromisedHashOfFile(directory, file)
		})).then(function(hashes) {
			callback(null, hashes)
		})
	})
}

function generatePromisedHashOfFile(directory, file) {
	var response = Q.defer()
	generateHashOfFile(file, function(hash) {
		response.resolve({
			hash: hash,
			name: file.replace(directory, '').replace(/^\//, '')
		})
	})
	return response.promise
}

function generateHashOfFile(file, callback) {
	var shasum = crypto.createHash('sha256')
	var stream = fs.ReadStream(path.normalize(file))
	stream.on('data', function(data) {
		shasum.update(data)
	})
	stream.on('end', function() {
		callback(shasum.digest('hex'))
	})
}

module.exports = {
	generateHashesForDirectory: generateHashesForDirectory,
	generateHashOfFile: generateHashOfFile
}
