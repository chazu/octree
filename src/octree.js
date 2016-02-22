"use strict";
let vektor = require('vektor');
let Vec3 = vektor.Vector;

class Octree {
  constructor(options) {
    this.origin = options.center;
    this.halfDimension = options.halfDimension;

    this.children = new Array(8);
    this.point = null;
  }

  octantContainingPoint(point) {
    var oct = 0;
    if(point.x >= this.origin.x) oct | 4;
    if(point.y >= this.origin.y) oct | 2;
    if(point.z >= this.origin.z) oct | 1;

    return oct;
  }

  isLeafNode() {
    return this.children[0] === undefined ||
      this.children[0] === null;
  }

  insert(point) {
    if (this.isLeafNode()) {
      if (this.point === null) {
        // Octant has no point data or has less point data than
        // we've established as a threshold for splitting -
        // just set the point data
      this.point = point;
      } else { // END octant has no point data
        // We need to split this octant
        let oldPoint = this.point;
        this.point = null;

        _.times(8, (i) => {
          let newOrigin = new Vec3({
            x: this.origin.x,
            y: this.origin.y,
            z: this.origin.z
          });

          newOrigin.x += this.halfDimension.x * (i&4 ? 0.5 : -0.5);
          newOrigin.y += this.halfDimension.y * (i&2 ? 0.5 : -0.5);
          newOrigin.z += this.halfDimension.z * (i&1 ? 0.5 : -0.5);

          this.children[i] = new Octree({
            center: newOrigin,
            halfDimension: this.halfDimension * 0.5
          });
        });

        // Put the old point data into its new home
        let numberOfOctantForOldPoint = this.octantContainingPoint(oldPoint);
        this.children[numberOfOctantForOldPoint].insert(oldPoint);

        // Insert the point we orignally came here to insert
        let numberOfOctantForNewPoint = this.octantContainingPoint(point);
        this.children[numberOfOctantForNewPoint].insert(point);
      }
    } else {  // END is leaf node is true
      // This isn't a leaf node - recurse into the appropriate leaf node
      this.children[octantContainingPoint(point)].insert(point);
    }
  }
}
