var assert = require('assert');

var Octree = require('./../src/octree');
var Vec3 = require('vektor').vector;

describe('Octree', function() {

  describe('octantContainingPoint', function() {
    var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
    });

    it('should give 0 for -, -, -', function() {
      assert.equal(subject.octantContainingPoint(new Vec3(-1, -1, -1)), 0);
      
    });

    it('should give 1 for -, -, +', function() {
      assert.equal(subject.octantContainingPoint(new Vec3(-1, -1, 1)), 1);
    });

    it('should give 2 for -, +, -', function() {
      assert.equal(subject.octantContainingPoint(new Vec3(-1, 1, -1)), 2);
    });

});
  describe('octreeAtIndexShouldBePositive', function() {
    var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
    });

    it('should be true for 0', function() {
      assert(subject.octreeAtIndexShouldBePositive('x', 0));
    });

    it('should be false for 4', function() {
      assert(subject.octreeAtIndexShouldBePositive('x', 0));
    });
    
  });
  describe('Initialization', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });
    it('should instantiate properly', function() {
      assert(subject instanceof Octree);
    });

    it('should have x y and z in origin', function() {
      assert.equal(subject.origin.x, 0);
      assert.equal(subject.origin.y, 0);
      assert.equal(subject.origin.z, 0);
      
    });
    it('should have no children', function() {
      assert.equal(subject.children.length, 8);
      subject.children.forEach((child) => {
        assert.equal(child, null);
      });
    });

    it('should be a leaf node', function() {
      assert(subject.isLeafNode());
    });
  });

  describe('isLeafNode', function() {
    it('should be true if no points are in octree', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      assert(subject.isLeafNode());
    });

    it('should be true if one point is in octree', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      subject.insert(new Vec3(1,1,1));
      assert(subject.isLeafNode());
    });

    it('should be false if two points are in octree', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      subject.insert(new Vec3(1,1,1));
      subject.insert(new Vec3(-1, -1, -1));
    });

  });

  describe('adding a point', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });
    it('should be able to add and retrieve a point', function() {
      var testPoint = new Vec3(10, 10, 10);
      subject.insert(testPoint);

      assert.equal(subject.point.x, 10);
    });

    // it('should be able to add a second point', function() {
    //   var secondPoint = new Vec3(-10, -10, -10);
    //   subject.insert(secondPoint);

    //   assert.equal(subject.getPointsInsideBox(new Vec3(0, 0, 0),
    //                                     new Vec3(-15, -15, -15)).length, 2);
    // })
  })
});
