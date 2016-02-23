"use strict";
let _      = require('lodash');
let vektor = require('vektor');
let Vec3   = vektor.vector;

let valueMap = {
  x: [0, 0, 0, 0, 1, 1, 1, 1],
  y: [0, 0, 1, 1, 0, 0, 1, 1],
  z: [0, 1, 0, 1, 0, 1, 0, 1]
  
}
class Octree {
  constructor(options) {
    this.origin = options.center;
    this.halfDimension =  this.initializeHalfDimension(options);

    this.children = new Array(8);
    this.point = null;
  }

  initializeHalfDimension(options) {
    if (options.halfDimension) {
      if (typeof options.halfDimension === 'number') {
        return new Vec3(options.halfDimension,
                        options.halfDimension,
                        options.halfDimension);
      } else {
        return options.halfDimension; // Its already a Vec3
      }
    } else {
      return new Vec3(0, 0, 0);
    };
  }

  octantContainingPoint(point) {
    var oct = 0;
    if(point.x >= this.origin.x) oct = oct | 4;
    if(point.y >= this.origin.y) oct = oct | 2;
    if(point.z >= this.origin.z) oct = oct | 1;

    return oct;
  }

  isLeafNode() {
    return this.children[0] === undefined ||
      this.children[0] === null;
  }

  octreeAtIndexShouldBePositive(dimension, index) {
    return !(valueMap[dimension][index]);
  }

  initializeChildren() {
    var t = this;
    _.times(8, (i) => {
      let newOrigin = new Vec3({
        x: 0,
        y: 0,
        z: 0
      });

      newOrigin.x = t.origin.x + t.halfDimension.x * (this.octreeAtIndexShouldBePositive('x', i) ? 0.5 : -0.5);
      newOrigin.y = t.origin.y + t.halfDimension.y * (this.octreeAtIndexShouldBePositive('y', i) ? 0.5 : -0.5);
      newOrigin.z = t.origin.z + t.halfDimension.z * (this.octreeAtIndexShouldBePositive('z', i) ? 0.5 : -0.5);

      t.children[i] = new Octree({
        center: newOrigin,
        halfDimension: t.halfDimension.x * 0.5
      });
    });
  }

  safeInsert(point) {
    if (this.getPoint(point)) {
      // TODO probably want to throw here
      return false;
    }

    this.insert(point);
  }

  insert(point) {
    var t = this;

    if (this.isLeafNode()) {
      if (this.point === null) {
        // Octant has no point data or has less point data than
        // we've established as a threshold for splitting -
        // just set the point data
        this.point = point;
        return;
      } else { // END octant has no point data
        // We need to split this octant
        this.initializeChildren();

        // Put the old point data into its new home
        let numberOfOctantForOldPoint = this.octantContainingPoint(this.point);
        this.children[numberOfOctantForOldPoint].insert(this.point);
        this.point = null;

        // Insert the point we orignally came here to insert
        let numberOfOctantForNewPoint = this.octantContainingPoint(point);
        this.children[numberOfOctantForNewPoint].insert(point);
      } // END split octant with existing point data
    } else {  // END is leaf node is true
      // This isn't a leaf node - recurse into the appropriate leaf node
      this.children[this.octantContainingPoint(point)].insert(point);
    }
  }

  getPoint(point) {
    if (this.isLeafNode()) {
      console.log("is leaf node");
      if (this.point &&
          point.x === this.point.x &&
          point.y === this.point.y &&
          point.z === this.point.z) {
        return this.point;
      } else {
        return false;
      }
    } else {
      return this.children[this.octantContainingPoint(point)].getPoint(point);
    }
  }

  getPointsInsideBox(bmin, bmax) {
    return _.flatten(this._getPointsInsideBox(bmin, bmax));
  }

  _getPointsInsideBox(bmin, bmax) {
    let res = [];
    if (this.isLeafNode()) {
      if (!(this.point === null)) {
        if (!((this.point.x > bmax.x || this.point.y > bmax.y || this.point.z > bmax.z) ||
              (this.point.x < bmin.x || this.point.y < bmin.y || this.point.z < bmin.z))) { // Point is inside bounding box
          res.push(this.point);
        }
      }
    } else {
      this.children.forEach((childOctant) => {
        if (childOctant.intersectsQueryRectangle(bmin, bmax)) {
          res.push(childOctant._getPointsInsideBox(bmin, bmax));
        }
      });
    }
    return res;
  }

  intersectsQueryRectangle(bmin, bmax) {
    let thisMinVector = this.origin - this.halfDimension;
    let thisMaxVector = this.origin + this.halfDimension;
    
    return !(thisMaxVector.x < bmin.x || thisMaxVector.y < bmin.y || thisMaxVector.z < bmin.z) ||
      !(thisMinVector.x > bmax.x || thisMinVector.y > bmax.y || thisMinVector.z > bmax.z);
  }
}

module.exports = Octree;
