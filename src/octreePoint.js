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

  get maxX() { return this.vector.x + this._radius; };
  get maxY() { return this.vector.y + this._radius; };
  get maxZ() { return this.vector.z + this._radius; };

  get minX() { return this.vector.x - this._radius; };
  get minY() { return this.vector.y - this._radius; };
  get minZ() { return this.vector.z - this._radius; };
  
  get position() {
    return this.locationVector;
  }

  equalsOtherPoint(other) {
    return this.x === other.x &&
      this.y === other.y &&
      this.z === other.z;
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
