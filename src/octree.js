"use strict";

let _      = require('lodash');
let vektor = require('vektor');
let Vec3   = vektor.vector;

let OctreePoint = require('./octreePoint');

let valueMap = {
  x: [0, 0, 0, 0, 1, 1, 1, 1],
  y: [0, 0, 1, 1, 0, 0, 1, 1],
  z: [0, 1, 0, 1, 0, 1, 0, 1]
  
};

// WHOA WHOA WHOA...yeah whatever, I'm fine with this.
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

class Octree {
  constructor(options) {
    this.deferredEnabled = (options["defer"] === true);
    this.root            = options["root"] || false;
    this.origin          = options.center;
    this.halfDimension   = this.initializeHalfDimension(options);
    this.breakpoint      = options.breakpoint || 6;

    this.children = new Array(8);
    this.points   = [];
  }

  // Maximum and minimum bounds for this octant
  get maxX() { return this.origin.x + this.halfDimension.x; }
  get maxY() { return this.origin.y + this.halfDimension.y; }
  get maxZ() { return this.origin.z + this.halfDimension.z; }  

  get minX() { return this.origin.x - this.halfDimension.x; }
  get minY() { return this.origin.y - this.halfDimension.y; }
  get minZ() { return this.origin.z - this.halfDimension.z; }


  depth() {
    if (this.isLeafNode()) {
      return 1;
    } else {
      return 1 + _(this.children)
        .map((octant) => octant.depth())
        .max();
    }
  }

  childrenIntersectingSphere(point) {
    return this.children.filter((childOctant) => {
      return childOctant.intersectsSphere(point);
    });
  }

  intersectsSphereInDimension(point, dimension) {
    // consider extracting the three predicates here into their own functions for clarity
    var d;
    var upcasedDim = dimension.toUpperCase();
    var pointDimMin = point["min" + upcasedDim];
    var pointDimMax = point["max" + upcasedDim];

    var octantDimMin = this["min" + upcasedDim];
    var octantDimMax = this["max" + upcasedDim];
    
    // var match = (pointDimMax > octantDimMin && pointDimMax <= octantDimMax) ||
    //   (octantDimMax > pointDimMin && octantDimMin < pointDimMin)  ||
    //   (octantDimMin < pointDimMax && pointDimMax > octantDimMax);
    var match =  octantDimMax >= pointDimMin && pointDimMax >= octantDimMin; // x2 >= y1 and y2 >= x1
    return match;
  }

  intersectsSphere(point) {
    return this.intersectsSphereInDimension(point, "x") &&
      this.intersectsSphereInDimension(point, "y") &&
      this.intersectsSphereInDimension(point, "z");
  }

  collectPoints(memo) {
    if (!this.isLeafNode()) { // If Children
      return _.chain(this.children)
            .map((octant) => {
              return octant.collectPoints();
            })
        .flatten()
        .reject(isNull)
        .value();
    } else {
      return this.points;
    };
  }

  pointsCollidingWithPoint(point) {
    // TODO - Collect points from the topmost octant intersecting sphere
    // and all its childrens
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

  indexOfOctantContainingPoint(point) {
    var oct = 0;
    if(point.x >= this.origin.x) oct = oct | 4;
    if(point.y >= this.origin.y) oct = oct | 2;
    if(point.z >= this.origin.z) oct = oct | 1;

    return oct;
  }
  
  octantContainingPoint(point) {
    let index = this.indexOfOctantContainingPoint(point);
    return this.children[index];
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
    return true;
  };

  setPoint(point) {
    if (!point instanceof OctreePoint) {
      throw new Error("Octree can only contain OctreePoint instances!");
    }
    this.points.push(point);
  }

  dimensionsOfChildOctants() {
    return new Vec3(
      this.halfDimension,
      this.halfDimension,
      this.halfDimension
    );
  }

  insert(point) {
    if (this.deferredEnabled) {
      this.deferred.push(point);
    } else {
      this._insert(point);
    }
  }

  insertDeferred() {
    this.deferred.forEach((p) => { this._insert(p); });
  }

  isLeafNode() {
    return this.children[0] === undefined ||
      this.children[0] === null;
  }

  hasPointData() {
    return this.points.length > 0;
  }

  containsPointEqualTo(other) {
    return _.some(this.points, (point) => point.equalsOtherPoint(other));
  }
  
  _insert(point) {
    var t = this;

    if (this.isLeafNode()) {
      if (this.containsPointEqualTo(point)) {
        throw new Error("Cannot insert existing point");
      }

      if (this.points.length < this.breakpoint) {
        // Octant has no point data or has less point data than
        // we've established as a threshold for splitting -
        // just set the point data
        this.setPoint(point);
        return;
      } else if (this.needsToSplit()) { // END octant has no point data
        // We need to split this octant
        this.initializeChildren();

        // Put the old point data into its new home
        // TODO if the sphere won't fit into the child octant, it has to stay here
        _.each(this.points, (aPoint) => {
          this.octantContainingPoint(aPoint).insert(aPoint);
          this._removePoint(aPoint);
        });

        // Insert the point we orignally came here to insert
        this.octantContainingPoint(point).insert(point);
      } // END split octant with existing point data
    } else {  // END is leaf node is true
      // This isn't a leaf node - recurse into the appropriate leaf node
      this.octantContainingPoint(point).insert(point);
    }
  }

  _removePoint(point) {
    // Remove a point from this octant's array.
    this.points.remove(this.points.indexOf(point));
  }

  needsToSplit() {
    return this.points.length >= this.breakpoint;
  }

  delete(point) {
    // Delete a point entirely from the octree
    if (this.isLeafNode()) {
      if (_.contains(this.points, point)) {
        this._removePoint(point);
        return true;
      }
      return false;
    } else {
      return this.children[this.octantContainingPoint(point)].delete(point);
    }
  }

  getPoint(point) {
    if (this.isLeafNode() && this.hasPointData()) {
      return _.find(this.points, (aPoint) => {
        return point.x === aPoint.x &&
          point.y === aPoint.y &&
          point.z === aPoint.z;
      });
    } else if (this.isLeafNode()){
        return false;
    } else {
      return this.children[this.octantContainingPoint(point)].getPoint(point);
    }
  }

  getPointsInsideBox(bmin, bmax) {
    return _.flatten(this._getPointsInsideBox(bmin, bmax));
  }

  // TODO Continue from here
  _getPointsInsideBox(bmin, bmax) {
    let res = [];
      if (this.hasPointData()) {
        this.points.forEach((aPoint) => {
          if (!((aPoint.x > bmax.x || aPoint.y > bmax.y || aPoint.z > bmax.z) ||
                (aPoint.x < bmin.x || aPoint.y < bmin.y || aPoint.z < bmin.z))) { // Point is inside bounding box
            res.push(aPoint);
          }
        });
      }
    if (!(this.isLeafNode())) {
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

function isNull(x) {
  return x === null;
}
module.exports = Octree;
