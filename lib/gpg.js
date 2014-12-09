var run = require('child_process').exec
  , path = require('path')
  , fs = require('fs')

function generatePublicKeyFingerprint(options, callback) {
	options = options || {}

	if (!options.user) {
		return callback('user name/email is required')
	}

	run('gpg --fingerprint "' + options.user + '"', function(error, stdout, stderr) {
		if (stderr || error) {
			callback(stderr || error)
		} else {
			var regex = /^pub.*?[\r\n]+\s*key\sfingerprint\s*=\s*(([0-9a-z]{4}[\s\r\n]*){10})$/igm
			var fingerprint = regex.exec(stdout)
			if (fingerprint) {
				callback(null, fingerprint[1].replace(/\s/g, '').toLowerCase())
			} else {
				callback('public key fingerprint not found')
			}
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

	run('gpg --local-user "' + options.user + '" --detach-sign --sign ' + options.file, function(error, stdout, stderr) {
		callback(stderr || error)
	})
}

module.exports = {
	generatePublicKeyFingerprint: generatePublicKeyFingerprint,
	generateSignatureOfFile: generateSignatureOfFile
}
