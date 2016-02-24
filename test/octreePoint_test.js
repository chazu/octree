var assert = require('assert');
var Vec3 = require('vektor').vector;

var OctreePoint = require('./../src/OctreePoint')

describe('OctreePoint', function() {
describe('initialization', function() {  
  var subject = new OctreePoint(new Vec3(10, 10, 10), 10);
  it('should have x, y and z', function() {
    assert.equal(subject.x, 10);
    assert.equal(subject.y, 10);
    assert.equal(subject.z, 10);                        
  });

  it('should have a radius', function() {
    assert.equal(subject.radius, 10);
  });
});

  describe('distanceToPoint', function() {
    var subject = new OctreePoint(new Vec3(10, 0, 0), 10);
    var other   = new OctreePoint(new Vec3(-10, 0, 0), 5);

    assert.equal(subject.distanceToPoint(other), 20);
  });

  describe('distanceTo', function() {
    var subject = new OctreePoint(new Vec3(10, 0, 0), 10);
    var other   = new OctreePoint(new Vec3(-10, 0, 0), 5);

    assert.equal(subject.distanceTo(other), 5);
  });

  describe('intersects', function() {
    var subject = new OctreePoint(new Vec3(10, 0, 0), 10);
    var other   = new OctreePoint(new Vec3(0, 0, 0), 25);

    assert(subject.intersects(other));
  });
});
