"use strict";

class OctreePoint {
  constructor(locationVector, radius) {
    this.vector = locationVector;
    this.radius = radius;
  }

  get x() { return this.vector.x; }
  get y() { return this.vector.y; }
  get z() { return this.vector.z; }

  get position() {
    return this.locationVector;
  }

  intersects(otherPoint) {
    // TODO
  }

  // Return the distance from our bounding sphere to theirs
  distanceTo(otherPoint) {
    // TODO 
  }

  // Return the distance without worrying about bounding spheres
  distanceToPoint(otherPoint) {
    // TODO
  }

  get radius() {
    return this.radius;
  }
  setPosition(vector) {
    this.locationVector = vector;
  }
}

module.exports = OctreePoint;
