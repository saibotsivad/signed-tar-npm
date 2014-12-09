var manifest = require('../lib/manifest.js')
  , test = require('tap').test
  , expected = require('./expected.json')
  , options = require('./options.json')

test('generating manifest object for directory', function(t) {
	t.plan(4)

	manifest.generateManifestObject(options, function(err, man) {
		t.notOk(err, 'should not throw error')
		t.equals(man.header, expected.header, 'should have header')
		t.equals(man.key, expected.key, 'hash of users public key should be correct')
		t.equals(man.files.length, 2, 'should have 2 files')
	})

})

test('generating manifest string for directory', function(t) {
	t.plan(2)

	var expectedString = [
		expected.header,
		'key=' + expected.key
	].concat(expected.files.map(function(h) {
		return h.hash + '=' + h.name
	})).join('\n')

	manifest.generateManifestString(options, function(err, string) {
		t.notOk(err, 'should not throw error')
		t.equals(expectedString, string, 'should have string as expected')
	})

})

test('generating manifest object for non-existent directory', function(t) {
	t.plan(2)

	manifest.generateManifestObject({
		dir: './folder-does-not-exist/',
		user: options.user
	}, function(err, man) {
		t.ok(err, 'should throw error')
		t.notOk(man, 'should not generate manifest')
	})

})

test('generating manifest object for non-existent user', function(t) {
	t.plan(2)

	manifest.generateManifestObject({
		dir: options.dir,
		user: 'UserWhoDoesNotExistInOurSystem'
	}, function(err, man) {
		t.ok(err, 'should throw error')
		t.notOk(man, 'should not generate manifest')
	})

})
