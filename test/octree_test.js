"use strict";

var assert = require('assert');
let _ = require('lodash');

let Octree = require('./../src/octree');
let Vec3 = require('vektor').vector;
let OctreePoint = require('./../src/octreePoint');

describe('Octree', function() {

  describe('depth', function() {
    it('should return 1 for an empty root Octree', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });
      assert.equal(subject.depth(), 1);
    });

    it('should return 1 for an Octree with breakpoint-1', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100,
        breakpoint: 4
      });

      subject.insert(new OctreePoint(new Vec3(10, 5, 4), 1));
      subject.insert(new OctreePoint(new Vec3(-10, 1, 1), 1));
      subject.insert(new OctreePoint(new Vec3(10, -5, 4), 1));
      assert.equal(subject.depth(), 1);
    });
    

    it('should return 2 for an octree with breakpoint+1 points', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100,
        breakpoint: 4
      });

      subject.insert(new OctreePoint(new Vec3(10, 5, 4), 1));
      subject.insert(new OctreePoint(new Vec3(-10, 1, 1), 1));
      subject.insert(new OctreePoint(new Vec3(10, -5, 4), 1));
      subject.insert(new OctreePoint(new Vec3(10, 5, -4), 1));
      subject.insert(new OctreePoint(new Vec3(-10, 5, -4), 1));

      assert.equal(subject.depth(), 2);
    });
  });

  describe('indexOfOctantContainingPoint', function() {
    let subject = new Octree({
      center: new Vec3(0, 0, 0),
      root: true,
      halfDimension: 100
    });

    it('should give 0 for -, -, -', function() {
      assert.equal(subject.indexOfOctantContainingPoint(new Vec3(-1, -1, -1)), 0);

    });

    it('should give 1 for -, -, +', function() {
      assert.equal(subject.indexOfOctantContainingPoint(new Vec3(-1, -1, 1)), 1);
    });

    it('should give 2 for -, +, -', function() {
      assert.equal(subject.indexOfOctantContainingPoint(new Vec3(-1, 1, -1)), 2);
    });
  });

  describe('initializeChildren', function() {
    it('places the octants in the proper order', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100,
        breakpoint: 4
      });

      subject.initializeChildren();

      assert(subject.children[0] instanceof Octree);
      assert(subject.children[1] instanceof Octree);
      assert(subject.children[2] instanceof Octree);
      assert(subject.children[3] instanceof Octree);
      assert(subject.children[4] instanceof Octree);
      assert(subject.children[5] instanceof Octree);
      assert(subject.children[6] instanceof Octree);
      assert(subject.children[7] instanceof Octree);

      assert(subject.children[0].origin.x < 0);
      assert(subject.children[0].origin.y < 0);
      assert(subject.children[0].origin.z < 0);      

      assert(subject.children[1].origin.x < 0);
      assert(subject.children[1].origin.y < 0);
      assert(subject.children[1].origin.z > 0);      

      assert(subject.children[2].origin.x < 0);
      assert(subject.children[2].origin.y > 0);
      assert(subject.children[2].origin.z < 0);      

      assert(subject.children[3].origin.x < 0);
      assert(subject.children[3].origin.y > 0);
      assert(subject.children[3].origin.z > 0);      

      assert(subject.children[4].origin.x > 0);
      assert(subject.children[4].origin.y < 0);
      assert(subject.children[4].origin.z < 0);      

      assert(subject.children[5].origin.x > 0);
      assert(subject.children[5].origin.y < 0);
      assert(subject.children[5].origin.z > 0);      

      assert(subject.children[6].origin.x > 0);
      assert(subject.children[6].origin.y > 0);
      assert(subject.children[6].origin.z < 0);      

      assert(subject.children[7].origin.x > 0);
      assert(subject.children[7].origin.y > 0);
      assert(subject.children[7].origin.z > 0);      

    });

  });
  
  describe('octantContainingPoint', function() {
    let subject = new Octree({
      center: new Vec3(0, 0, 0),
      root: true,
      halfDimension: 100
    });

    subject.initializeChildren();

    it('should return 0th child for point at -10, -10, -10', function() {

      let childZeroPoint = new OctreePoint(new Vec3(-10, -10, -10), 1);
      let containingOctant = subject.octantContainingPoint(childZeroPoint);

      assert.equal(subject.children.indexOf(containingOctant), 0);
      assert(containingOctant.sphereFitsInsideOctant(childZeroPoint));
    });
  });

  // describe('octreeAtIndexShouldBePositive', function() {
  //   let subject = new Octree({
  //     center: new Vec3(0, 0, 0),
  //     root: true,
  //     halfDimension: 100
  //   });

  //   it('should be true for 0', function() {
  //     assert(subject.octreeAtIndexShouldBePositive('x', 0));
  //   });

  //   it('should be false for 4', function() {
  //     assert(subject.octreeAtIndexShouldBePositive('x', 0));
  //   });
  // });

  describe('Initialization', function() {
    let subject = new Octree({
      center: new Vec3(0, 0, 0),
      root: true,
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
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      assert(subject.isLeafNode());
    });

    it('should be true if one point is in octree', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      subject.insert(new OctreePoint(new Vec3(1,1,1), 1));
      assert(subject.isLeafNode());
    });

    it('should be false if two points are in octree', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      subject.insert(new OctreePoint(new Vec3(1,1,1), 1));
      subject.insert(new OctreePoint(new Vec3(-1, -1, -1), 1));
    });

  });

  describe('insert', function() {
    let subject = new Octree({
      center: new Vec3(0, 0, 0),
      root: true,
      halfDimension: 100
    });

    it('should be able to add a point', function() {
      let testPoint = new OctreePoint(new Vec3(10, 10, 10), 1);
      subject.insert(testPoint);

      assert(subject.points.length === 1);
      assert(subject.isLeafNode());
      assert(subject.points.indexOf(testPoint) != -1);
    });

    it('should be able to add a second point', function() {
      let secondPoint = new OctreePoint(new Vec3(-10, -10, -10), 1);
      subject.insert(secondPoint);

      assert.equal(subject.points.length, 2);
    });

    it('should blow up on insertion of a point which already exists', function() {
      let duplicatePoint = new OctreePoint(new Vec3(-10, -10, -10), 1);
      assert.throws(() => subject.insert(duplicatePoint), Error);
    });

    it('should redistribute points to child octants once breakpoint is reached', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100,
        breakpoint: 3
      });

      let point1 = new OctreePoint(new Vec3(10,  10,  10), 0);
      let point2 = new OctreePoint(new Vec3(10, -10,  10), 0);
      let point3 = new OctreePoint(new Vec3(10,  10, -10), 0);

      let point4 = new OctreePoint(new Vec3(10, -10, -10), 0);

      subject.insert(point1);
      subject.insert(point2);
      subject.insert(point3);

      assert.equal(subject.points.length, 3);

      subject.insert(point4);
      assert.equal(subject.children[4].points.length, 1);
      assert.equal(subject.points.length, 0);
    });
    
    it('should keep points inside an octant if it fits in more than one child', function() {
      
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      _.times(10, () => {
        subject.insert(new OctreePoint(new Vec3(
          Math.random() * 200 - 100,
          Math.random() * 200 - 100,
          Math.random() * 200 - 100          
        ), 1));
      });

      // We should have at least one level of octants below root now
      assert(subject.depth() > 1);

      let bigPoint = new OctreePoint(new Vec3(0, 0, 50), 25);
      subject.insert(bigPoint);
      assert(subject.points.indexOf(bigPoint) !== -1);
    });
  });

  describe('safeInsert', function() {
    // TODO
  });

  describe('subsumesSphereInDimension', function() {
    it('should succeed', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 50
      });

      let sphere = new OctreePoint(new Vec3(0, 0, 0), 30);

      assert.equal(sphere.minX, -30);
      assert.equal(sphere.maxX,  30);

      assert.equal(subject.minX, -50);
      assert.equal(subject.maxX,  50);

      assert(subject.subsumesSphereInDimension(sphere, "x"));
      assert(subject.subsumesSphereInDimension(sphere, "y"));
      assert(subject.subsumesSphereInDimension(sphere, "z"));

      assert(subject.sphereFitsInsideOctant(sphere));
    });

    xit('should fail', function() {

    });
  });
  
  describe('sphereFitsInsideOctant', function() {
    it('should return true for a point which fits inside the octant', function() {
      let subject = new Octree({
        center: new Vec3(50, 50, 50),
        root: true,
        halfDimension: 50
      });

      let testPoint = new OctreePoint(new Vec3(50, 50, 50), 10);

      assert(subject.sphereFitsInsideOctant(testPoint));
      assert.equal(subject.minZ, 0);
    });

    it('should return false for a point which fits inside the octant', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });
      let testPoint = new OctreePoint(new Vec3(0, 0, 0), 110);

      assert.equal(subject.sphereFitsInsideOctant(testPoint), false);
    });    
  });

  describe('getPoint', function() {
    it('should get a point if it exists', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });
      let testPoint = new Vec3(10, 10, 10);
      subject.insert(testPoint);

      assert(subject.points.length === 1);
      assert(subject.getPoint(testPoint));
      assert(subject.getPoint(testPoint).x === 10);
    });

  });
  describe('getPointsInsideBox', function() {
    let subject = new Octree({
      center: new Vec3(0, 0, 0),
      root: true,
      halfDimension: 100
    });
    let testPoint   = new OctreePoint(new Vec3(10, 10, 10));
    let secondPoint = new OctreePoint(new Vec3(-10, -10, -10));
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
    // See lines 41-43 starting with let match
    it('intersects top level', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      let point = new OctreePoint(new Vec3(0, 0, 0), 50);
      assert.equal(subject.minX,-100);
      assert.equal(subject.maxX, 100);

      assert.equal(point.minX, -50);
      assert.equal(point.maxX, 50);

      assert(subject.intersectsSphereInDimension(point, "x"));
    });

    it('does not intersect top level', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      let point = new OctreePoint(new Vec3(-500, -500, -500), 100);
      assert.equal(subject.minX,-100);
      assert.equal(subject.maxX, 100);
      assert.equal(point.minX, -600);
      assert.equal(point.maxX, -400);

      assert.equal(subject.intersectsSphereInDimension(point, "x"), false);
      assert.equal(subject.intersectsSphere(point), false);
    });

    describe('should not intersect', function() {
      it('should not intersect with a sphere outside its boundaries', function() {
        let subject = new Octree({
          center: new Vec3(0, 0, 0),
          root: true,
          halfDimension: 50
        });

        let point = new OctreePoint(new Vec3(100, 0, 0), 10);

        assert.equal(subject.intersectsSphereInDimension(point, 'x'), false);
      });
    });
  });

  describe('intersectsSphere', function() {

    it('should intersect a sphere at origin', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      let point = new OctreePoint(new Vec3(0, 0, 0), 50);
      subject.insert(point);

      assert(subject.intersectsSphere(point));
    });

    it('should intersect a sphere not at origin but totally inside the octant', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      let point = new OctreePoint(new Vec3(10, 10, 10), 50);
      subject.insert(point);

      assert(subject.intersectsSphere(point));
    });    

    it('should intersect a sphere not at origin but partially inside the octant', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      let point = new OctreePoint(new Vec3(-150, 0, 0), 100);
      subject.insert(point);

      assert(subject.intersectsSphere(point));
    });

    it('should not intersect a sphere outside its bounds', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 50
      });

      let point = new OctreePoint(new Vec3(300, 300, 300), 10);

      assert.equal(subject.intersectsSphere(point), false);
    });
  });

  describe('collectPoints', function() {
    it('should return an array', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });
      let res = subject.collectPoints();

      assert(Array.isArray(res));
      assert.equal(res.length, 0);
    });
    
    it('should return an array with one point from an octree of depth 0 with one point', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      let point = new OctreePoint(new Vec3(1,1,1), 1);
      subject.insert(point);
      let res = subject.collectPoints();
      assert.equal(res.length, 1);
      assert.equal(res[0], point);
    });

    it('should return points from children octants AND octant being called', function() {
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 100
      });

      let points = [];

      _.times(10, () => {
        points.push(new OctreePoint(new Vec3(
          Math.random() * 200 - 100,
          Math.random() * 200 - 100,
          Math.random() * 200 - 100
        ), 1));
      });

      points.forEach((point) => {
        subject.insert(point);
      });

      let bigPoint = new OctreePoint(new Vec3(0, 0, 50), 10);
      subject.insert(bigPoint);

      let res = subject.collectPoints();
      assert(subject.depth() > 1);
      console.log(subject.depth);
      assert.equal(subject.collectPoints().length, 11);
    });
  });

  describe('childrenIntersectingSphere', function() {
    it('should return all child octants which intersect with a points sphere', function(){
      let subject = new Octree({
        center: new Vec3(0, 0, 0),
        root: true,
        halfDimension: 50
      });

      subject.initializeChildren();
      let point = new OctreePoint(new Vec3(30, 0, 0), 10);
      assert.equal(subject.childrenIntersectingSphere(point).length, 4);
    });
  });
});
