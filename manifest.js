var hashes = require('./hashes.js')
  , gpg = require('./gpg.js')
  , path = require('path')
  , fs = require('fs')
  , Q = require('q')

function generateManifestObject(options, callback) {
	options = options || {}

	if (!options.dir) {
		return callback('directory of package required')
	} else if (!options.user) {
		return callback('user name/email of signer required')
	}

	var fileHashes
	var fileHashesPromise = generateFileHashesPromise(options.dir).then(function(hashes) {
		fileHashes = hashes
	})
	var userKeyHash
	var userKeyHashPromise = generateUserKeyHashPromise(options).then(function(hash) {
		userKeyHash = hash
	})

	Q.all([ fileHashesPromise, userKeyHashPromise ]).then(function() {
		callback(null, {
			header: '[manifest]',
			key: userKeyHash,
			files: fileHashes
		})
	})

}

function generateFileHashesPromise(directory) {
	var response = Q.defer()
	hashes.generateHashesForDirectory(directory, function(err, hashes) {
		if (err) {
			response.reject(err)
		} else {
			response.resolve(hashes)
		}
	})
	return response.promise
}

function generateUserKeyHashPromise(options) {
	var response = Q.defer()
	gpg.generateHashOfPublicKey(options, function(err, hash) {
		if (err) {
			response.reject(err)
		} else {
			response.resolve(hash)
		}
	})
	return response.promise
}

function generateManifestInDirectory(options, callback) {
	generateManifestString(options, function(err, string) {
		fs.writeFile(path.join(options.dir, '_manifest'), string, callback)
	})
}

function generateManifestString(options, callback) {
	generateManifestObject(options, function(err, obj) {
		if (err) {
			callback(err)
		} else {
			var lines = [
				obj.header,
				'key=' + obj.key
			].concat(obj.files.map(function(file) {
				return file.hash + '=' + file.name
			}))
			callback(null, lines.join('\n'))
		}
	})
}

module.exports = {
	generateManifestObject: generateManifestObject,
	generateManifestString: generateManifestString,
	generateManifestInDirectory: generateManifestInDirectory
}
