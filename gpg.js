var run = require('child_process').exec
  , path = require('path')
  , crypto = require('crypto')
  , fs = require('fs')

function generateHashOfPublicKey(options, callback) {
	options = options || {}

	if (!options.user) {
		return callback('user name/email is required')
	}

	run('gpg --export ' + options.user + ' | shasum -a 256', function(error, stdout, stderr) {
		if (stderr || error) {
			callback(stderr || error)
		} else {
			// expected command line output is: the hash followed by some spaces and a file name or dash for streams
			callback(null, stdout.split('\n')[0].replace(/(^[a-z0-9]{64}).*/, '$1'))
		}
	})
}

function generateSignatureOfFile(options, callback) {
	options = options || {}

	if (!options.user) {
		return callback('user name/email is required')
	} else if (!options.file) {
		return callback('file path is required')
	}

	options.file = path.normalize(options.file)

	run('gpg --local-user ' + options.user + ' --detach-sign --sign ' + options.file, function(error, stdout, stderr) {
		callback(stderr || error)
	})
}

module.exports = {
	generateHashOfPublicKey: generateHashOfPublicKey,
	generateSignatureOfFile: generateSignatureOfFile
}
