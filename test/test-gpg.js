var gpg = require('../lib/gpg.js')
  , test = require('tap').test
  , expected = require('./expected.json')
  , options = require('./options.json')

test('generating user public key hash for existing user', function(t) {
	t.plan(2)

	gpg.generatePublicKeyFingerprint(options, function(err, fingerprint) {
		t.notOk(err, 'should not throw error')
		t.equals(fingerprint, expected.key, 'should have the right fingerprint')
	})

})

test('generating user public key hash for non-existant user', function(t) {
	t.plan(2)

	gpg.generatePublicKeyFingerprint({
		dir: options.dir,
		user: 'TotallyNotRealUserName'
	}, function(err, hash) {
		t.ok(err, 'should throw error')
		t.notOk(hash, 'should not have a hash')
	})

})
