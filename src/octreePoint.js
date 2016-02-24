"use strict";

let distance = require('euclidean-distance');

class OctreePoint {
  constructor(locationVector, radius) {
    this.vector = locationVector;
    this._radius = radius;
  }

  get x() { return this.vector.x; }
  get y() { return this.vector.y; }
  get z() { return this.vector.z; }

  get position() {
    return this.locationVector;
  }

  intersects(otherPoint) {
    return this.distanceTo(otherPoint) <= 0;
  }

  // Return the distance from our bounding sphere to theirs
  distanceTo(otherPoint) {
    return this.distanceToPoint(otherPoint) - (this.radius + otherPoint.radius);
  }

  // Return the distance without worrying about bounding spheres
  distanceToPoint(otherPoint) {
    return distance(this.vector.v, otherPoint.vector.v);
  }

  get radius() {
    return this._radius;
  }
  setPosition(vector) {
    this.locationVector = vector;
  }
}

module.exports = OctreePoint;
