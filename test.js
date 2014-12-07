// var gpg = require('./gpg.js')
// var hashes = require('./hashes.js')
// var manifest = require('./manifest.js')

// gpg.generateHashOfPublicKey({
// 	user: 'john'
// }, function(err, hash) {
// 	console.log(err || hash)
// })

// gpg.generateSignatureOfFile({
// 	user: 'john',
// 	file: '/Users/saibotsivad/Development/git/signed-tar/example/package/_manifest'
// }, function(err) {
// 	console.log(err || 'done signing')
// })

// gpg.generateHashOfFile({
// 	file: 'example/package/file.ext',
// 	dir: '/Users/saibotsivad/Development/git/signed-tar'
// }, function(err, hash) {
// 	console.log(err || hash)
// })

// hashes.generateHashesForDirectory('/Users/saibotsivad/Development/git/signed-tar/example/package/', function(err, hashes) {
// 	console.log(hashes)
// }) 

// manifest.generateManifestObject({
// 	user: 'john',
// 	dir: '/Users/saibotsivad/Development/git/signed-tar/example/package2/'
// }, function(err, obj) {
// 	console.log(err || obj)
// })

// manifest.generateManifestString({
// 	user: 'john',
// 	dir: '/Users/saibotsivad/Development/git/signed-tar/example/package2/'
// }, function(err, string) {
// 	console.log(err || string)
// })

// var user = 'john'
//   , dir = '/Users/saibotsivad/Development/git/signed-tar/example/package2/'

// manifest.generateManifestInDirectory({
// 	user: user,
// 	dir: dir
// }, function(err, file) {
// 	if (err) {
// 		console.log(err)
// 	} else {
// 		gpg.generateSignatureOfFile({
// 			user: user,
// 			file: dir + '_manifest'
// 		}, function(err) {
// 			console.log(err || 'done signing')
// 		})
// 	}
// })

var sigtar = require('./index.js')

sigtar({
	user: 'john',
	dir: '/Users/saibotsivad/Development/git/signed-tar/example/package2'
}, function(err) {
	if (err) {
		console.log('Error! ', err)
	} else {
		console.log('Directory signed and packed!')
	}
})




