var assert = require('assert');

var Octree = require('./../src/octree');
var Vec3 = require('vektor').vector;
var OctreePoint = require('./../src/octreePoint');

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

  describe('intersectsSphereInDimension', function() {
    // TODO Test all three predicate statements in the method
    // See lines 41-43 starting with var match
    it('intersects top level', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      var point = new OctreePoint(new Vec3(0, 0, 0), 50);
      assert.equal(subject.minX,-100);
      assert.equal(subject.maxX, 100);

      assert.equal(point.minX, -50);
      assert.equal(point.maxX, 50);

      assert(subject.intersectsSphereInDimension(point, "x"));
    });

    it('does not intersect top level', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      var point = new OctreePoint(new Vec3(-500, -500, -500), 100);
      assert.equal(subject.minX,-100);
      assert.equal(subject.maxX, 100);
      assert.equal(point.minX, -600);
      assert.equal(point.maxX, -400);

      assert.equal(subject.intersectsSphereInDimension(point, "x"), false);
      assert.equal(subject.intersectsSphere(point), false);
    });
  });

  describe('intersectsSphere', function() {

    it('should intersect a sphere at origin', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      var point = new OctreePoint(new Vec3(0, 0, 0), 50);
      subject.insert(point);

      assert(subject.intersectsSphere(point));
    });

    it('should intersect a sphere not at origin but totally inside the octant', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      var point = new OctreePoint(new Vec3(10, 10, 10), 50);
      subject.insert(point);

      assert(subject.intersectsSphere(point));
    });    

    it('should intersect a sphere not at origin but partially inside the octant', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      var point = new OctreePoint(new Vec3(-150, 0, 0), 100);
      subject.insert(point);

      assert(subject.intersectsSphere(point));
    });
  });

  describe('collectPoints', function() {
    it('should return an array', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });
      var res = subject.collectPoints();

      assert(Array.isArray(res));
      assert.equal(res.length, 0);
    });
    
    it('should return an array with one point from an octree of depth 0 with one point', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      var point = new OctreePoint(new Vec3(1,1,1), 1);
      subject.insert(point);
      var res = subject.collectPoints();
      assert.equal(res.length, 1);
      assert.equal(res[0], point);
    });

    it('should return points from children octants', function() {
      var subject = new Octree({
        center: new Vec3(0, 0, 0),
        halfDimension: 100
      });

      var point = new OctreePoint(new Vec3(1,1,1), 1);
      var point2 = new OctreePoint(new Vec3(-1,2,3),1);

      subject.insert(point);
      subject.insert(point2);
      var res = subject.collectPoints();
      assert.equal(subject.collectPoints().length, 2);
    });
  });
});
