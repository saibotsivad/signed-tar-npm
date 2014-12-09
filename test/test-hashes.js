var hashes = require('../lib/hashes.js')
  , test = require('tap').test
  , expected = require('./expected.json').files
  , options = require('./options.json')
  , path = require('path')

test('hashing an existing file', function(t) {
	t.plan(2)

	hashes.generateHashOfFile(path.join(options.dir, 'file.ext'), function(err, hash) {
		t.notOk(err, 'should not throw an error')
		t.equals(hash, expected[0].hash, 'should give the correct value')
	})
})

test('hashing a non-existant file', function(t) {
	t.plan(2)

	hashes.generateHashOfFile(path.join(options.dir, 'file-does-not-exist.ext'), function(err, hash) {
		t.notOk(hash, 'should not create a hash')
		t.ok(err, 'should give an error')
	})

})

test('hashing an existing directory', function(t) {
	t.plan(6)

	// Note: Sometimes on Mac computers, a file named ".DS_Store" is auto-generate as
	// part of the Mac system. You'll need that file to be gone, to run this test.
	hashes.generateHashesForDirectory(options.dir, function(err, hashes) {
		t.notOk(err, 'should not throw an error')
		t.equal(2, hashes.length, 'should create 2 hashes')
		t.equals(hashes[0].hash, expected[0].hash, 'should give the correct hash')
		t.equals(hashes[1].name, expected[1].name, 'should give the correct file path')
		t.equals(hashes[0].hash, expected[0].hash, 'should give the correct hash')
		t.equals(hashes[1].name, expected[1].name, 'should give the correct file path')
	})
})

test('hashing a non-existing directory', function(t) {
	t.plan(2)

	hashes.generateHashesForDirectory('./folder-does-not-exist/', function(err, hashes) {
		t.ok(err, 'should throw an error')
		t.notOk(hashes, 'should not create hashes')
	})

})
