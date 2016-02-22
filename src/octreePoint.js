"use strict";

class OctreePoint {
  constructor(locationVector, radius) {
    this.locationVector = locationVector;
    this.radius = radius;
  }

  get position() {
    return this.locationVector;
  }

  setPosition(vector) {
    this.locationVector = vector;
  }
}

module.exports = OctreePoint;
