var assert = require('assert');

var Octree = require('./../src/octree');
var Vec3 = require('vektor').vector;

describe('Octree', function() {

  describe('Initialization', function() {

    it('should instantiate properly', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      assert(subject instanceof Octree);
    });
  });

  describe('adding a point', function() {
    it('should be able to add and retrieve a point', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      var testPoint = new Vec3(10, 10, 10);
      subject.insert(testPoint);

      assert.equal(subject.point.x, 10);
    });
    
  })
});
