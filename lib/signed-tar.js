var gpg = require('./gpg.js')
  , manifest = require('./manifest.js')
  , tar = require('tar')
  , fs = require('fs')
  , fstream = require('fstream')
  , path = require('path')

function generateSignedTar(options, callback) {
	options = options || {}

	if (!options.user) {
		callback('must specify gpg user using name or email')
	} else if (!options.dir) {
		callback('must specify directory to package')
	}

	manifest.generateManifestInDirectory({
		user: options.user,
		dir: options.dir
	}, function(err, file) {
		if (err) {
			callback(err)
		} else {
			gpg.generateSignatureOfFile({
				user: options.user,
				file: path.join(options.dir, '_manifest')
			}, function(err) {
				if (err) {
					callback(err)
				} else {
					var dirDest = fs.createWriteStream(options.dir + '.stf')
					var packer = tar.Pack({ noProprietary: true })
						.on('error', callback)
						.on('end', function() {
							callback(false)
						});
					fstream.Reader({ path: options.dir, type: "Directory" })
						.on('error', callback)
						.pipe(packer)
						.pipe(dirDest)
				}
			})
		}
	})

}

module.exports = generateSignedTar
