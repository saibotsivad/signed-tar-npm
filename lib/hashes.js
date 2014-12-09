var path = require('path')
  , crypto = require('crypto')
  , recursive = require('recursive-readdir')
  , fs = require('fs')
  , Q = require('q')

function generateHashesForDirectory(directory, callback) {
	recursive(path.normalize(directory), function(err, files) {
		if (!files) {
			callback('directory not found')
		} else {
			Q.all(files.map(function(file) {
				return generatePromisedHashOfFile(directory, file)
			})).then(function(hashes) {
				callback(null, hashes)
			})
		}
	})
}

function generatePromisedHashOfFile(directory, file) {
	var response = Q.defer()
	generateHashOfFile(file, function(err, hash) {
		if (err) {
			response.reject(err)
		} else {
			var fullDir = path.resolve(directory)
			var fullFile = path.resolve(file)
			response.resolve({
				hash: hash,
				name: fullFile.replace(fullDir, '').replace(/^\//, '')
			})
		}
	})
	return response.promise
}

function generateHashOfFile(file, callback) {
	fs.stat(path.normalize(file), function(err, stat) {
		if (err || !stat.isFile()) {
			callback(err || stat)
		} else {
			var shasum = crypto.createHash('sha256')
			var stream = fs.ReadStream(path.normalize(file))
			stream.on('data', function(data) {
				shasum.update(data)
			})
			stream.on('end', function() {
				callback(null, shasum.digest('hex'))
			})
		}
	})
}

module.exports = {
	generateHashesForDirectory: generateHashesForDirectory,
	generateHashOfFile: generateHashOfFile
}
