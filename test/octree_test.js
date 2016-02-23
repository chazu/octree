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

  describe('insert', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });
    it('should be able to add and retrieve a point', function() {
      var testPoint = new Vec3(10, 10, 10);
      subject.insert(testPoint);

      assert(!(subject.point === null));
      assert.equal(subject.point.x, 10);
    });

    it('should be able to add a second point', function() {
      var secondPoint = new Vec3(-10, -10, -10);
      subject.insert(secondPoint);

      assert.equal(subject.point, null);
      assert.equal(subject.children[0].point.x, -10);
      assert.equal(subject.children[7].point.x, 10);
    });

    it('should blow up on insertion of a point which already exists', function() {
      var duplicatePoint = new Vec3(-10, -10, -10);
      assert.throws(() => subject.insert(duplicatePoint), Error);
    });
  });

  describe('safeInsert', function() {
    // TODO
  });

  describe('getPoint', function() {
    it('should get a point if it exists', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });
      var testPoint = new Vec3(10, 10, 10);
      subject.insert(testPoint);

      assert(subject.point.x === 10);
      assert(subject.getPoint(testPoint));
      assert(subject.getPoint(testPoint).x === 10);
    });

  });
  describe('getPointsInsideBox', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });
    var testPoint = new Vec3(10, 10, 10);
    var secondPoint = new Vec3(-10, -10, -10);
    it('should get a point from an octree with one point', function() {
      subject.insert(testPoint);
      assert.equal(subject.getPointsInsideBox(new Vec3(-10, -10, -10),
                                              new Vec3(10, 10, 10)).length, 1);

    });

    it('should get two points from an octree with two points', function() {
      subject.insert(secondPoint);
      assert.equal(subject.getPointsInsideBox(new Vec3(-10, -10, -10),
                                              new Vec3(10, 10, 10)).length, 2);
    });
  });
});
